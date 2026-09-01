import { z } from 'zod';
import { opportunityReportSchema } from '../shared/report-schema';

export const pipelineConfigSchema = z.object({
  maxCandidates: z.number().int().positive(),
  maxPrsPerRun: z.number().int().positive(),
  leaseMinutes: z.number().int().positive(),
  stateRoot: z.string().min(1),
  workspaceRoot: z.string().min(1),
  workspaceRetentionDays: z.number().int().nonnegative().default(7)
});

export const candidateStatusSchema = z.enum([
  'pending',
  'preflight',
  'implementing',
  'verifying',
  'publishing',
  'pr_opened',
  'skipped',
  'blocked'
]);

export const candidatePreflightSchema = z.object({
  checkedAt: z.string().datetime(),
  defaultBranchSha: z.string().min(7),
  issueUrl: z.string().url().optional(),
  issueState: z.enum(['open', 'closed', 'none']),
  defaultBranchContainsFix: z.boolean(),
  duplicatePullRequest: z.boolean(),
  contributionGate: z.enum(['allowed', 'requires_issue', 'requires_maintainer', 'blocked']),
  localVerification: z.array(z.string().min(1)).min(1),
  communicationLanguage: z.string().min(1),
  notes: z.array(z.string().min(1)).default([])
});

export const candidateResultSchema = z.object({
  branch: z.string().min(1),
  commitSha: z.string().min(7),
  pullRequestUrl: z.string().url(),
  verificationSummary: z.array(z.string().min(1)).min(1),
  ciStatus: z.enum(['pending', 'passing', 'failing', 'not_available'])
});

export const candidateExecutionSchema = z.object({
  workspacePath: z.string().min(1),
  branch: z.string().min(1),
  upstreamRepository: z.string().regex(/^[^/]+\/[^/]+$/),
  baseBranch: z.string().min(1),
  baseSha: z.string().min(7)
});

export const publicationIntentSchema = z.object({
  preparedAt: z.string().datetime(),
  upstreamRepository: z.string().regex(/^[^/]+\/[^/]+$/),
  baseBranch: z.string().min(1),
  headOwner: z.string().min(1),
  headBranch: z.string().min(1)
});

export const pipelineCandidateSchema = z.object({
  id: z.string().min(1),
  opportunityKey: z.string().min(1),
  rank: z.number().int().positive(),
  repository: z.object({
    owner: z.string().min(1),
    name: z.string().min(1),
    url: z.string().url(),
    primaryLanguage: z.string().min(1)
  }),
  suggestedCut: z.string().min(1),
  evidence: z.array(z.string().min(1)).min(1),
  risk: z.object({
    level: z.enum(['低', '中', '高']),
    reason: z.string().min(1)
  }),
  status: candidateStatusSchema,
  statusMessage: z.string().min(1).optional(),
  preflight: candidatePreflightSchema.optional(),
  execution: candidateExecutionSchema.optional(),
  publication: publicationIntentSchema.optional(),
  result: candidateResultSchema.optional(),
  updatedAt: z.string().datetime()
});

export const pipelineRunSchema = z.object({
  version: z.literal(1),
  runId: z.string().min(1),
  status: z.enum(['running', 'completed']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  sourceReport: z.object({
    path: z.string().min(1),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    generatedAt: z.string().min(1)
  }),
  window: z.object({
    id: z.string().min(1),
    startedAt: z.string().datetime(),
    prsOpened: z.number().int().nonnegative()
  }),
  candidates: z.array(pipelineCandidateSchema)
});

export const candidateSnapshotSchema = z.object({
  version: z.literal(1),
  runId: z.string().min(1),
  sourceReportPath: z.string().min(1),
  sourceReportSha256: z.string().regex(/^[a-f0-9]{64}$/),
  report: opportunityReportSchema
});

export const pipelineLeaseSchema = z.object({
  version: z.literal(1),
  runId: z.string().min(1),
  leaseId: z.string().min(1),
  acquiredAt: z.string().datetime(),
  expiresAt: z.string().datetime()
});

export const currentRunSchema = z.object({
  version: z.literal(1),
  runId: z.string().min(1)
});

export const ledgerEntrySchema = z.object({
  opportunityKey: z.string().min(1),
  runId: z.string().min(1),
  status: z.literal('pr_opened'),
  pullRequestUrl: z.string().url(),
  updatedAt: z.string().datetime()
});

export const pipelineLedgerSchema = z.object({
  version: z.literal(1),
  entries: z.array(ledgerEntrySchema)
});

export type PipelineConfig = z.infer<typeof pipelineConfigSchema>;
export type CandidateStatus = z.infer<typeof candidateStatusSchema>;
export type CandidatePreflight = z.infer<typeof candidatePreflightSchema>;
export type CandidateResult = z.infer<typeof candidateResultSchema>;
export type CandidateExecution = z.infer<typeof candidateExecutionSchema>;
export type PublicationIntent = z.infer<typeof publicationIntentSchema>;
export type PipelineCandidate = z.infer<typeof pipelineCandidateSchema>;
export type PipelineRun = z.infer<typeof pipelineRunSchema>;
export type CandidateSnapshot = z.infer<typeof candidateSnapshotSchema>;
export type PipelineLease = z.infer<typeof pipelineLeaseSchema>;
export type PipelineLedger = z.infer<typeof pipelineLedgerSchema>;
