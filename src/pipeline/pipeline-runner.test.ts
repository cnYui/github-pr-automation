import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeJsonFileAtomic } from '../shared/json-file';
import type { OpportunityReport } from '../shared/report-schema';
import {
  closePipelineWindow,
  getNextPipelineCandidate,
  getPipelinePathsForProject,
  readCurrentPipelineRun,
  recordCandidatePreflight,
  startPipeline,
  transitionPipelineCandidate
} from './pipeline-runner';
import { readPipelineLedger } from './pipeline-store';

const createReport = (itemCount = 1): OpportunityReport => ({
  date: '2026-07-11',
  generatedAt: '2026-07-11T00:00:00.000Z',
  summary: { candidateCount: itemCount, actionableCount: itemCount },
  items: Array.from({ length: itemCount }, (_, index) => ({
    rank: index + 1,
    repository: {
      owner: 'example',
      name: `repo-${index + 1}`,
      url: `https://github.com/example/repo-${index + 1}`,
      primaryLanguage: 'TypeScript'
    },
    popularity: {
      starsTotal: 100 - index,
      starsAdded24h: 5 - index,
      lastUpdatedAt: '2026-07-10T00:00:00.000Z'
    },
    health: {
      license: 'MIT',
      hasCi: true,
      hasTests: true,
      hasContributing: true,
      issueActivity: 'active'
    },
    opportunity: {
      category: '小 bug',
      summary: `修复候选问题 ${index + 1}`,
      evidence: ['问题仍可复现', '没有重复 PR']
    },
    risk: { level: '低', reason: '修改范围集中且可本地验证' },
    recommendation: '值得继续'
  }))
});

const createProject = async (itemCount = 1, maxPrsPerRun = 2) => {
  const root = await mkdtemp(join(tmpdir(), 'github-pr-pipeline-'));
  const reportPath = join(root, 'public', 'reports', '2026-07-11.json');

  await writeJsonFileAtomic(join(root, 'config', 'pipeline.json'), {
    maxCandidates: 10,
    maxPrsPerRun,
    leaseMinutes: 60,
    stateRoot: 'data/pipeline',
    workspaceRoot: 'work/opportunity-pipeline'
  });
  await writeJsonFileAtomic(reportPath, createReport(itemCount));

  return { root, reportPath: 'public/reports/2026-07-11.json' };
};

const approvedPreflight = {
  checkedAt: '2026-07-11T00:10:00.000Z',
  defaultBranchSha: '1234567890abcdef',
  issueUrl: 'https://github.com/example/repo-1/issues/42',
  issueState: 'open' as const,
  defaultBranchContainsFix: false,
  duplicatePullRequest: false,
  contributionGate: 'allowed' as const,
  localVerification: ['npm test -- target.test.ts'],
  communicationLanguage: 'English',
  notes: []
};

const submittedResult = (index = 1) => ({
  branch: `fix/candidate-${index}`,
  commitSha: 'abcdef1234567890',
  pullRequestUrl: `https://github.com/example/repo-${index}/pull/1`,
  verificationSummary: ['目标测试通过'],
  ciStatus: 'pending' as const
});

const executionContext = (index = 1) => ({
  workspacePath: `work/opportunity-pipeline/example__repo-${index}`,
  branch: `fix/candidate-${index}`,
  upstreamRepository: `example/repo-${index}`,
  baseBranch: 'main',
  baseSha: '1234567890abcdef'
});

const publicationIntent = (index = 1) => ({
  preparedAt: '2026-07-11T00:30:00.000Z',
  upstreamRepository: `example/repo-${index}`,
  baseBranch: 'main',
  headOwner: 'contributor',
  headBranch: `fix/candidate-${index}`
});

