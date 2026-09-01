# cnYui PR 反馈巡检记录

- 运行时间：2026-07-29 09:06:25 +09:00
- 自动化：`cnyui-pr`
- 基线：`2026-07-28T12:00:52.691Z`
- GitHub 身份：`gh auth status` 与 `gh api user` 确认当前账号为 `cnYui`

## 核验范围

- REST Search：`author:cnYui is:pr is:open` 返回 23 个 open PR，`incomplete_results=false`。
- GraphQL Search：`author:cnYui is:pr is:open sort:updated-desc` 返回 23 个 open PR，`hasNextPage=false`。
- 基线后全状态搜索：`author:cnYui is:pr updated:>2026-07-28T12:00:52Z` 只命中 `router-for-me/CLIProxyAPI#3802`。
- 基线后关闭/合并搜索：`author:cnYui is:pr closed:>2026-07-28T12:00:52Z` 返回 0。
- 对 23 个 open PR 回读了 REST pull 的 `mergeable_state`；对 GraphQL `comments`、`reviews`、`reviewThreads` 和 `statusCheckRollup` 做了基线后筛选。

## 结果

- 23 个 open PR 均无晚于基线的新外部 issue comment、review、review comment 或 requested changes。
- 23 个 open PR 均无晚于基线的新完成 check/status；本轮没有新增失败 CI。
- `router-for-me/CLIProxyAPI#3802` 是唯一 `updated_at` 晚于基线的 PR；REST issue events、timeline、review comments 和 reviews 在基线后均为空，当前 head `4f7519e362139e3bb3f3cb37732ca8f8a94f9e0c` 的远端 check rollup 为 success，但 REST `mergeable_state=dirty`。
- 本轮未自动回复、未修代码、未提交、未推送。

## 旧阻塞观察

- 当前失败/阻塞 checks 均早于本轮基线：`trycua/cua#1873` 的 Vercel 授权失败、`getzep/graphiti#1539` 的 CLA failure、`getzep/graphiti#1568` 的 CLA/triage failure、`CopilotKit/CopilotKit#5296` 的 Vercel 授权失败。
- 当前 REST `mergeable_state` 分布：`clean=5`、`unstable=2`、`blocked=4`、`behind=2`、`dirty=10`。这些非 clean 状态没有伴随本轮新反馈或新失败 check，不属于本轮自动修复范围。
