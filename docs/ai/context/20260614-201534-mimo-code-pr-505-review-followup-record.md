# MiMo-Code PR #505 review follow-up 记录

## 结果

- PR：`XiaomiMiMo/MiMo-Code#505`
- 新反馈：`fengjikui` 指出 `find *` / `git diff *` 仍允许以下可写形式：
  - `find . -execdir rm {} \;`
  - `find . -delete -print`
  - `git diff --output out.patch`
- 处理分支：`cnYui:codex/fix-plan-mode-bash-permissions`
- 推送提交：`ff901bc856810f2155d84d263207ad20ff62e98e`
- PR 回复：`https://github.com/XiaomiMiMo/MiMo-Code/pull/505#issuecomment-4701571142`

## 改动

- `packages/opencode/test/agent/agent.test.ts`
  - 增加 reviewer 点名的 3 个负向测试命令。
- `packages/opencode/src/agent/agent.ts`
  - 增加 deny pattern：
    - `find * -delete *`
    - `find * -execdir *`
    - `git diff --output *`
    - `git diff * --output *`

## TDD 记录

- RED：
  - 命令：`bun test test/agent/agent.test.ts -t "plan agent allows only read-only bash commands by default" --timeout 30000`
  - 结果：失败，新增写入形式仍解析为 `allow`。
- GREEN：
  - 命令：`bun test test/agent/agent.test.ts -t "plan agent allows only read-only bash commands by default" --timeout 30000`
  - 结果：通过，`1 pass / 0 fail / 19 expect()`。

## 验证

- `bun test test/agent/agent.test.ts -t "plan agent allows only read-only bash commands by default" --timeout 30000`
  - 通过。
- `git diff --check`
  - 通过，仅有 Windows line-ending 提示。
- `bun test test/agent/agent.test.ts --timeout 30000`
  - 仍有既有无关失败：`general agent denies todo tools` 期望 `deny` 但得到 `allow`。
- `bun run typecheck`
  - 仍有既有本地问题：`packages/opencode/src/storage/db.node.ts` 无法解析 `node:sqlite` 类型。

## 后续关注

- 当前修复覆盖本轮 review 明确指出的小范围绕过形式。
- 字符串通配 allowlist 仍不是完整 shell parser；若维护者要求彻底方案，需要单独设计命令解析或结构化权限判断。
