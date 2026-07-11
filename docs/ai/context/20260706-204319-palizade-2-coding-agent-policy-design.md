# hunar2006/palizade#2 PR 设计文档

## 目标

为 `hunar2006/palizade#2` 提交一个安全策略预设 PR，新增 coding-agent 场景的 policy preset，并补充策略测试。

## 当前状态

- issue：https://github.com/hunar2006/palizade/issues/2
- 当前状态：open。
- open PR 去重：
  - `#7 Add research read-only policy preset`
- 结论：`#7` 是 research read-only preset，不覆盖 coding-agent filesystem policy preset。

## 真正问题

coding agent 场景需要允许正常 workspace 文件读写，同时拦截更危险的行为：

- shell command 执行。
- credential / secret 相关访问。
- tainted content 进入外部网络、消息或 GitHub-like 目的地。

Palizade 已有 policy evaluator、YAML preset 和 egress preset。最小方案应复用现有 policy matcher，不先扩展 evaluator DSL。

## 最小 PR 边界

必须做：

- 新增一个 coding-agent policy YAML preset。
- 覆盖 filesystem 和 GitHub-like server 的典型能力。
- 补 policy tests：
  - tainted write / sink 被拦截或需要审批。
  - shell command role 被阻断。
  - tainted outbound destination 被阻断。
  - 普通 workspace 文件读写在无 taint、无 secret、无 shell role 时允许。
- 在 policy docs 中说明该 preset 的适用场景。

不做：

- 不新增 evaluator DSL，除非现有 matcher 无法表达 issue 最小要求。
- 不实现真实路径 canonicalization。
- 不宣称 policy 自身能证明路径一定在 workspace 内；workspace root 仍由具体 MCP filesystem server 或调用方配置约束。
- 不改默认 policy 行为。

## 设计

新增 `policies/coding-agent.yaml`。该 preset 采用 default allow，但添加 coding-agent 风险阻断规则。

建议规则方向：

- `block-shell-command-role`
  - 匹配 `direction: request`、`method: tools/call`、`argument_role_any: [shell_command]`。
  - action: `block`。
- `block-credential-path-access`
  - 匹配 `direction: request`、`method: tools/call`、`argument_regex` 包含 `.env`、`.ssh`、`id_rsa`、`credentials`、`token`、`secret` 等高风险片段。
  - action: `block`。
- `block-secret-detected-coding-agent`
  - 匹配 `secret_detected: true` 或 `sensitive_taint: true` 进入 tools/call。
  - action: `block`。
- `block-tainted-network-or-message-egress`
  - 匹配 `capabilities_any: [network_egress, sends_message]`，且 `tainted_argument_role_any` 包含 `url`、`hostname`、`email_recipient`、`http_query`。
  - action: `block`。
- `require-approval-tainted-file-write`
  - 匹配文件写入类 sink 且 `taint: true`。
  - action: `require_approval` 或 `block`。建议先用 `require_approval`，因为 coding agent 可能确实需要把模型生成内容写入 workspace，但需要显式人类确认。

普通文件读写不需要显式 allow rule；在 default allow 下，只要没有 taint、secret、shell、egress destination 这些风险信号，就保持通过。

## 预期改动文件

- `policies/coding-agent.yaml`
  - 新增 coding-agent preset。
- `packages/policy/src/evaluator.test.ts`
  - 增加读取 `policies/coding-agent.yaml` 的回归测试。
- `docs/policy.md`
  - 增加 `Coding Agent Preset` 小节，说明适用场景、能防什么、不能防什么。
- 可选：`README.md`
  - 只在现有 README 已列出 presets 时补一行；否则不改。

## 测试设计

新增测试应直接 load preset：

```ts
const codingAgent = await loadPolicyFile(join(process.cwd(), "policies", "coding-agent.yaml"));
```

必须覆盖：

- normal workspace read/write：
  - `direction: "request"`
  - `method: "tools/call"`
  - `tool_class: "sink"` 或 `tool_class: "pure"`
  - `capabilities: ["filesystem"]`
  - `taint: false`
  - 期望 `allow`
- shell command：
  - `argument_roles: ["shell_command"]`
  - 期望 `block`
- credential path：
  - arguments 中包含 `.env` 或 `.ssh/id_rsa`
  - 期望 `block`
- tainted outbound destination：
  - `capabilities: ["network_egress"]`
  - `tainted_argument_roles: ["url"]`
  - 期望 `block`
- tainted file write：
  - `tool_class: "sink"`
  - `capabilities: ["filesystem"]`
  - `taint: true`
  - 期望 `require_approval` 或 `block`，按最终 policy 选择保持一致。

## 验证命令

优先：

```bash
pnpm test -- packages/policy/src/evaluator.test.ts
```

如果 Vitest 参数不兼容：

```bash
pnpm test
```

再跑：

```bash
git diff --check
```

## 风险

- `inside workspace` 不是当前 policy matcher 独立可证明的属性。设计上必须写清该 preset 只允许“未命中风险信号的 filesystem 调用”，workspace 边界由 filesystem server root 或上游配置保证。
- credential regex 不能过宽，避免阻断普通路径；也不能过窄，避免 `.env`、`.ssh` 等常见敏感路径漏掉。
- 不要修改 `policies/default.yaml`，否则会扩大行为面。

## 建议 PR 信息

标题：

```text
feat(policy): add coding-agent preset
```

正文要点：

- 新增 coding-agent policy preset。
- 阻断 shell command、credential access、tainted egress。
- 对 tainted file write 做 approval/block 保护。
- 说明 workspace 边界依赖 MCP filesystem server 配置。
- 附目标测试和 diff check。