describe('pipeline runner', () => {
  it('保存不可变候选快照并在下一窗口恢复运行', async () => {
    const project = await createProject();
    const first = await startPipeline({
      projectRoot: project.root,
      reportPath: project.reportPath,
      now: new Date('2026-07-11T00:00:00.000Z'),
      runId: 'run-1'
    });
    const paths = await getPipelinePathsForProject(project.root);
    const snapshotPath = join(paths.runs, 'run-1', 'candidates.json');
    const originalSnapshot = await readFile(snapshotPath, 'utf8');

    await writeFile(join(project.root, project.reportPath), '{}', 'utf8');
    await closePipelineWindow(
      project.root,
      first.run.window.id,
      new Date('2026-07-11T00:20:00.000Z')
    );

    const resumed = await startPipeline({
      projectRoot: project.root,
      now: new Date('2026-07-11T01:00:00.000Z')
    });

    expect(first.resumed).toBe(false);
    expect(resumed.resumed).toBe(true);
    expect(resumed.run.runId).toBe('run-1');
    expect(await readFile(snapshotPath, 'utf8')).toBe(originalSnapshot);

    await closePipelineWindow(
      project.root,
      resumed.run.window.id,
      new Date('2026-07-11T01:10:00.000Z')
    );
  });

  it('拒绝并发租约', async () => {
    const project = await createProject();

    const started = await startPipeline({
      projectRoot: project.root,
      reportPath: project.reportPath,
      now: new Date('2026-07-11T00:00:00.000Z'),
      runId: 'run-lease'
    });

    await expect(
      startPipeline({
        projectRoot: project.root,
        now: new Date('2026-07-11T00:01:00.000Z')
      })
    ).rejects.toThrow('流水线正在运行');

    await expect(
      transitionPipelineCandidate({
        projectRoot: project.root,
        leaseId: 'another-window',
        candidateId: started.run.candidates[0]!.id,
        status: 'skipped',
        message: '不应写入'
      })
    ).rejects.toThrow('当前执行窗口不持有流水线租约');

    const current = await readCurrentPipelineRun(project.root);
    await closePipelineWindow(
      project.root,
      current!.window.id,
      new Date('2026-07-11T00:02:00.000Z')
    );
  });

  it('租约过期后允许恢复原运行', async () => {
    const project = await createProject();

    await startPipeline({
      projectRoot: project.root,
      reportPath: project.reportPath,
      now: new Date('2026-07-11T00:00:00.000Z'),
      runId: 'run-expired'
    });
    const resumed = await startPipeline({
      projectRoot: project.root,
      now: new Date('2026-07-11T02:00:00.000Z')
    });

    expect(resumed.resumed).toBe(true);
    expect(resumed.run.runId).toBe('run-expired');
    await closePipelineWindow(
      project.root,
      resumed.run.window.id,
      new Date('2026-07-11T02:01:00.000Z')
    );
  });

  it('强制 preflight 通过后才能进入实现和提交状态', async () => {
    const project = await createProject();
    const { run } = await startPipeline({
      projectRoot: project.root,
      reportPath: project.reportPath,
      now: new Date('2026-07-11T00:00:00.000Z'),
      runId: 'run-preflight'
    });
    const candidateId = run.candidates[0]!.id;

    await recordCandidatePreflight({
      projectRoot: project.root,
      leaseId: run.window.id,
      candidateId,
      preflight: { ...approvedPreflight, defaultBranchContainsFix: true }
    });
    await expect(
      transitionPipelineCandidate({
        projectRoot: project.root,
        leaseId: run.window.id,
        candidateId,
        status: 'implementing'
      })
    ).rejects.toThrow('preflight 未通过');

    await recordCandidatePreflight({
      projectRoot: project.root,
      leaseId: run.window.id,
      candidateId,
      preflight: approvedPreflight
    });
    await expect(
      transitionPipelineCandidate({
        projectRoot: project.root,
        leaseId: run.window.id,
        candidateId,
        status: 'implementing',
        execution: { ...executionContext(), workspacePath: '../outside' }
      })
    ).rejects.toThrow('执行工作区必须位于允许目录内');
    await transitionPipelineCandidate({
      projectRoot: project.root,
      leaseId: run.window.id,
      candidateId,
      status: 'implementing',
      execution: executionContext()
    });
    await transitionPipelineCandidate({
      projectRoot: project.root,
      leaseId: run.window.id,
      candidateId,
      status: 'verifying'
    });
    await transitionPipelineCandidate({
      projectRoot: project.root,
      leaseId: run.window.id,
      candidateId,
      status: 'publishing',
      publication: publicationIntent()
    });
    expect(await getNextPipelineCandidate(project.root, run.window.id)).toMatchObject({
      status: 'candidate',
      candidate: {
        status: 'publishing',
        execution: executionContext(),
        publication: publicationIntent()
      }
    });
    await transitionPipelineCandidate({
      projectRoot: project.root,
      leaseId: run.window.id,
      candidateId,
      status: 'pr_opened',
      result: submittedResult()
    });

    const completed = await closePipelineWindow(
      project.root,
      run.window.id,
      new Date('2026-07-11T01:00:00.000Z')
    );
    const ledger = await readPipelineLedger(await getPipelinePathsForProject(project.root));

    expect(completed.status).toBe('completed');
    expect(await readCurrentPipelineRun(project.root)).toBeNull();
    expect(ledger.entries).toHaveLength(1);

    const duplicateRun = await startPipeline({
      projectRoot: project.root,
      reportPath: project.reportPath,
      now: new Date('2026-07-12T00:00:00.000Z'),
      runId: 'run-duplicate'
    });
    expect(duplicateRun.run.candidates[0]).toMatchObject({
      status: 'skipped',
      statusMessage: '账本中已存在本机会的已提交 PR'
    });
    await closePipelineWindow(
      project.root,
      duplicateRun.run.window.id,
      new Date('2026-07-12T00:01:00.000Z')
    );
  });

  it('按窗口限制 PR 数量并在下一次启动后继续', async () => {
    const project = await createProject(2, 1);
    const { run } = await startPipeline({
      projectRoot: project.root,
      reportPath: project.reportPath,
      now: new Date('2026-07-11T00:00:00.000Z'),
      runId: 'run-limit'
    });
    const firstCandidate = run.candidates[0]!;

    await recordCandidatePreflight({
      projectRoot: project.root,
      leaseId: run.window.id,
      candidateId: firstCandidate.id,
      preflight: approvedPreflight
    });
    await transitionPipelineCandidate({
      projectRoot: project.root,
      leaseId: run.window.id,
      candidateId: firstCandidate.id,
      status: 'implementing',
      execution: executionContext()
    });
    await transitionPipelineCandidate({
      projectRoot: project.root,
      leaseId: run.window.id,
      candidateId: firstCandidate.id,
      status: 'verifying'
    });
    await transitionPipelineCandidate({
      projectRoot: project.root,
      leaseId: run.window.id,
      candidateId: firstCandidate.id,
      status: 'publishing',
      publication: publicationIntent()
    });
    await transitionPipelineCandidate({
      projectRoot: project.root,
      leaseId: run.window.id,
      candidateId: firstCandidate.id,
      status: 'pr_opened',
      result: submittedResult()
    });

    expect(await getNextPipelineCandidate(project.root, run.window.id)).toMatchObject({
      status: 'limit_reached'
    });
    await closePipelineWindow(
      project.root,
      run.window.id,
      new Date('2026-07-11T01:00:00.000Z')
    );

    const resumed = await startPipeline({
      projectRoot: project.root,
      now: new Date('2026-07-12T00:00:00.000Z')
    });
    expect(
      await getNextPipelineCandidate(project.root, resumed.run.window.id)
    ).toMatchObject({
      status: 'candidate',
      candidate: { repository: { name: 'repo-2' } }
    });

    await transitionPipelineCandidate({
      projectRoot: project.root,
      leaseId: resumed.run.window.id,
      candidateId: run.candidates[1]!.id,
      status: 'skipped',
      message: '测试结束，未执行第二个候选'
    });
    await closePipelineWindow(
      project.root,
      resumed.run.window.id,
      new Date('2026-07-12T00:10:00.000Z')
    );
  });
});
