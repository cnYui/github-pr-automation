# cnYui PR 反馈巡检记录

- 运行时间：2026-07-26 21:10:59 +09:00
- 自动化：`cnyui-pr` / 监控 cnYui PR 反馈
- 基线：自动化传入 `2026-07-26T00:00:37.718Z`
- 记忆参考：上次完成记录为 2026-07-26 09:03:47 +09:00，已避免重复处理上轮记录过的 `untemps/svelte-palette#229` 合并状态。

## 范围

- GitHub 认证账号：`cnYui`
- `gh search prs --author cnYui --state open --limit 200` 返回 23 个 open PR。
- REST Search 交叉确认：`total_count=23`，`incomplete_results=false`。
- GraphQL Search 交叉确认：23 个 open PR，`hasNextPage=false`。
- `gh search prs --author cnYui --state closed --updated >=2026-07-26T00:00:37Z` 返回 0 个结果。

## 核验项

对 23 个 open PR 逐个回读：

- REST pull：`mergeable_state`、head SHA、head repo、base ref、open/merged/closed 状态。
- Issue comments：使用 `gh api --paginate` 读取全量分页。
- Review comments：使用 `gh api --paginate` 读取全量分页。
- Reviews：使用 `gh api --paginate` 读取全量分页。
- `gh pr view --json statusCheckRollup,mergeStateStatus,reviewDecision,headRefOid`。
- Head repo commit check-runs：`repos/{headRepo}/commits/{headSha}/check-runs?filter=latest`。
- Head repo commit statuses：`repos/{headRepo}/statuses/{headSha}`。

第一次脚本中 commit statuses endpoint 的 PowerShell 插值把 `${headSha}` 后的 `?per_page` 解析错误，导致 status 回读 404；已修正为 `${headSha}?per_page=100` 后完整复跑，最终 `errorCount=0`。

## 结果

- 新外部 issue comment：0。
- 新外部 review：0。
- 新外部 review comment：0。
- 新 requested changes：0。
- 新失败或 action-required check/status：0。
- 基线后 authored PR 合并或关闭：0。
- 自动回复：无。
- 自动修复：无。
- 提交 / 推送：无。

旧阻塞仍存在但均早于本轮基线，不重复回复或空推送：

- `CopilotKit/CopilotKit#5296`：旧 Vercel 授权失败，时间为 2026-06-06。
- `getzep/graphiti#1539`：旧 `CLAAssistant` failure，时间为 2026-06-07。
- `getzep/graphiti#1568`：旧 `triage` failure，时间为 2026-06-09。
- `trycua/cua#1873`：旧 Vercel 授权失败，时间为 2026-06-09。

结论：当前 23 个 open PR 在本轮基线之后没有需要用户处理或自动修复的新反馈。
