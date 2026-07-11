# hunar2006/palizade PR #8 提交记录

## PR

- 仓库：`hunar2006/palizade`
- issue：`#2 Add coding-agent filesystem policy preset`
- PR：`#8 feat(policy): add coding-agent preset`
- URL：https://github.com/hunar2006/palizade/pull/8
- 分支：`cnYui:codex/add-coding-agent-policy-preset`
- commit：`4cb414d feat(policy): add coding-agent preset`

## 实现范围

- 新增 `policies/coding-agent.yaml`。
- 在 `packages/policy/src/evaluator.test.ts` 增加 coding-agent preset 回归测试。
- 在 `docs/policy.md` 增加 Coding Agent Preset 说明。
- 在 `README.md` 的 shipped preset 列表中加入 `policies/coding-agent.yaml`。

## 行为边界

- 保持 `policies/default.yaml` 不变。
- 未扩展 evaluator DSL，全部复用已有 matcher：
  - `argument_role_any`
  - `argument_regex`
  - `secret_detected`
  - `sensitive_taint`
  - `capabilities_any`
  - `tainted_argument_role_any`
- 文档明确说明 preset 不能独立证明路径在 workspace 内，workspace root 仍由 MCP filesystem server 或调用方配置约束。

## TDD 记录

1. 先新增测试加载 `policies/coding-agent.yaml`。
2. 运行 `pnpm exec vitest run packages/policy/src/evaluator.test.ts`，因缺少 preset 文件 RED。
3. 新增 preset、policy 文档后目标测试 GREEN。
4. 对 secret/sensitive taint 规则补充直接测试，并先移除对应规则确认 RED，再恢复规则确认 GREEN。

## 本地验证

已通过：

```bash
pnpm exec vitest run packages/policy/src/evaluator.test.ts
pnpm build
pnpm test
git diff --check
```

验证结果：

- 目标测试：1 个测试文件、6 个测试通过。
- 全量测试：16 个测试文件、55 个测试通过。
- `git diff --check`：退出码 0；仅有 Windows checkout 的 LF/CRLF 提示。
- PR 创建后回读状态：`OPEN`、base `main`、head `cnYui:codex/add-coding-agent-policy-preset`、`MERGEABLE`。
- 远端 checks：当前 GitHub 未报告 checks。
