# cnYui PR 反馈巡检记录

- 运行时间：2026-07-29 21:07:39 +09:00
- 自动化：`cnyui-pr`
- 基线：`2026-07-29T00:00:58.105Z`
- GitHub 身份：`gh auth status` 确认当前账号为 `cnYui`

## 核验范围

- REST Search：`author:cnYui type:pr state:open` 返回 23 个 open PR，`incomplete_results=false`。
- `gh search prs --author cnYui --state open` 返回 23 个 open PR。
- GraphQL Search：`author:cnYui is:pr is:open sort:updated-desc` 返回 23 个 open PR，`hasNextPage=false`。
- 基线后全状态搜索：`author:cnYui type:pr updated:>2026-07-29T00:00:58Z` 返回 0。
- 基线后关闭/合并搜索：`author:cnYui type:pr closed:>2026-07-29T00:00:58Z` 返回 0。
- 对 23 个 open PR 逐个核验了 REST issue comments、reviews、review comments、head check-runs、commit statuses，并用 GraphQL `statusCheckRollup` 交叉确认。
- 对 23 个 open PR 回读了 REST pull 的 `mergeable_state`。

## 结果

- 23 个 open PR 均无晚于基线的新外部 issue comment、review、review comment 或 requested changes。
- 23 个 open PR 均无晚于基线的新失败 check-run 或 commit status。
- 基线后没有 cnYui authored PR 被合并或关闭。
- 当前 REST `mergeable_state` 分布：`clean=5`、`unstable=2`、`blocked=4`、`behind=2`、`dirty=10`。
- 本轮未自动回复、未修代码、未提交、未推送。

## 旧阻塞观察

- 当前 8 个非成功 check/status 均早于本轮基线：
  - `trycua/cua#1873`：Vercel 授权失败，时间 `2026-06-09T04:09:12Z`。
  - `getzep/graphiti#1539`：CLAAssistant failure，时间 `2026-06-07T01:08:59Z`。
  - `getzep/graphiti#1568`：CLAAssistant failure 与 triage failure，时间 `2026-06-09T01:19Z`。
  - `CopilotKit/CopilotKit#5296`：4 个 Vercel 授权失败，时间 `2026-06-06T10:10:10Z`。
- 这些都是历史外部阻塞，本轮没有新反馈要求回复或改代码。
