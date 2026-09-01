# lark-coding-agent-bridge #194 PR 计划

## 目标

为 `zarazhangrui/lark-coding-agent-bridge` 提交一个低风险 PR，修复 issue #194：在 `/config` 中切换到团队版后，`mode: "team"` 没有持久化到 root profile config，重载 profile 后回退为个人版。

## Live preflight

- 仓库：`zarazhangrui/lark-coding-agent-bridge`
- 状态：未归档，默认分支 `main`，MIT License，2026-07-16 仍有 push。
- 贡献规则：未发现 `AGENTS.md` / `CONTRIBUTING.md` / PR 模板限制；`.github` 仅有 CI workflow。
- 重复 PR：open PR 列表未发现直接修复 #194 或 `mode` 持久化的同向 PR。
- 相关阻塞：open PR #197 正在修 Windows integration mock / Codex shim 测试问题，和本次功能修复无重复。

## 角度选择

候选角度：

1. 修 #194 团队模式持久化：已有明确 issue、可本地用集成测试复现，改动集中在配置序列化。
2. 修 package metadata 旧仓库 URL：真实但偏维护清理，价值低于用户可感知 bug。
3. 做 #198 per-chat mention exemption：需求合理，但设计面更大，已有历史 PR 覆盖相近收信模式，不适合本轮最小 PR。

选择 #194。

## 实现设计

- 在 `tests/integration/commands/profile-config-command.test.ts` 的 `/config submit` profile 保存测试中加入 `deploy_mode: "team"`，断言落盘后的 `root.profiles.claude.mode` 为 `"team"`。
- 在 `src/config/profile-store.ts` 的 `StoredProfileConfig` 序列化白名单中加入 `mode`，并在 `serializeProfileConfig()` 写出 `profile.mode`。
- 不修改 `/config` 表单、身份策略计算、access policy、schema normalization 和文档。

## 验证计划

- RED：目标集成测试应失败在 `mode` 未写入。
- GREEN：相关配置测试通过。
- 必跑：`pnpm typecheck`、`pnpm build`、`git diff --check`。
- 全量测试：当前 clone 在主控仓 `work/` 内会误读主控仓 `vitest.config.ts`，验证时使用临时本地 Vitest 配置；若 Windows 既有 Codex shim 测试失败，需记录为 #197 已覆盖的外部基线问题。
