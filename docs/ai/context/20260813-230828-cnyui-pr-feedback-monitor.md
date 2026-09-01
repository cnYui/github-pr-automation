# cnYui PR 反馈巡检记录

- 运行时间：2026-08-13 23:08:28 +09:00
- 自动化：`cnyui-pr` / 监控 cnYui PR 反馈
- 基线：自动化传入的上次运行时间 `2026-08-13T02:01:32.109Z`
- 认证：`gh auth status` 与 `gh api user` 确认当前账号为 `cnYui`

## 核验范围

- `gh search prs --author cnYui --state open --sort updated --order desc --limit 100` 返回 22 个 open PR。
- REST Search `author:cnYui type:pr state:open` 返回 `total_count=22`，`incomplete_results=false`。
- REST Search `author:cnYui type:pr updated:>=2026-08-13T02:01:32Z` 返回 0，`incomplete_results=false`。
- REST Search `author:cnYui type:pr state:closed updated:>=2026-08-13T02:01:32Z` 返回 0，`incomplete_results=false`。
- GraphQL Search `author:cnYui is:pr is:open` 返回 22 个 PR，`hasNextPage=false`。

## 逐项检查

已逐个回读 22 个 open PR 的以下信息：

- PR REST 状态、`merged`、`mergeable_state`、head SHA
- issue comments
- reviews / requested changes
- review comments
- head commit check runs
- commit statuses
- GraphQL `statusCheckRollup`、`mergeStateStatus`、`reviewDecision`

基线后新增项统计均为 0：

- 新外部 issue comment：0
- 新外部 review / requested changes：0
- 新外部 review comment：0
- 新 check run / commit status / status rollup 变化：0
- 基线后合并或关闭的 authored PR：0

## 当前旧阻塞

以下状态均早于本轮基线，且本轮没有新的维护者反馈或失败信号，不重复评论、不空推送：

- `inkeep/agents#3493`：`mergeStateStatus=BLOCKED`，旧 sync / 仓库流程状态未新增反馈。
- `trycua/cua#1873`：`mergeStateStatus=DIRTY`，旧 Vercel / review-required 状态未新增反馈。
- `getzep/graphiti#1539`：`mergeStateStatus=BEHIND`，旧 CLA / review-required 状态未新增反馈。
- `getzep/graphiti#1568`：`mergeStateStatus=BEHIND`，旧 CLA / triage / review-required 状态未新增反馈。
- 其他 `DIRTY` / `BLOCKED` / `UNSTABLE` 状态未伴随新评论、review 或 check 更新。

## 处理结果

- 自动回复：无。
- 自动修复：无。
- 子 agent：未派发，因为没有多个独立代码问题。
- 提交 / 推送：无。

