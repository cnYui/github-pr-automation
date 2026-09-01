import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { parseReport, type ReportItem } from '../shared/report-schema';
import { writeJsonFileAtomic } from '../shared/json-file';
import { resolveWithinRoot, toRelativePathInsideRoot } from '../shared/path';
import {
  candidateExecutionSchema,
  candidateSnapshotSchema,
  candidatePreflightSchema,
  candidateResultSchema,
  pipelineRunSchema,
  publicationIntentSchema,
  type CandidateExecution,
  type CandidatePreflight,
  type CandidateResult,
  type CandidateStatus,
  type PipelineCandidate,
  type PipelineRun,
  type PublicationIntent
} from './pipeline-schema';
import {
  acquirePipelineLease,
  clearCurrentRun,
  createPipelinePaths,
  getRunDirectory,
  loadPipelineConfig,
  readCurrentRunId,
  readPipelineLedger,
  readPipelineRun,
  refreshPipelineLease,
  releasePipelineLease,
  writeCurrentRunId,
  writePipelineLedger,
  writePipelineRun,
  type PipelinePaths
} from './pipeline-store';

export type StartPipelineInput = {
  projectRoot: string;
  reportPath?: string;
  now?: Date;
  runId?: string;
};

export type TransitionCandidateInput = {
  projectRoot: string;
  leaseId: string;
  candidateId: string;
  status: Exclude<CandidateStatus, 'pending' | 'preflight'>;
  message?: string;
  execution?: CandidateExecution;
  publication?: PublicationIntent;
  result?: CandidateResult;
  now?: Date;
};

const hashText = (value: string): string => {
  return createHash('sha256').update(value).digest('hex');
};

const createRunId = (now: Date): string => {
  return `${now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}-${hashText(now.toISOString()).slice(0, 6)}`;
};

const createOpportunityKey = (item: ReportItem): string => {
  const repository = `${item.repository.owner}/${item.repository.name}`;
  return `${repository}:${hashText(item.opportunity.summary).slice(0, 16)}`;
};

const createCandidate = (
  item: ReportItem,
  now: Date,
  alreadySubmitted: boolean
): PipelineCandidate => ({
  id: hashText(`${item.repository.owner}/${item.repository.name}\n${item.opportunity.summary}`).slice(0, 16),
  opportunityKey: createOpportunityKey(item),
  rank: item.rank,
  repository: item.repository,
  suggestedCut: item.opportunity.summary,
  evidence: item.opportunity.evidence,
  risk: item.risk,
  status: alreadySubmitted ? 'skipped' : 'pending',
  statusMessage: alreadySubmitted ? '账本中已存在本机会的已提交 PR' : undefined,
  updatedAt: now.toISOString()
});

const createWindow = (now: Date) => ({
  id: `${now.toISOString()}-${hashText(String(now.getTime())).slice(0, 6)}`,
  startedAt: now.toISOString(),
  prsOpened: 0
});

const getCurrentRun = async (projectRoot: string) => {
  const config = await loadPipelineConfig(projectRoot);
  const paths = createPipelinePaths(projectRoot, config);
  const runId = await readCurrentRunId(paths);

  if (!runId) {
    throw new Error('没有正在执行的流水线运行');
  }

  return { config, paths, run: await readPipelineRun(paths, runId) };
};

