# Kode-CLI #166 重启实现记录

## 工作目录

- 外部仓库: `D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\Kode-CLI-166-restart`
- 分支: `codex/fix-mcp-text-result-rendering`
- 原建议目录 `work/Kode-CLI-166` 已有未提交改动，本轮未触碰。

## 改动

- `src/tools/mcp/MCPTool/MCPTool.tsx`
  - 新增 MCP result 文本规范化。
  - 对单字段 `{ "result": string }` 的 FastMCP 文本包装做展示层解包。
  - 数组 text content 与非数组输出都统一进入 `OutputLine`。
- `tests/unit/mcp-tool-result-rendering.test.tsx`
  - 新增 Ink 渲染单测，验证 FastMCP 字符串结果展示为纯文本，而不是 JSON 包装。

## RED

Command:

```bash
bun test tests/unit/mcp-tool-result-rendering.test.tsx
```

失败证据:

```text
Expected to not contain: "{\"result\""
Received: "  ⎿  {\"result\":\"地点：西安\\n温度：22 celsius\\n状况：晴\"}\n"
0 pass
1 fail
```

## GREEN

Commands:

```bash
bun test tests/unit/mcp-tool-result-rendering.test.tsx
bun test tests/unit/user-tool-result-message-orphaned.test.tsx tests/unit/mcp-tool-result-rendering.test.tsx
bun run typecheck
bun run format:check
bun run lint
```

结果:

```text
1 pass, 0 fail
6 pass, 0 fail
tsc --noEmit exited 0
All matched files use Prettier code style
eslint . --max-warnings 0 exited 0
```

## 剩余风险

- 未启动真实 Python FastMCP server 做端到端 CLI 交互。
- 修复只解包单字段 `{ result: string }`；多字段结构化结果继续按 JSON 展示，避免破坏真正的结构化输出。
