# cnYui PR 反馈巡检记录

- 运行时间：2026-08-23 11:09:37 +09:00
- 自动化：`cnyui-pr`
- 基线：2026-08-22T14:01:56.949Z
- 账号：`cnYui`

## 核验方式

- `gh auth status` 确认当前 GitHub CLI 账号为 `cnYui`。
- GitHub GraphQL Search 查询 `author:cnYui is:pr is:open`，确认当前 open PR 总数为 22。
- 对 22 个 open PR 逐个拉取最近 issue comments、reviews、review threads、head commit `statusCheckRollup`、`mergeStateStatus`、`reviewDecision` 和 head SHA。
- GitHub GraphQL Search 查询 `author:cnYui is:pr is:closed closed:>=2026-08-22`，再按基线过滤 closed/merged PR。
- REST Search / `gh search prs` 本轮命中 GitHub secondary rate limit，未作为判断依据；GraphQL 查询可用并完成核验。

## 结果

- 当前 open PR：22 个。
- 基线后新增外部 issue comment：0。
- 基线后新增 review / requested changes：0。
- 基线后新增 review thread comment：0。
- 基线后新增失败、阻塞或待授权 check/status：0。
- 基线后 authored PR 合并或关闭：0。
- 本轮未自动回复、未修代码、未派发子 agent、未提交、未推送。

## 旧阻塞

以下状态均早于本轮基线，不重复处理：

- `getzep/graphiti#1539`：`CLAAssistant` failure，完成时间 2026-06-07T01:08:59Z。
- `getzep/graphiti#1568`：`CLAAssistant` failure，完成时间 2026-06-09T01:19:00Z。
- `getzep/graphiti#1568`：`triage` failure，完成时间 2026-06-09T01:19:10Z。
- `inkeep/agents#3493`：`sync` waiting，开始时间 2026-08-05T12:48:39Z。
- `trycua/cua#1873`：`Vercel` failure，更新时间 2026-06-09T04:09:12Z。

## 备注

- 当前 open PR 最新 `updatedAt` 为 `router-for-me/CLIProxyAPI#3802` 的 2026-08-20T16:47:04Z，早于本轮基线。
- 多个 PR 仍处于 `DIRTY`、`BEHIND`、`BLOCKED` 或 `REVIEW_REQUIRED`，但没有本轮新增反馈或新失败信号；按自动化边界不做空推送或重复评论。
