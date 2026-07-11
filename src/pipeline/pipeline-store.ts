import { mkdir, open, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { readJsonFile, writeJsonFileAtomic } from '../shared/json-file';
import { resolveWithinRoot } from '../shared/path';
import {
  currentRunSchema,
  pipelineConfigSchema,
  pipelineLeaseSchema,
  pipelineLedgerSchema,
  pipelineRunSchema,
  type PipelineConfig,
  type PipelineLease,
  type PipelineLedger,
  type PipelineRun
} from './pipeline-schema';

export type PipelinePaths = {
  projectRoot: string;
  stateRoot: string;
  workspaceRoot: string;
  lease: string;
  current: string;
  ledger: string;
  runs: string;
};

const isMissingFile = (error: unknown): boolean => {
  return (error as NodeJS.ErrnoException).code === 'ENOENT';
};

const readOptionalJson = async <T>(path: string): Promise<T | null> => {
  try {
    return await readJsonFile<T>(path);
  } catch (error) {
    if (isMissingFile(error)) {
      return null;
    }

    throw error;
  }
};

export const loadPipelineConfig = async (projectRoot: string): Promise<PipelineConfig> => {
  const raw = await readJsonFile<unknown>(join(projectRoot, 'config', 'pipeline.json'));
  return pipelineConfigSchema.parse(raw);
};

export const createPipelinePaths = (
  projectRoot: string,
  config: PipelineConfig
): PipelinePaths => {
  const normalizedProjectRoot = resolve(projectRoot);
  const stateRoot = resolveWithinRoot(normalizedProjectRoot, config.stateRoot, '状态目录');
  const workspaceRoot = resolveWithinRoot(
    normalizedProjectRoot,
    config.workspaceRoot,
    '候选仓库目录'
  );

  return {
    projectRoot: normalizedProjectRoot,
    stateRoot,
    workspaceRoot,
    lease: join(stateRoot, 'lease.json'),
    current: join(stateRoot, 'current.json'),
    ledger: join(stateRoot, 'ledger.json'),
    runs: join(stateRoot, 'runs')
  };
};

export const getRunDirectory = (paths: PipelinePaths, runId: string): string => {
  return join(paths.runs, runId);
};

export const readCurrentRunId = async (paths: PipelinePaths): Promise<string | null> => {
  const raw = await readOptionalJson<unknown>(paths.current);
  return raw ? currentRunSchema.parse(raw).runId : null;
};

export const writeCurrentRunId = async (
  paths: PipelinePaths,
  runId: string
): Promise<void> => {
  await writeJsonFileAtomic(paths.current, { version: 1, runId });
};

export const clearCurrentRun = async (paths: PipelinePaths): Promise<void> => {
  await rm(paths.current, { force: true });
};

export const readPipelineRun = async (
  paths: PipelinePaths,
  runId: string
): Promise<PipelineRun> => {
  const raw = await readJsonFile<unknown>(join(getRunDirectory(paths, runId), 'run.json'));
  return pipelineRunSchema.parse(raw);
};

export const writePipelineRun = async (
  paths: PipelinePaths,
  run: PipelineRun
): Promise<void> => {
  await writeJsonFileAtomic(
    join(getRunDirectory(paths, run.runId), 'run.json'),
    pipelineRunSchema.parse(run)
  );
};

export const readPipelineLedger = async (paths: PipelinePaths): Promise<PipelineLedger> => {
  const raw = await readOptionalJson<unknown>(paths.ledger);
  return raw ? pipelineLedgerSchema.parse(raw) : { version: 1, entries: [] };
};

export const writePipelineLedger = async (
  paths: PipelinePaths,
  ledger: PipelineLedger
): Promise<void> => {
  await writeJsonFileAtomic(paths.ledger, pipelineLedgerSchema.parse(ledger));
};

const createLease = (
  runId: string,
  leaseId: string,
  leaseMinutes: number,
  now: Date
): PipelineLease => ({
  version: 1,
  runId,
  leaseId,
  acquiredAt: now.toISOString(),
  expiresAt: new Date(now.getTime() + leaseMinutes * 60_000).toISOString()
});

const writeLeaseExclusive = async (path: string, lease: PipelineLease): Promise<void> => {
  await mkdir(dirname(path), { recursive: true });
  const handle = await open(path, 'wx');

  try {
    await handle.writeFile(`${JSON.stringify(lease, null, 2)}\n`, 'utf8');
  } finally {
    await handle.close();
  }
};

export const acquirePipelineLease = async (
  paths: PipelinePaths,
  runId: string,
  leaseId: string,
  leaseMinutes: number,
  now = new Date()
): Promise<PipelineLease> => {
  const lease = createLease(runId, leaseId, leaseMinutes, now);

  try {
    await writeLeaseExclusive(paths.lease, lease);
    return lease;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }

  const existingRaw = await readJsonFile<unknown>(paths.lease);
  const existing = pipelineLeaseSchema.parse(existingRaw);

  if (Date.parse(existing.expiresAt) > now.getTime()) {
    throw new Error(`流水线正在运行：${existing.runId}`);
  }

  await rm(paths.lease, { force: true });

  try {
    await writeLeaseExclusive(paths.lease, lease);
    return lease;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
      throw new Error('流水线租约竞争失败，请稍后重试');
    }

    throw error;
  }
};

export const refreshPipelineLease = async (
  paths: PipelinePaths,
  runId: string,
  leaseId: string,
  leaseMinutes: number,
  now = new Date()
): Promise<void> => {
  const current = pipelineLeaseSchema.parse(await readJsonFile<unknown>(paths.lease));

  if (current.runId !== runId || current.leaseId !== leaseId) {
    throw new Error(`当前执行窗口不持有流水线租约：${leaseId}`);
  }

  const lease = createLease(runId, leaseId, leaseMinutes, now);
  await writeFile(paths.lease, `${JSON.stringify(lease, null, 2)}\n`, 'utf8');
};

export const releasePipelineLease = async (
  paths: PipelinePaths,
  runId: string,
  leaseId: string
): Promise<void> => {
  const raw = await readOptionalJson<unknown>(paths.lease);

  if (!raw) {
    return;
  }

  const current = pipelineLeaseSchema.parse(raw);

  if (current.runId !== runId || current.leaseId !== leaseId) {
    throw new Error(`当前执行窗口不能释放流水线租约：${leaseId}`);
  }

  await rm(paths.lease, { force: true });
};
