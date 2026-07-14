# 2026-07-14 每日 GitHub PR 机会流水线计划

## 目标

- 生成日本时区 `2026-07-14` 的日期报告并完成 live 复筛。
- 仅处理 `值得继续` 且 preflight 通过的低风险候选。
- 最多创建 `config/pipeline.json` 规定的 2 个 ready PR，禁止自动 merge。

## 已知状态

- `npm run pipeline -- status` 返回 `null`，本轮启动新运行。
- 主控工作区已有历史未提交产物，本轮只追加新文件并保留现状。
- 扫描 CLI 不支持 `--help`，传入该参数仍会执行真实扫描。
- 扫描器按 UTC 日期写报告；本轮首次调用将机器结果写入了 `2026-07-13`，需要从未被覆盖的 `dist/reports/2026-07-13.json` 恢复历史文件。

## 执行顺序

1. 保留机器扫描结果作为候选池，恢复 7 月 13 日历史报告。
2. 核对每个候选的默认分支、Issue、重复 PR、贡献门禁和本地验证路径。
3. 只把通过硬门槛的候选写入 `public/reports/2026-07-14.json`，同步 `latest.json` 与 `dist/reports`。
4. 用日期报告启动流水线并保存 lease id。
5. 按 `pending/preflight/implementing/verifying/publishing` 状态机处理候选。
6. 发布前记录 publication intent，并按 head 分支查询已有 PR。
7. 达到上限或队列结束后运行 `close`，生成 summary 并释放租约。

## 约束与验证

- 候选仓库目录不干净时使用新的 `work/opportunity-pipeline` 子目录。
- 上游修改、commit 和 PR 文案遵循目标仓库主要语言。
- 每项改动至少运行目标测试、相关 lint/typecheck/build 和 `git diff --check` 中实际适用的部分。
- 不能完成可信本地验证、存在贡献门禁或方向已被覆盖时，记录为 `skipped` 或 `blocked`。
