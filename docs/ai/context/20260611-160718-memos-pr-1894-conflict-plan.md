# MemOS PR #1894 冲突处理计划

## 背景

- 目标 PR：`MemTensor/MemOS#1894`
- PR 分支：`cnYui:codex/memos-auto-recall-min-query-length`
- base 分支：`MemTensor/MemOS:dev-20260604-v2.0.19`
- 当前已知 head：`290b1cae62586deaf123fb059c4e4b3bca648542`
- 当前 live 状态：`mergeable_state=dirty`

## 目标

- 在独立目录 `work/MemOS-1894-conflict` 中处理冲突。
- 保留 PR 原意：为 `memos-local-openclaw` 自动召回增加 `recall.autoRecallMinQueryLength`。
- 默认值保持 `2`，配置为 `10` 时跳过短确认词自动召回。
- 推送回现有 PR 分支，不新开 PR。

## 方案

- 优先使用 merge：把 base 分支合入 PR 分支。
- 原因：当前任务是同步已有 PR，merge 可保留既有提交，不需要重写远端历史，推送风险低于 rebase。
- 冲突解决限定在相关配置、自动召回逻辑和测试文件，不做无关重构。

## 验证

- 必跑：`npm test -- tests/auto-recall-min-query-length.test.ts tests/config.test.ts`
- 必跑：`npm run build`
- 如依赖和时间允许，再补充相关全量或局部测试。

## 风险

- 若目标目录已有未提交改动，改用后缀目录，避免覆盖。
- 若无法推送，保留本地 merge 提交并记录 SHA、冲突状态、验证结果和 blocker。
