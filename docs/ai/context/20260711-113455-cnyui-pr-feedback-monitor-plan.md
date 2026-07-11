# cnYui PR 反馈监控计划

## 背景

- 自动化 ID：`cnyui-pr`
- 本轮运行时间：2026-07-11 11:34:55 +09:00
- 用户给定上次运行：2026-07-10T14:34:47.096Z
- 本地 memory 上次记录：2026-07-10 23:35:14 +09:00，已检查 23 个 open PR，未发现需要处理的新反馈。

## 必须解决的问题

1. 获取 `author:cnYui is:pr is:open` 的 live PR 列表，不只依赖项目记忆。
2. 对每个 PR 检查 issue comments、review comments、reviews、requested changes、maintainer comments、checks/status、mergeable state。
3. 只处理 `cnYui` 上次相关回复之后的新反馈，避免重复评论。
4. 对无需改代码的问题可直接短回复；对需要代码修改的问题，先核验成立，再独立 work 目录最小修复、测试、提交、推送。
5. 用户账号操作、维护者权限、外部服务授权、CLA、产品方向决策和大范围重写只记录 blocker，不自动处理。

## 执行方案

- 使用 `gh` / GitHub API 获取 open PR 列表、每个 PR 的 timeline/comments/reviews/check runs/statuses。
- 以每个 PR 的最新 `cnYui` 评论或 review 作为去重边界；同时参考自动化上次运行时间识别本轮新增事件。
- 若多个 PR 同时需要代码修改，拆分独立子 agent 并行处理；主线程只做 live 状态核验和最终记录。
- 本轮不修改主控仓应用代码，只新增上下文记录和 automation memory。

## 风险分级

- P0：真实失败 CI、requested changes、明确要求代码修改且影响现有 PR 可合并性。
- P1：事实性问题、测试询问、维护者评论，需要短回复但不改代码。
- P2：CLA、Vercel、权限、账号、维护者放行等外部阻塞，只记录。
- P3：无新反馈、已由 `cnYui` 最后回复、标签变更等无需处理事件。
