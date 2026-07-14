# cnYui PR 反馈巡检计划

时间：2026-07-12 19:03:04（Asia/Tokyo）

## 背景

本轮自动化检查 `cnYui` 的所有 open PR。上次运行基线为 `2026-07-11T22:00:51.373Z`，且 GitHub CLI 当前认证账号为 `cnYui`。

## 目标与边界

- 获取完整 open PR 清单，并查询基线后的关闭或合并变化。
- 对每个 open PR 回读 issue comments、reviews、review comments、head commit checks、mergeable state 和 review decision。
- 只处理晚于基线且没有被 `cnYui` 后续回复覆盖的新外部反馈。
- 只有技术反馈成立且可在独立干净 worktree 内以最小改动验证时，才修改、提交和推送。
- CLA、账号、外部服务授权、维护者权限和产品决策只记录具体阻塞，不作无效回复或空提交。

## 执行计划

1. 以 GraphQL 批量获取 open PR 的状态、评论、审查、审查线程和 check rollup。
2. 用 REST 回读基线后的 closed PR，核实合并时间、关闭原因与关联反馈。
3. 按时间线和作者过滤新反馈；对需要改代码的独立 PR 才拆分并行处理。
4. 记录处理结果、实际验证命令与仍需用户关注的阻塞，并更新 automation memory。

## 风险与取舍

旧的失败检查、已由 `cnYui` 回复的意见和没有新外部动作的 mergeability 变化不会重复处理，避免噪音和不必要的远程写入。
