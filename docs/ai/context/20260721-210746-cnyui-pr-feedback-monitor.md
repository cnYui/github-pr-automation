# cnYui PR 反馈巡检记录

- 运行时间：2026-07-21 21:07:46 +09:00
- 自动化：`cnyui-pr`
- 基线：`2026-07-21T00:02:15.237Z`
- 范围：`author:cnYui is:open archived:false`

## 数据来源

- `gh auth status`：当前 GitHub 登录账号为 `cnYui`。
- `gh search prs --author cnYui --state open --limit 200`：获得 24 个 open PR。
- GitHub Search API：`total_count=24`，`incomplete_results=false`。
- GraphQL：逐个读取 open PR 的 issue comments、reviews、review threads、status check rollup、`mergeable`、`mergeStateStatus`、`reviewDecision`。
- Closed / merged 搜索：基线后没有 `cnYui` authored PR 被关闭或合并。
- 对 `router-for-me/CLIProxyAPI#3802` 额外读取 issue comments、review comments、reviews、checks 和 timeline。

## 结论

- 本轮 24 个 open PR 均无基线后的新外部 issue comment、review、requested changes、review comment 或新增失败 check/status。
- 基线后无 authored PR 合并或关闭。
- 未自动回复、未修代码、未提交、未推送。

## 基线后更新时间变化

- `router-for-me/CLIProxyAPI#3802`：`updatedAt=2026-07-21T05:11:38Z`，但 issue comments、review comments、reviews、status rollup 和 timeline 均无基线后事件；当前 head 仍为 `4f7519e36213`，status rollup 为 `SUCCESS`，`mergeStateStatus=DIRTY` 属旧状态。本轮不回复、不空推送。

## 旧阻塞

这些状态早于本轮基线，不作为新反馈处理：

- `trycua/cua#1873`：旧 Vercel failure。
- `getzep/graphiti#1568`：旧 `CLAAssistant` failure 和 `triage` failure。
- `getzep/graphiti#1539`：旧 `CLAAssistant` failure。
- `CopilotKit/CopilotKit#5296`：旧 Vercel 授权 failure。
- 多个 PR 仍处于历史 `DIRTY` / `BLOCKED` / `REVIEW_REQUIRED` 状态，但没有新增维护者反馈或新增失败检查。
