# cnYui PR 反馈巡检记录

- 运行时间：2026-07-23 09:05:12 +09:00
- 增量基线：2026-07-22T12:01:58.809Z
- 账号：cnYui
- 工具：`gh search prs`、GitHub REST Search API、`gh pr view`、Pull review comments REST API

## 结论

本轮检查到 `cnYui` 当前 23 个 open PR；REST Search 交叉确认 `total_count=23` 且 `incomplete_results=false`，前置 GraphQL 搜索也确认 23 个且无下一页。

基线之后没有新的外部 issue comment、review、行级 review comment、requested changes 或新增 check/status；也没有 `author:cnYui` 的 PR 在基线后合并或关闭。

本轮没有自动回复、没有修代码、没有提交、没有推送。

## 核验摘要

- open PR 搜索：`author:cnYui is:pr is:open`，结果 23 个。
- closed PR 搜索：`author:cnYui is:pr is:closed updated:>2026-07-22T12:01:58Z`，结果 0 个。
- open PR 增量反馈：0。
- open PR 新增失败 checks/status：0。
- API/CLI 错误：0。

## 当前旧状态

这些状态均早于本轮基线，本轮未重复处理：

- `mergeStateStatus=DIRTY`：10 个。
- `mergeStateStatus=BLOCKED`：4 个。
- `mergeStateStatus=UNSTABLE`：2 个。
- `mergeStateStatus=UNKNOWN`：2 个。
- `reviewDecision=REVIEW_REQUIRED`：10 个。

其中旧阻塞仍包含此前已记录的 CLA/triage、Vercel/外部服务、merge conflict 或维护者复核类状态；本轮没有新的可动作反馈。
