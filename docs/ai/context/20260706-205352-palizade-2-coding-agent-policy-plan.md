# hunar2006/palizade#2 coding-agent policy 执行计划

## 当前 live 状态

- issue：`hunar2006/palizade#2`，标题 `Add coding-agent filesystem policy preset`，状态 `OPEN`。
- 当前 open PR 只有 `#7 Add research read-only policy preset`。
- 去重结论：`#7` 是 research read-only preset，不覆盖 coding-agent filesystem preset，本次可以继续推进。

## 目标

提交一个最小 PR，为 Palizade 新增 coding-agent policy preset。该 preset 允许普通 workspace 文件读写，但阻断 shell 命令、凭据路径访问、secret/敏感 taint、以及 tainted outbound destination。

## 必须保持的边界

- 不修改默认 policy。
- 不扩展 evaluator DSL，除非代码现状证明现有 matcher 无法表达最小规则。
- 不做真实路径 canonicalization。
- 不宣称 policy 能独立证明路径在 workspace 内；workspace root 约束仍依赖 MCP filesystem server 或上游配置。
- 不处理 research read-only preset，避免和 `#7` 重叠。

## 文件计划

- 新增 `policies/coding-agent.yaml`：声明 coding-agent preset 和风险阻断规则。
- 修改 `packages/policy/src/evaluator.test.ts` 或现有 policy 测试文件：按 TDD 增加 coding-agent preset 回归测试。
- 修改 `docs/policy.md`：增加 coding-agent preset 文档，说明防护范围和非目标。
- 仅当 README 已集中列出 preset 时，补一行 README；否则不改。

## TDD 步骤

1. 克隆 `hunar2006/palizade` 到 `work/palizade-2`，创建 `codex/add-coding-agent-policy-preset` 分支。
2. 安装依赖并跑现有相关测试，确认 baseline。
3. 先写 coding-agent preset 测试，目标覆盖：
   - 普通 filesystem read/write 在无 taint、无 secret、无 shell role 时 `allow`。
   - `argument_roles` 包含 `shell_command` 时 `block`。
   - arguments 包含 `.env` 或 `.ssh/id_rsa` 等凭据路径时 `block`。
   - `network_egress` 或消息能力搭配 tainted outbound role 时 `block`。
   - tainted filesystem write 时 `require_approval`，因为 coding agent 可能需要写入模型生成内容，但应有人类确认。
4. 运行目标测试，确认 RED 失败来自缺少 preset 或规则。
5. 新增 `policies/coding-agent.yaml`，优先复用现有 matcher。
6. 运行目标测试确认 GREEN。
7. 补 `docs/policy.md`，明确适用场景、阻断范围、workspace 边界限制。
8. 运行目标测试、必要全量测试和 `git diff --check`。
9. 提交、推送到 `cnYui` fork，创建指向 `hunar2006/palizade:main` 的 PR。

## 验证命令

优先执行：

```bash
pnpm test -- packages/policy/src/evaluator.test.ts
```

如仓库脚本不同，按实际 `package.json` 调整为最小等价命令。最终必须执行：

```bash
git diff --check
```

## 风险与处理

- 如果现有 matcher 没有 `argument_role_any`、`tainted_argument_role_any` 或 `secret_detected`，先读 evaluator 和现有 policy，改用仓库已有字段表达同一风险，不新增 DSL。
- credential regex 只覆盖明确高风险片段，避免误伤普通文件名。
- 如果 baseline 测试已红，记录红灯原因，再只用目标测试证明本次改动。
