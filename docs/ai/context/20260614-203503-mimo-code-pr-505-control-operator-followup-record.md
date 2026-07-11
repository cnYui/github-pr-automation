# MiMo-Code PR #505 control operator follow-up 记录

## 结果

- PR：`XiaomiMiMo/MiMo-Code#505`
- 新反馈：`fengjikui` 确认 pipeline 已被拒绝，但指出 shell 控制操作符和命令替换仍可绕过 read allowlist。
- 处理分支：`cnYui:codex/fix-plan-mode-bash-permissions`
- 推送提交：`f59c3c8e87600a7c9178fd6c223e94220fe24894`
- PR 回复：`https://github.com/XiaomiMiMo/MiMo-Code/pull/505#issuecomment-4701618956`

## 改动

- `packages/opencode/test/agent/agent.test.ts`
  - 增加以下负向测试：
    - `cat package.json; touch out.txt`
    - `ls && touch out.txt`
    - `git status && rm -rf x`
    - `Get-Content package.json; Set-Content out.txt`
    - ``cat package.json `touch out.txt` ``
    - `cat package.json $(touch out.txt)`
- `packages/opencode/src/agent/agent.ts`
  - 在 plan agent 默认 bash 规则中增加保守 deny：
    - `*;*`
    - `*&&*`
    - ``*`*``
    - `*$(*`

## TDD 记录

- RED：
  - 命令：`bun test test/agent/agent.test.ts -t "plan agent allows only read-only bash commands by default" --timeout 30000`
  - 结果：失败，控制操作符/命令替换形式仍解析为 `allow`。
- GREEN：
  - 命令：`bun test test/agent/agent.test.ts -t "plan agent allows only read-only bash commands by default" --timeout 30000`
  - 结果：通过，`1 pass / 0 fail / 30 expect()`。

## 验证

- `bun test test/agent/agent.test.ts -t "plan agent allows only read-only bash commands by default" --timeout 30000`
  - 通过。
- `git diff --check`
  - 通过，仅有 Windows line-ending 提示。
- `bun test test/agent/agent.test.ts --timeout 30000`
  - 仍有既有无关失败：`general agent denies todo tools` 期望 `deny` 但得到 `allow`。
- `bun run typecheck`
  - 仍有既有本地问题：`packages/opencode/src/storage/db.node.ts` 无法解析 `node:sqlite` 类型。

## 设计取舍

- 本轮继续采用 pattern-level 保守拒绝方案，避免在 review follow-up 中引入 shell parser。
- 如果维护者希望允许部分只读组合命令，需要单独设计结构化命令解析和右侧命令 allowlist。
