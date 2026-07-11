# MiMo-Code PR #505 review follow-up 计划

## 背景

- PR：`XiaomiMiMo/MiMo-Code#505`
- 分支：`cnYui:codex/fix-plan-mode-bash-permissions`
- 新反馈：`fengjikui` 指出当前 plan agent 的 bash 权限仍允许部分可写形式：
  - `find . -execdir rm {} \;`
  - `find . -delete -print`
  - `git diff --output out.patch`
- 根因：`Permission.evaluate` 使用 `findLast`，按完整命令字符串匹配；宽泛的 `find *` / `git diff *` allow 仍会覆盖未列入 deny 的可写变体。

## 设计

- 不改权限评估架构，避免扩大 PR 范围。
- 在 plan agent 默认 bash 规则中补充更具体的 deny pattern。
- 覆盖 reviewer 明确指出的空格参数和 `find -execdir` 变体。
- 保留现有只读命令 allow 行为。

## 执行计划

1. 在 `packages/opencode/test/agent/agent.test.ts` 补充负向用例。
2. 运行目标测试，确认新增用例在当前实现下失败。
3. 在 `packages/opencode/src/agent/agent.ts` 增加最小 deny pattern。
4. 复跑目标测试、相关 agent 测试和 diff check。
5. 提交并推送到现有 PR 分支。
6. 在 PR 中回复已修复内容和实际验证命令。

## 风险

- 字符串通配 allowlist 本身仍不是完整 shell parser；本轮只覆盖当前 review 明确指出且能小范围验证的写入形式。
- 宽测试可能仍遇到既有无关失败，需要在回复中明确区分。
