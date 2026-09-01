# cnYui PR 反馈巡检记录

- 时间：2026-07-28 09:09:56 +09:00
- 自动化：`cnyui-pr` / 监控 cnYui PR 反馈
- 基线：`2026-07-27T12:02:00.860Z`
- 账号：`gh auth status` 确认当前 GitHub 账号为 `cnYui`

## 范围

- GraphQL Search：`author:cnYui is:pr is:open sort:updated-desc` 返回 25 个 open PR，`hasNextPage=false`。
- 基线后全状态搜索：`author:cnYui is:pr updated:>2026-07-27T12:02:00Z sort:updated-desc` 只命中 1 个 PR。

## 核验项

### `Snailclimb/JavaGuide#2890`

- PR：https://github.com/Snailclimb/JavaGuide/pull/2890
- 更新：`2026-07-27T21:17:52Z`
- 状态：`OPEN`
- `mergeable`: `MERGEABLE`
- `mergeStateStatus`: `UNSTABLE`
- `reviewDecision`: `null`
- `comments(last:20)`: 0
- `reviews(last:20)`: 0
- `reviewThreads(last:20)`: 0
- `statusCheckRollup`: `null`
- 结论：只有一次无反馈更新，没有新 issue comment、review、review comment、requested changes 或 check/status 变化。

## 结果

- 新人工 issue comment：0
- 新人工 review：0
- 新行级 review comment：0
- 新 requested changes：0
- 新失败或 action-required check/status：0
- authored PR 合并或关闭：0
- 自动回复：无
- 自动修复：无
- 提交 / 推送：无

结论：当前 25 个 open PR 在本轮基线后没有需要处理的新反馈。
