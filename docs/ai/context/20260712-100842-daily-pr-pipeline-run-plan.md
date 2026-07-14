# 每日 GitHub PR 机会流水线执行计划

## 目标

在没有未完成运行的前提下，刷新 2026-07-12 的 GitHub PR 机会报告，使用不可变日期报告启动流水线，并在 live preflight 通过后最多创建 2 个低风险 ready PR。

## 约束

- 保留主控仓库现有未提交改动，不覆盖或混入候选仓库提交。
- 扫描阶段只发现、复核和写报告，不修改候选仓库。
- 实施阶段只处理标记为“值得继续”且 live preflight 通过的候选。
- live preflight 必须检查默认分支、Issue、重复 PR、贡献门禁、仓库规则、认证和本地验证路径。
- 候选目录必须位于 `work/opportunity-pipeline`；已有目录不干净时使用新目录。
- 发布前记录 publication intent，并按 head 分支查询现有 PR，禁止重复创建。
- 禁止自动 merge；需要 CLA、账号授权、付费服务、外部密钥、维护者权限、产品决策或高风险大改时跳过或阻塞。

## 执行顺序

1. 运行仓库扫描器生成机器候选，同步 `public/reports` 与 `dist/reports`。
2. 对候选执行 GitHub live 复筛，输出 `public/reports/2026-07-12.json`，并同步 `latest.json`。
3. 使用日期报告执行 `pipeline start`，保存 lease id。
4. 循环执行 `next`，根据 `pending/preflight/implementing/verifying/publishing` 状态恢复。
5. 对通过 preflight 的候选记录 execution JSON，完成最小实现与实际验证。
6. 记录 publication intent，按 head 对账，提交、推送并创建或补录 ready PR。
7. 达到 2 个 PR 上限或队列结束后执行 `close`，释放租约并生成 summary。
8. 新增本轮执行记录，向 `AGENTS.md` 追加关键记忆，并更新自动化 memory。

## 异常策略

- 状态转换只通过流水线 CLI 完成，不手工修改运行状态。
- 单个候选无法继续时写中文原因并标记 `skipped` 或 `blocked`。
- 意外中断时保留 lease 和持久状态，供下次运行恢复。
