# 2026-06-28 好项目候选刷新记录

## 范围

- 使用 `github-daily-pr-opportunity-scan` 的 dashboard repo 模式刷新报告。
- 已先跑 `npm run scan` 生成机器候选，再用 GitHub API/CLI 人工去重。
- 本轮只更新报告与记录，不 fork、不提交外部仓、不创建 PR。

## 扫描与去重

- 机器报告被超大热门仓污染，最终改用 GitHub Search API 精确过滤 `topic:mcp`、`topic:agent`、`topic:cli`、`topic:developer-tools`、`stars:50..5000`、`pushed:>=2026-06-01`。
- 逐仓回读 open issues、open PR、repo metadata 和代码树。
- 已排除或降权：
  - `hashgraph-online/hol-guard`：release/chore PR 密度很高，真实 issue 少。
  - `smart-mcp-proxy/mcpproxy-go`：主 issue 被上游 MCP Go SDK 阻塞，open PR 多。
  - `Natively-AI-assistant/natively-cluely-ai-assistant`：多个候选问题已有相近 open PR。
  - `archestra-ai/archestra#4724`：Slack blocks 方向已有相近 PR #5618。

## 推荐顺序

1. `yvgude/lean-ctx#594`：CLI 与 MCP 使用不同 `config.toml` 路径。无 open PR，Rust 项目有测试和配置文档，最适合先推进。
2. `repowise-dev/repowise#371`：语言使用区隐藏 JSON/YAML/TOML 等配置类语言。标记 good first issue，无同向 PR，UI 展示层小切口。
3. `fitlab-ai/agent-infra#544`：统一 `task.md` frontmatter 的 `status` 枚举并清理冗余字段。无 open PR，契约和校验入口清楚。
4. `xintaofei/codeg#273`：agent 运行时长统计错误。无直接重复 PR，可先从时间差计算和展示测试切入。
5. `VintLin/skill-flow#8`：源扫描忽略 `commands/` 等非 skill 资产。需求涉及数据模型和 UI，建议只做 scanner/manifest 薄切片，标为谨慎。
6. `archestra-ai/archestra#5948`：streaming LLM 中途失败未写入 interaction history。复现很清楚，但仓库和 PR 并发密度高，标为谨慎。
7. `HelpCode-ai/anythingmcp#180`：新增 `ENCRYPTION_KEY` rotation CLI。安全价值高，但需要数据库事务和多 credential 类型测试，标为谨慎。
8. `zzet/gortex#118`：补 codegraph 对比表。无同向 PR，但 issue 正文太少，动手前需先确认比较维度，标为谨慎。

## 输出

- 已更新 `public/reports/latest.json`。
- 已同步 `public/reports/2026-06-28.json`、`dist/reports/latest.json`、`dist/reports/2026-06-28.json`。
- 机器扫描产生的 `data/snapshots/2026-06-28.json` 和 `data/snapshots/latest.json` 保留作为本轮基础候选快照。
