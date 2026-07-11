# MiMo-Code PR #505 separator follow-up 记录

## 结果

- PR：`XiaomiMiMo/MiMo-Code#505`
- 新反馈：`fengjikui` 确认 `f59c3c8` 已覆盖前一轮矩阵，但指出 newline 和单 `&` 仍可作为 shell 分隔符绕过。
- 处理分支：`cnYui:codex/fix-plan-mode-bash-permissions`
- 推送提交：`5343042d683161eaee361eebf16659ba7d98901d`
- PR 回复：`https://github.com/XiaomiMiMo/MiMo-Code/pull/505#issuecomment-4701659383`

## 改动

- `packages/opencode/test/agent/agent.test.ts`
  - 增加以下负向测试：
    - `cat package.json\ntouch out.txt`
    - `cat package.json & touch out.txt`
- `packages/opencode/src/agent/agent.ts`
  - 在 plan agent 默认 bash 规则中增加保守 deny：
    - `*\n*`
    - `*&*`

## TDD 记录

- RED：
  - 命令：`bun test test/agent/agent.test.ts -t "plan agent allows only read-only bash commands by default" --timeout 30000`
  - 结果：失败，新增 separator 形式仍解析为 `allow`。
- GREEN：
  - 命令：`bun test test/agent/agent.test.ts -t "plan agent allows only read-only bash commands by default" --timeout 30000`
  - 结果：通过，`1 pass / 0 fail / 32 expect()`。

## 验证

- `bun test test/agent/agent.test.ts -t "plan agent allows only read-only bash commands by default" --timeout 30000`
  - 通过。
- `git diff --check`
  - 通过，仅有 Windows line-ending 提示。
- `bun test test/agent/agent.test.ts --timeout 30000`
  - 仍有既有无关失败：`general agent denies todo tools` 期望 `deny` 但得到 `allow`。
- `bun run typecheck`
  - 仍有既有本地问题：`packages/opencode/src/storage/db.node.ts` 无法解析 `node:sqlite` 类型。

## 后续判断

- 当前 pattern-level hardening 已覆盖 review 明确指出的重定向、find/git diff 写入形式、pipeline、控制操作符、命令替换、换行和单 `&` 分隔符。
- 如果后续继续出现 shell 语法绕过，应建议维护者改为结构化 shell parser 或显式只读命令解析，而不是继续叠加通配规则。