export const startPipeline = async (
  input: StartPipelineInput
): Promise<{ resumed: boolean; run: PipelineRun }> => {
  const projectRoot = resolve(input.projectRoot);
  const config = await loadPipelineConfig(projectRoot);
  const paths = createPipelinePaths(projectRoot, config);
  const now = input.now ?? new Date();
  const currentRunId = await readCurrentRunId(paths);

  if (currentRunId) {
    const currentRun = await readPipelineRun(paths, currentRunId);

    if (currentRun.status === 'running') {
      const window = createWindow(now);
      await acquirePipelineLease(
        paths,
        currentRun.runId,
        window.id,
        config.leaseMinutes,
        now
      );
      await refreshPipelineLease(
        paths,
        currentRun.runId,
        window.id,
        config.leaseMinutes,
        now
      );
      const resumedRun = pipelineRunSchema.parse({
        ...currentRun,
        updatedAt: now.toISOString(),
        window
      });
      await writePipelineRun(paths, resumedRun);
      return { resumed: true, run: resumedRun };
    }

    await clearCurrentRun(paths);
  }

  if (!input.reportPath) {
    throw new Error('没有未完成运行时必须提供 --report');
  }

  const absoluteReportPath = resolveWithinRoot(projectRoot, input.reportPath, '报告文件');
  const rawReport = await readFile(absoluteReportPath, 'utf8');
  const report = parseReport(JSON.parse(rawReport));
  const sourceReportPath = toRelativePathInsideRoot(projectRoot, absoluteReportPath, '报告文件');
  const sourceReportSha256 = hashText(rawReport);
  const runId = input.runId ?? createRunId(now);
  const window = createWindow(now);

  await acquirePipelineLease(paths, runId, window.id, config.leaseMinutes, now);

  try {
    await refreshPipelineLease(paths, runId, window.id, config.leaseMinutes, now);
    const ledger = await readPipelineLedger(paths);
    const submittedKeys = new Set(ledger.entries.map((entry) => entry.opportunityKey));
    const candidates = report.items
      .filter((item) => item.recommendation === '值得继续')
      .slice(0, config.maxCandidates)
      .map((item) => createCandidate(item, now, submittedKeys.has(createOpportunityKey(item))));
    const run = pipelineRunSchema.parse({
      version: 1,
      runId,
      status: 'running',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      sourceReport: {
        path: sourceReportPath,
        sha256: sourceReportSha256,
        date: report.date,
        generatedAt: report.generatedAt
      },
      window,
      candidates
    });
    const runDirectory = getRunDirectory(paths, runId);

    await writeJsonFileAtomic(
      join(runDirectory, 'candidates.json'),
      candidateSnapshotSchema.parse({
        version: 1,
        runId,
        sourceReportPath,
        sourceReportSha256,
        report
      })
    );
    await writePipelineRun(paths, run);
    await writeCurrentRunId(paths, runId);

    return { resumed: false, run };
  } catch (error) {
    await releasePipelineLease(paths, runId, window.id);
    throw error;
  }
};

export const readCurrentPipelineRun = async (
  projectRoot: string
): Promise<PipelineRun | null> => {
  const config = await loadPipelineConfig(projectRoot);
  const paths = createPipelinePaths(projectRoot, config);
  const runId = await readCurrentRunId(paths);
  return runId ? readPipelineRun(paths, runId) : null;
};

export const getNextPipelineCandidate = async (projectRoot: string, leaseId: string) => {
  const { config, paths, run } = await getCurrentRun(projectRoot);

  await refreshPipelineLease(paths, run.runId, leaseId, config.leaseMinutes);

  if (run.window.prsOpened >= config.maxPrsPerRun) {
    return { status: 'limit_reached' as const, candidate: null };
  }

  const priorities: CandidateStatus[] = [
    'publishing',
    'verifying',
    'implementing',
    'preflight',
    'pending'
  ];
  const candidate = priorities
    .map((status) => run.candidates.find((item) => item.status === status))
    .find((item) => item !== undefined);

  return candidate
    ? { status: 'candidate' as const, candidate }
    : { status: 'empty' as const, candidate: null };
};

