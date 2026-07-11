# 2026-06-28 好项目候选扫描计划

## 目标

- 刷新最近值得推进的 GitHub PR 候选项目。
- 复用 `github-daily-pr-opportunity-scan` 的 dashboard repo 模式，优先更新现有报告结构。
- 本轮只做发现、去重、排序和记录，不 fork、不提交外部仓、不开 PR。

## 筛选口径

- 优先看 Agent、MCP、CLI、developer-tools、AI 工具链相关仓库。
- 只保留本地可验证、切口小、无明显重复 PR 的方向。
- 大仓只接受文档、示例、坏链、配置说明这类低风险切口。
- 遇到 issue-first、重型云环境、企业账号、多节点集群、已有开放 PR 覆盖的方向，默认降级为谨慎或跳过。

## 执行步骤

1. 跑现有扫描器生成最新基础候选报告。
2. 用 GitHub API/CLI 扩展近期候选池，按 open issue / open PR 去重。
3. 人工复核前 5 到 10 个候选的切口、证据、风险和本地验证路径。
4. 更新 `public/reports/latest.json`，如存在构建产物同步 `dist/reports/latest.json`。
5. 新增一份扫描记录文档，写明推荐顺序和跳过理由。

## 验收

- 报告 JSON 符合 `src/shared/report-schema.ts`。
- 每个保留候选都有具体 issue/PR 证据、风险、验证方式。
- 不覆盖历史 context 文档。
