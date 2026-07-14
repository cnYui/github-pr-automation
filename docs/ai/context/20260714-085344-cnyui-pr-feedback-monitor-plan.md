# cnYui PR 反馈巡检计划

## 基线

- 自动化：`cnyui-pr`
- 上次运行时间：`2026-07-13T10:07:28.300Z`
- 当前认证账号：`cnYui`
- 主控仓库只允许新增本轮上下文记录，不修改应用代码，也不覆盖现有未提交改动。

## 目标

全量检查 `author:cnYui` 的当前 open PR，并核对基线后的关闭或合并变化。只处理 cnYui 上次相关回复之后的新人工反馈、新 requested changes 或真实失败 CI。

## 执行步骤

1. 用 GitHub Search 获取完整 open PR 清单，并查询基线后更新的 closed PR。
2. 逐个回读 PR 元数据、issue comments、reviews、review comments、head checks/status、`mergeable_state` 和 review decision。
3. 排除机器人常规通知、旧失败信号、已经由 cnYui 最后回复的反馈和无需动作的成功检查。
4. 对成立且可自动处理的代码问题，在干净的独立 `work/` 目录按 TDD 做最小修复；多个独立 PR 同时需要修改时拆给多个子 Agent 并行处理。
5. 按实际验证结果提交、推送到现有 PR head 分支并简短回复；账号、CLA、外部授权、维护者权限和产品方向问题只记录 blocker。
6. 最终复核 live PR head、checks、comments 和状态，写入本轮记录与自动化记忆。

## 风险控制

- 不自动 merge，不创建替代 PR，不做空提交或无证据回复。
- 不声称未运行的测试；宽验证受环境限制时明确记录。
- 已有工作目录不干净时创建新目录，避免覆盖用户或其他 Agent 的改动。
