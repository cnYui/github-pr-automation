# MiMo-Code PR #505 process substitution follow-up plan

- 时间：2026-06-15 07:48 JST
- 目标 PR：https://github.com/XiaomiMiMo/MiMo-Code/pull/505
- 新反馈：`fengjikui` 在 `5343042` 后指出 `cat <(touch out.txt)`、`cat package.json <(touch out.txt)`、`cat < <(touch out.txt)` 仍可通过 `cat *` 宽规则解析为 `allow`。
- 技术判断：反馈成立的可能性高。当前 plan-mode bash 权限仍基于字符串 pattern，`<(` 是 shell process substitution，能在 read-allowed 命令参数中执行写命令。
- 处理边界：继续保持小范围 pattern-level hardening，不引入 shell parser；长期 parser 方案属于更大设计，不在本轮自动修复范围。
- TDD 计划：
  1. 在 `packages/opencode/test/agent/agent.test.ts` 的 plan bash 负向矩阵加入 process substitution 用例。
  2. 先运行目标测试确认 RED。
  3. 在 `packages/opencode/src/agent/agent.ts` 的 plan bash deny rules 增加 `*<(*`。
  4. 复跑目标测试与 `git diff --check`。
  5. 提交、推送到 `cnYui/MiMo-Code codex/fix-plan-mode-bash-permissions`，并在 PR 简短回复实际验证命令。
