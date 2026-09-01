# cnYui PR 反馈巡检记录

## 基线

- 自动化：`cnyui-pr` / 监控 cnYui PR 反馈
- 本轮运行时间：2026-08-15 11:06:26 +09:00
- 反馈基线：2026-08-14T14:01:33.219Z
- GitHub 账号：`cnYui`

## 检查口径

- `gh auth status` 与 `gh api user` 确认当前认证账号为 `cnYui`。
- `gh search prs --author cnYui --state open --limit 100` 获取当前 open PR 列表，共 22 个。
- REST Search 交叉确认 `author:cnYui is:pr is:open` 为 `total_count=22` 且 `incomplete_results=false`。
- GraphQL Search `author:cnYui is:pr is:open` 确认 `issueCount=22` 且 `hasNextPage=false`。
- 基线后的 authored PR 更新搜索、closed 搜索和 merged 搜索均为 0。
- 对 22 个 open PR 逐个回读 PR REST 状态、issue comments、reviews、review comments、head check-runs、commit statuses、`mergeable_state`、head SHA；再用 GraphQL 回读 `mergeStateStatus`、`reviewDecision` 和 status rollup。

## 结果

- 当前 `cnYui` open PR 数量：22。
- 基线后新增 issue comments：0。
- 基线后新增 reviews / requested changes：0。
- 基线后新增 inline review comments：0。
- 基线后新增或完成的 check/status：0。
- 基线后合并或关闭的 authored PR：0。
- 当前 GraphQL merge state 分布：`DIRTY` 9、`BLOCKED` 4、`BEHIND` 2、`CLEAN` 6、`UNSTABLE` 1。
- 当前 `REVIEW_REQUIRED` 为 8 个；这些都是已有状态，没有基线后的新维护者动作。

## 需要关注的旧阻塞

以下状态均早于本轮基线，不属于新增反馈，本轮不自动回复、不修代码、不推送：

- [`inkeep/agents#3493`](https://github.com/inkeep/agents/pull/3493)：`sync` check 自 2026-08-05T12:48:39Z 起 `WAITING`，仓库评论说明该 PR 通过内部 mirror 维护，等待仓库侧同步；Socket 与 acknowledge checks 已通过。
- [`trycua/cua#1873`](https://github.com/trycua/cua/pull/1873)：Vercel status 于 2026-06-09T04:09:12Z 失败，描述为 `Authorization required to deploy`，需要 Cua 团队成员授权；CodeRabbit 为成功但明确跳过 review。
- [`getzep/graphiti#1539`](https://github.com/getzep/graphiti/pull/1539)：代码相关 checks 通过，triage 为 merge-ready；唯一失败是 2026-06-07T01:08:59Z 的 `CLAAssistant`，当前仍为 `BEHIND`，不属于本轮可自动修复事项。
- [`getzep/graphiti#1568`](https://github.com/getzep/graphiti/pull/1568)：2026-06-09T01:18:58Z 的 CLA 评论后已由 `cnYui` 签署，但旧 `CLAAssistant` 与 `triage` 仍为失败，当前 `BEHIND`；没有新的维护者反馈。

## 本轮动作

- 未自动回复。
- 未修代码。
- 未派发子 agent。
- 未提交或推送任何外部 PR 分支。
- 未修改主控仓应用代码。

