# MiMo-Code PR #505 pipeline follow-up 记录

## 结果

- PR：`XiaomiMiMo/MiMo-Code#505`
- 新反馈：`fengjikui` 指出 read allowlist 仍允许管道形式把输出交给写入或删除命令。
- 处理分支：`cnYui:codex/fix-plan-mode-bash-permissions`
- 推送提交：`115865add7057dc9668cc79fcb7ce2b5b70181f6`
- PR 回复：`https://github.com/XiaomiMiMo/MiMo-Code/pull/505#issuecomment-4701586017`

## 改动

- `packages/opencode/test/agent/agent.test.ts`
  - 增加以下 pipeline 负向测试：
    - `cat package.json | tee out.txt`
    - `rg needle src | tee out.txt`
    - `git diff | tee out.patch`
    - `find . -print0 | xargs rm -f`
    - `Get-Content package.json | Set-Content out.txt`
- `packages/opencode/src/agent/agent.ts`
  - 在 plan agent 默认 bash 规则中增加 `*|*` deny。

## TDD 记录

- RED：
  - 命令：`bun test test/agent/agent.test.ts -t "plan agent allows only read-only bash commands by default" --timeout 30000`
  - 结果：失败，pipeline 命令仍解析为 `allow`。
- GREEN：
  - 命令：`bun test test/agent/agent.test.ts -t "plan agent allows only read-only bash commands by default" --timeout 30000`
  - 结果：通过，`1 pass / 0 fail / 24 expect()`。

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

- 本轮采用保守拒绝所有 pipeline 的方案。
- 这会拒绝只读到只读的 pipeline，但当前权限系统没有结构化 shell parser；对 plan mode 来说，默认只读安全优先。
