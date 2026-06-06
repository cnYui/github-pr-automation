import { z } from 'zod';

export const recommendationSchema = z.enum(['值得继续', '谨慎', '跳过']);
export const riskLevelSchema = z.enum(['低', '中', '高']);
export const opportunityCategorySchema = z.enum([
  '文档缺口',
  '示例补全',
  '测试补充',
  '小 bug',
  'CI/类型错误'
]);

export const reportItemSchema = z.object({
  rank: z.number().int().positive(),
  repository: z.object({
    owner: z.string().min(1),
    name: z.string().min(1),
    url: z.string().url(),
    primaryLanguage: z.string().min(1)
  }),
  popularity: z.object({
    starsTotal: z.number().int().nonnegative(),
    starsAdded24h: z.number().int().nonnegative(),
    lastUpdatedAt: z.string().min(1)
  }),
  health: z.object({
    license: z.string().min(1),
    hasCi: z.boolean(),
    hasTests: z.boolean(),
    hasContributing: z.boolean(),
    issueActivity: z.enum(['active', 'quiet', 'unknown'])
  }),
  opportunity: z.object({
    category: opportunityCategorySchema,
    summary: z.string().min(1),
    evidence: z.array(z.string().min(1)).min(1)
  }),
  risk: z.object({
    level: riskLevelSchema,
    reason: z.string().min(1)
  }),
  recommendation: recommendationSchema
});

export const opportunityReportSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  generatedAt: z.string().min(1),
  summary: z.object({
    candidateCount: z.number().int().nonnegative(),
    actionableCount: z.number().int().nonnegative()
  }),
  items: z.array(reportItemSchema)
});

export type OpportunityReport = z.infer<typeof opportunityReportSchema>;
export type ReportItem = z.infer<typeof reportItemSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
export type RiskLevel = z.infer<typeof riskLevelSchema>;
export type OpportunityCategory = z.infer<typeof opportunityCategorySchema>;

export const parseReport = (input: unknown): OpportunityReport => {
  return opportunityReportSchema.parse(input);
};
