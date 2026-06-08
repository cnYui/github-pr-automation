# Kode-CLI #166 MCP 文本结果修复计划

> **For agentic workers:** REQUIRED SUB-SKILL: 使用 superpowers:test-driven-development 执行。步骤用 checkbox 跟踪，先 RED 再 GREEN。

**目标:** 修复 `shareAI-lab/Kode-CLI#166` 中 MCP 工具返回纯文本/结构化文本时 Ink 报 “Text string ... must be rendered inside <Text> component” 的问题。

**架构:** 只处理 MCP tool result 的 UI 渲染/数据展示路径。动态 MCP 工具仍通过 `services/mcp/tools-integration.ts` 调用协议，UI 继续由 `MCPTool.renderToolResultMessage` 和 `UserToolResultMessage` 负责展示，不改模型调用和 MCP 协议大结构。

**技术栈:** Bun test、React、Ink、TypeScript、MCP SDK。

---

## 当前证据

- Issue #166 仍 open，报错内容是 MCP Python 工具返回天气纯文本后，Ink 认为 `{"result":"..."}` 这类文本被作为裸字符串渲染。
- 当前仓库动态 MCP 工具在 `src/services/mcp/tools-integration.ts` 中复用 `MCPTool`，并把 `callMCPTool()` 的返回值同时放入 `data` 和 `resultForAssistant`。
- `callMCPTool()` 遇到 `structuredContent` 会先返回 `JSON.stringify(result.structuredContent)`；FastMCP 返回纯字符串时可能形成 `{"result":"..."}`。
- `UserToolSuccessMessage` 命中工具后会把 `message.toolUseResult.data` 传给 `lookup.tool.renderToolResultMessage()`，所以最小修复点优先放在 MCP result renderer，而不是模型消息转换层。

## 边界

- 不修改模型调用、协议消息大结构、权限流程和 dashboard 项目源码。
- 不自动 fork、不推送、不创建 PR。
- 外部仓库分支只放 bugfix 相关测试和源码；协作记录留在父项目 `docs/ai/context/`。

## 计划

### Task 1: 写 RED 测试

**Files:**
- Create: `work/Kode-CLI-166/tests/unit/mcp-tool-result-rendering.test.tsx`

- [ ] **Step 1: 写最小渲染测试**

测试直接渲染 `MCPTool.renderToolResultMessage()`，覆盖 issue 中的结构化文本字符串：

```tsx
const node = MCPTool.renderToolResultMessage?.(
  JSON.stringify({ result: '地点：西安\n温度：22° celsius\n状况：晴' }),
  { verbose: false },
)
```

断言 Ink 渲染不抛错，并能看到 `地点：西安`。

- [ ] **Step 2: 运行 RED**

Run:

```bash
bun test tests/unit/mcp-tool-result-rendering.test.tsx
```

Expected: 当前实现若仍存在裸字符串问题，应失败并出现 Ink `<Text>` 报错；若该路径已绿，补测更接近 `UserToolSuccessMessage` 的 MCP 工具结果路径。

### Task 2: 最小实现

**Files:**
- Modify: `work/Kode-CLI-166/src/tools/mcp/MCPTool/MCPTool.tsx`
- Optional Test: `work/Kode-CLI-166/tests/unit/mcp-tool-result-rendering.test.tsx`

- [ ] **Step 3: 修 MCP result renderer**

只在 MCP result renderer 内保证文本值最终进入 Ink `<Text>`/`OutputLine`，必要时增加小型本地 normalize helper，把未知非数组数据转为可展示字符串：

```ts
function renderMcpTextContent(output: unknown): string {
  if (typeof output === 'string') return output
  return JSON.stringify(output)
}
```

不改 MCP 调用、权限和模型转换路径。

- [ ] **Step 4: 运行 GREEN**

Run:

```bash
bun test tests/unit/mcp-tool-result-rendering.test.tsx
```

Expected: PASS。

### Task 3: 回归验证

**Files:**
- Same as above

- [ ] **Step 5: 跑相关单测**

Run:

```bash
bun test tests/unit/user-tool-result-message-orphaned.test.tsx tests/unit/mcp-tool-result-rendering.test.tsx
```

Expected: PASS。

- [ ] **Step 6: 跑类型检查**

Run:

```bash
bun run typecheck
```

Expected: PASS；若外部仓库基线已有无关失败，只记录失败证据，不扩大修复范围。
