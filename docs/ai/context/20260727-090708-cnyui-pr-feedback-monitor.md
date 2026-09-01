# cnYui PR 反馈巡检记录

- 运行时间：2026-07-27 09:07:28 +09:00
- 自动化：`cnyui-pr` / 监控 cnYui PR 反馈
- 基线：自动化传入 `2026-07-26T12:02:25.077Z`
- 账号：`gh auth status` 确认当前 GitHub 账号为 `cnYui`

## 范围

- `gh search prs --author cnYui --state open --limit 200` 返回 24 个 open PR。
- REST Search API：`author:cnYui type:pr state:open` 返回 `total_count=24`，`incomplete_results=false`。
- GraphQL Search：返回 24 个 open PR，`hasNextPage=false`。
- `gh search prs --author cnYui --state closed --limit 100` 本地过滤 `closedAt > 2026-07-26T12:02:25.077Z` 后为 0 个结果。

## 核验项

对 24 个 open PR 逐个回读：

- REST pull：open/merged/closed 状态、`mergeable_state`、head SHA、head/base repo 与 ref。
- Issue comments：使用 `gh api --paginate --slurp` 读取。
- Reviews：使用 `gh api --paginate --slurp` 读取。
- Review comments：使用 `gh api --paginate --slurp` 读取。
- `gh pr view --json statusCheckRollup,mergeStateStatus,reviewDecision,headRefOid`。
- Head/base commit check-runs：`repos/{repo}/commits/{headSha}/check-runs?filter=latest`。
- Head/base commit statuses：`repos/{repo}/statuses/{headSha}`。

本轮 API 聚合脚本 `errorCount=0`。

## 新反馈

### `0xzr/freellmpool#83`

- PR：https://github.com/0xzr/freellmpool/pull/83
- 新反馈时间：`2026-07-26T21:17:27Z` / `2026-07-26T21:18:01Z`
- 来源：`sourcery-ai[bot]`
- 内容类型：issue comment 的 Sourcery 使用提示、`COMMENTED` review。
- 结论：机器人正向/提示性反馈，review 正文表示已看过且没有阻塞建议；无行级评论、无 requested changes。
- 远端 check：`Sourcery review` 成功，`completedAt=2026-07-26T21:18:02Z`。
- 处理：无需回复、无需改代码。

## 结果

- 新人工 issue comment：0。
- 新人工 review：0。
- 新行级 review comment：0。
- 新 requested changes：0。
- 新失败或 action-required check/status：0。
- 基线后 authored PR 合并或关闭：0。
- 自动回复：无。
- 自动修复：无。
- 提交 / 推送：无。

旧阻塞仍存在但均早于本轮基线，不重复回复或空推送：

- `trycua/cua#1873`：旧 Vercel 授权失败，时间为 2026-06-09。
- `getzep/graphiti#1539`：旧 `CLAAssistant` failure，时间为 2026-06-07。
- `getzep/graphiti#1568`：旧 `CLAAssistant` / `triage` failure，时间为 2026-06-09。
- `CopilotKit/CopilotKit#5296`：旧 Vercel 授权失败，时间为 2026-06-06。

结论：当前 24 个 open PR 在本轮基线之后没有需要用户处理或自动修复的新反馈。