export const recordCandidatePreflight = async (input: {
  projectRoot: string;
  leaseId: string;
  candidateId: string;
  preflight: CandidatePreflight;
  now?: Date;
}): Promise<PipelineRun> => {
  const now = input.now ?? new Date();
  const { config, paths, run } = await getCurrentRun(input.projectRoot);
  await refreshPipelineLease(paths, run.runId, input.leaseId, config.leaseMinutes, now);
  const preflight = candidatePreflightSchema.parse(input.preflight);
  const candidate = run.candidates.find((item) => item.id === input.candidateId);

  if (!candidate) {
    throw new Error(`候选项目不存在：${input.candidateId}`);
  }

  if (candidate.status !== 'pending' && candidate.status !== 'preflight') {
    throw new Error(`当前状态不能记录 preflight：${candidate.status}`);
  }

  candidate.preflight = preflight;
  candidate.status = 'preflight';
  candidate.statusMessage = undefined;
  candidate.updatedAt = now.toISOString();
  run.updatedAt = now.toISOString();

  await writePipelineRun(paths, run);
  return run;
};

const isPreflightApproved = (candidate: PipelineCandidate): boolean => {
  const preflight = candidate.preflight;

  return Boolean(
    preflight &&
      preflight.issueState !== 'closed' &&
      !preflight.defaultBranchContainsFix &&
      !preflight.duplicatePullRequest &&
      preflight.contributionGate === 'allowed' &&
      preflight.localVerification.length > 0 &&
      preflight.communicationLanguage.trim()
  );
};

const allowedTransitions: Record<CandidateStatus, CandidateStatus[]> = {
  pending: ['skipped', 'blocked'],
  preflight: ['implementing', 'skipped', 'blocked'],
  implementing: ['verifying', 'skipped', 'blocked'],
  verifying: ['publishing', 'skipped', 'blocked'],
  publishing: ['pr_opened', 'skipped', 'blocked'],
  pr_opened: [],
  skipped: [],
  blocked: []
};

export const transitionPipelineCandidate = async (
  input: TransitionCandidateInput
): Promise<PipelineRun> => {
  const now = input.now ?? new Date();
  const { config, paths, run } = await getCurrentRun(input.projectRoot);
  await refreshPipelineLease(paths, run.runId, input.leaseId, config.leaseMinutes, now);
  const candidate = run.candidates.find((item) => item.id === input.candidateId);

  if (!candidate) {
    throw new Error(`候选项目不存在：${input.candidateId}`);
  }

  if (!allowedTransitions[candidate.status].includes(input.status)) {
    throw new Error(`不允许从 ${candidate.status} 转换到 ${input.status}`);
  }

  if (input.status === 'implementing' && !isPreflightApproved(candidate)) {
    throw new Error('preflight 未通过，禁止进入实现阶段');
  }

  if (input.status === 'implementing') {
    const execution = candidateExecutionSchema.parse(input.execution);
    const workspacePath = resolveWithinRoot(
      paths.workspaceRoot,
      resolve(paths.projectRoot, execution.workspacePath),
      '执行工作区'
    );
    candidate.execution = {
      ...execution,
      workspacePath: toRelativePathInsideRoot(paths.projectRoot, workspacePath, '执行工作区')
    };
  }

  if (input.status === 'publishing') {
    candidate.publication = publicationIntentSchema.parse(input.publication);
  }

  if ((input.status === 'skipped' || input.status === 'blocked') && !input.message?.trim()) {
    throw new Error(`${input.status} 必须记录原因`);
  }

  if (input.status === 'pr_opened') {
    const result = candidateResultSchema.parse(input.result);
    const ledger = await readPipelineLedger(paths);
    const entries = ledger.entries.filter(
      (entry) => entry.opportunityKey !== candidate.opportunityKey
    );

    entries.push({
      opportunityKey: candidate.opportunityKey,
      runId: run.runId,
      status: 'pr_opened',
      pullRequestUrl: result.pullRequestUrl,
      updatedAt: now.toISOString()
    });
    await writePipelineLedger(paths, { version: 1, entries });
    candidate.result = result;
    run.window.prsOpened += 1;
  }

  candidate.status = input.status;
  candidate.statusMessage = input.message?.trim() || undefined;
  candidate.updatedAt = now.toISOString();
  run.updatedAt = now.toISOString();

  await writePipelineRun(paths, run);
  return run;
};

