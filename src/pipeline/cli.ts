import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { resolveWithinRoot } from '../shared/path';
import {
  candidateExecutionSchema,
  candidatePreflightSchema,
  candidateResultSchema,
  candidateStatusSchema,
  publicationIntentSchema
} from './pipeline-schema';
import {
  closePipelineWindow,
  getNextPipelineCandidate,
  readCurrentPipelineRun,
  recordCandidatePreflight,
  startPipeline,
  transitionPipelineCandidate
} from './pipeline-runner';

const command = process.argv[2];
const { values } = parseArgs({
  args: process.argv.slice(3),
  options: {
    root: { type: 'string', default: process.cwd() },
    report: { type: 'string' },
    candidate: { type: 'string' },
    lease: { type: 'string' },
    file: { type: 'string' },
    to: { type: 'string' },
    message: { type: 'string' },
    'execution-file': { type: 'string' },
    'publication-file': { type: 'string' },
    'result-file': { type: 'string' }
  },
  strict: true
});

const projectRoot = resolve(values.root);
const readJsonArgument = async (path: string): Promise<unknown> => {
  return JSON.parse(
    await readFile(resolveWithinRoot(projectRoot, path, 'CLI JSON 输入文件'), 'utf8')
  );
};

const requireValue = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`缺少参数：${name}`);
  }

  return value;
};

let output: unknown;

switch (command) {
  case 'start':
    output = await startPipeline({ projectRoot, reportPath: values.report });
    break;
  case 'status':
    output = await readCurrentPipelineRun(projectRoot);
    break;
  case 'next':
    output = await getNextPipelineCandidate(
      projectRoot,
      requireValue(values.lease, '--lease')
    );
    break;
  case 'preflight': {
    const file = requireValue(values.file, '--file');
    output = await recordCandidatePreflight({
      projectRoot,
      leaseId: requireValue(values.lease, '--lease'),
      candidateId: requireValue(values.candidate, '--candidate'),
      preflight: candidatePreflightSchema.parse(await readJsonArgument(file))
    });
    break;
  }
  case 'transition': {
    const status = candidateStatusSchema.parse(requireValue(values.to, '--to'));

    if (status === 'pending' || status === 'preflight') {
      throw new Error('请使用 preflight 命令进入 preflight 状态');
    }

    output = await transitionPipelineCandidate({
      projectRoot,
      leaseId: requireValue(values.lease, '--lease'),
      candidateId: requireValue(values.candidate, '--candidate'),
      status,
      message: values.message,
      execution: values['execution-file']
        ? candidateExecutionSchema.parse(await readJsonArgument(values['execution-file']))
        : undefined,
      publication: values['publication-file']
        ? publicationIntentSchema.parse(await readJsonArgument(values['publication-file']))
        : undefined,
      result: values['result-file']
        ? candidateResultSchema.parse(await readJsonArgument(values['result-file']))
        : undefined
    });
    break;
  }
  case 'close':
    output = await closePipelineWindow(projectRoot, requireValue(values.lease, '--lease'));
    break;
  default:
    throw new Error('命令必须是 start、status、next、preflight、transition 或 close');
}

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
