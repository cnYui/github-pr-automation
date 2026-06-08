# MemOS PR #1894 提交记录

## 目标

- 仓库：`MemTensor/MemOS`
- Issue：`#1347`，短确认词触发自动召回造成噪音注入
- PR：`https://github.com/MemTensor/MemOS/pull/1894`
- 分支：`cnYui:codex/memos-auto-recall-min-query-length`
- Commit：`ac15df415f3723dcc9c772f9a18a159f3867a876`

## 改动

- 新增 `recall.autoRecallMinQueryLength` 配置项。
- 默认值保持为 `2`，保留原有两字符过滤行为。
- `before_prompt_build` 自动召回 hook 改为读取配置阈值；归一化 prompt 长度低于阈值时跳过 `RecallEngine.search`。
- README 中补充配置示例，说明可设为 `10` 来忽略短确认词。
- 同步更新 `apps/memos-local-openclaw` 与 `packages/memos-core` 的配置和类型定义，避免源码树漂移。

## 验证

- `npm test -- tests/auto-recall-min-query-length.test.ts tests/config.test.ts`
  - 结果：2 个 test files 通过，6 个 tests 通过。
- `npm run build`
  - 结果：`tsc` 通过。
- `git diff --cached --check`
  - 结果：无尾随空白或冲突标记输出。

## PR 状态

- PR 创建成功，目标分支为 `MemTensor/MemOS:main`。
- `gh pr view` 返回：`state=OPEN`、`isDraft=false`、`mergeable=MERGEABLE`、`reviewDecision=REVIEW_REQUIRED`。
- 创建后暂未返回 status checks。