const createSummary = (run: PipelineRun): string => {
  const lines = [
    `# GitHub PR 自动化运行 ${run.runId}`,
    '',
    `- 状态：${run.status}`,
    `- 报告：${run.sourceReport.path}`,
    `- 更新时间：${run.updatedAt}`,
    '',
    '## 候选结果',
    ''
  ];

  for (const candidate of run.candidates) {
    const repository = `${candidate.repository.owner}/${candidate.repository.name}`;
    const pr = candidate.result ? `，PR：${candidate.result.pullRequestUrl}` : '';
    const message = candidate.statusMessage ? `，说明：${candidate.statusMessage}` : '';
    lines.push(`- ${repository}：${candidate.status}${pr}${message}`);
  }

  return `${lines.join('\n')}\n`;
};

export const closePipelineWindow = async (
  projectRoot: string,
  leaseId: string,
  now = new Date()
): Promise<PipelineRun> => {
  const { config, paths, run } = await getCurrentRun(projectRoot);
  await refreshPipelineLease(paths, run.runId, leaseId, config.leaseMinutes, now);
  const allTerminal = run.candidates.every((candidate) =>
    ['pr_opened', 'skipped', 'blocked'].includes(candidate.status)
  );

  run.status = allTerminal ? 'completed' : 'running';
  run.updatedAt = now.toISOString();
  await writePipelineRun(paths, run);

  const runDirectory = getRunDirectory(paths, run.runId);
  await mkdir(runDirectory, { recursive: true });
  await writeFile(join(runDirectory, 'summary.md'), createSummary(run), 'utf8');

  if (allTerminal) {
    await clearCurrentRun(paths);
  }

  await releasePipelineLease(paths, run.runId, leaseId);
  return run;
};

export type CleanWorkspaceInput = {
  projectRoot: string;
  retentionDays?: number;
  now?: Date;
};

export type CleanWorkspaceResult = {
  workspaceRoot: string;
  retentionDays: number;
  removed: string[];
  removedCount: number;
  keptCount: number;
  now: string;
};

const DAY_IN_MS = 86_400_000;

export const cleanWorkspace = async (
  input: CleanWorkspaceInput
): Promise<CleanWorkspaceResult> => {
  const projectRoot = resolve(input.projectRoot);
  const config = await loadPipelineConfig(projectRoot);
  const paths = createPipelinePaths(projectRoot, config);
  const now = input.now ?? new Date();
  const retentionDays = input.retentionDays ?? config.workspaceRetentionDays;

  if (!Number.isInteger(retentionDays) || retentionDays < 0) {
    throw new Error('保留天数必须是非负整数');
  }

  const workspaceRoot = toRelativePathInsideRoot(
    projectRoot,
    paths.workspaceRoot,
    '候选仓库目录'
  );
  const cutoff = now.getTime() - retentionDays * DAY_IN_MS;
  const result: CleanWorkspaceResult = {
    workspaceRoot,
    retentionDays,
    removed: [],
    removedCount: 0,
    keptCount: 0,
    now: now.toISOString()
  };

  let entries;

  try {
    entries = await readdir(paths.workspaceRoot, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return result;
    }

    throw error;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const directory = join(paths.workspaceRoot, entry.name);
    const info = await stat(directory);

    if (info.mtimeMs < cutoff) {
      await rm(directory, { recursive: true, force: true });
      result.removed.push(entry.name);
    } else {
      result.keptCount += 1;
    }
  }

  result.removedCount = result.removed.length;
  return result;
};

export const getPipelinePathsForProject = async (
  projectRoot: string
): Promise<PipelinePaths> => {
  const config = await loadPipelineConfig(projectRoot);
  return createPipelinePaths(projectRoot, config);
};
