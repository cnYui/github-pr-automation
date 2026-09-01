# cnYui PR 反馈巡检记录

- 巡检时间：2026-08-25 11:09:27 +09:00
- 反馈基线：`2026-08-24T14:01:39.041Z`
- GitHub 账号：`cnYui`
- 当前 open PR：22 个

## 核验结果

- `gh auth status` 确认当前账号为 `cnYui`。
- REST Search 返回 `total_count=22`、`incomplete_results=false`；GraphQL Search 同样返回 22 个 open PR，确认列表无分页遗漏。
- 基线后 `author:cnYui is:pr updated:>=2026-08-24T14:01:39Z`、closed 和 merged 查询均为 0。
- 逐个 PR 用 GraphQL 回读 issue comments、pull reviews、review threads、head commit status rollup、head SHA、`mergeStateStatus` 和 `reviewDecision`；评论、review、thread 与 check 连接均无分页遗漏。
- 再用 REST 逐个交叉核验 PR 状态、issue comments、pull reviews、行级 review comments、head check-runs、commit statuses 和 `mergeable_state`，读取错误为 0。
- 基线后新的外部反馈、requested changes、新 check/status、authored PR 合并和关闭事件均为 0。

## 历史风险

以下状态均早于本轮基线，不重复回复、不空推送：

- `inkeep/agents#3493`：内部 `sync` check 仍为 waiting，属于维护者侧流程阻塞。
- `trycua/cua#1873`：`Vercel` status failure，属于外部服务授权阻塞。
- `getzep/graphiti#1539`：`CLAAssistant` failure，已有 approved review，属于 CLA/维护流程阻塞。
- `getzep/graphiti#1568`：`CLAAssistant` 与 `triage` failure，且分支 behind。
- 其他 dirty、blocked 或 unknown 的 PR 没有新增可动作反馈。

## 自动处理

- 未自动回复。
- 未修改 PR 代码、未运行上游项目测试、未提交、未推送。
- 未派发子 agent。
