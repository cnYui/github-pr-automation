# GitHub 好项目 PR 机会刷新记录

## 本轮结果

已将当前网页报告刷新为 6 个候选项目：

- `mcpjungle/MCPJungle#247`：值得继续，CLI 配置验证入口。
- `IBM/mcp-context-forge#22`：值得继续，BeeAI Framework 集成文档。
- `coleam00/Archon#1895`：值得继续，清理 workflow 中 `$node.output` 双引号 footgun。
- `Infisical/infisical#2752`：值得继续，修复 Delete secret 审计日志 `undefined`。
- `usebruno/bruno#1985`：谨慎，同时支持 HTTP/HTTPS proxy，产品和实现范围需确认。
- `pallets/click#3081`：谨慎，文档 screenshot workflow 需先做方案研究。

已更新文件：

- `public/reports/latest.json`
- `dist/reports/latest.json`

## 筛选来源

使用 GitHub 仓库与 issue 查询组合：

- `topic:ai-agent archived:false stars:500..80000 pushed:>2026-05-01 good-first-issues:>0`
- `topic:model-context-protocol archived:false stars:200..50000 pushed:>2026-05-01 help-wanted-issues:>0`
- `topic:cli archived:false stars:500..50000 pushed:>2026-05-01 good-first-issues:>0`
- `topic:developer-tools archived:false stars:500..50000 pushed:>2026-05-01 help-wanted-issues:>0`

## 查重结论

以下项目/issue 因已有 open PR 覆盖，本轮未放入主列表：

- `marimo-team/marimo#8324`：已有多个 open PR 覆盖，其中 `#9836` 明确 `Closes #8324`。
- `gitleaks/gitleaks#1697`：已有 open PR `#2113` 覆盖 SourceGraph token rule。
- `Kilo-Org/kilocode#7216`：已有 open PR `#10261` 覆盖 IME Enter composition。
- `usebruno/bruno#6275`：已有 open PR `#6472` 覆盖 clickable console URLs。
- `mcpjungle/MCPJungle#241`：已有 open PR `#246` 覆盖 AGENTS.md。
- `pallets/click#3076`：已有 open PR `#3160`、`#3173` 覆盖命令行入门教程。
- `coleam00/Archon#1576`：已有 open PR `#1577` 覆盖 Windows path separator bug。

## 取舍

- 优先收录没有明显重复 open PR、issue 验收条件清楚、可小切片提交的候选。
- 对大型 monorepo 或产品形态不确定的方向，即使 issue 质量好，也标为 `谨慎`。
- `starsAdded24h` 本轮没有可靠快照差分，保守写 0，并在 evidence 中说明。

## 验证

- `npm run build` 通过。
- `npx vitest run src/shared/report-schema.test.ts src/web/report-view.test.ts src/scanner/candidates.test.ts src/scanner/report-builder.test.ts src/scanner/repository-signals.test.ts src/scanner/scan-runner.test.ts src/scanner/star-snapshots.test.ts` 通过，7 个测试文件、14 个测试全部通过。
- `npx tsx -e "...parseReport(...)"` 已验证 `public/reports/latest.json` 与 `dist/reports/latest.json` 均符合 schema，输出均为 `6 4`。
- `Get-FileHash` 确认 `public/reports/latest.json` 与 `dist/reports/latest.json` SHA256 一致。

## 验证噪声

- `npm test` 会递归扫描 `work/` 下多个上游仓库，触发旧工作目录测试、OpenAI API key、Chromium、PocketBase 等外部环境失败；这不是当前主控仓报告 JSON 的失败信号。
