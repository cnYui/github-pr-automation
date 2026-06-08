# Kode-CLI #166 重启实现设计与计划

## 背景

- 目标 issue: `shareAI-lab/Kode-CLI#166`。
- 现象: Python FastMCP 工具返回纯文本天气结果后，Kode CLI 报 Ink/React 错误: `Text string ... must be rendered inside <Text> component`。
- 既有建议目录 `work/Kode-CLI-166` 已存在未提交改动，本轮不能覆盖，改用 `work/Kode-CLI-166-restart`。
- 已确认没有直接关联 #166 的开放 PR。

## 设计

- 修复边界只放在 MCP tool result 的展示/规范化路径。
- 不修改模型调用、不修改 MCP 协议调用大结构、不改 dashboard 项目。
- 优先让 `MCPTool.renderToolResultMessage()` 对所有可能的文本结果形态都返回合法 Ink 节点。
- 若 MCP result 是字符串，继续走 `OutputLine`；若是 text content block，取 `text` 后走 `OutputLine`；若出现非标准文本值，先转成字符串再进入 `OutputLine`，避免裸字符串进入 JSX。

## 根因假设

`callMCPTool()` 返回值可能是 MCP content array、structuredContent 序列化字符串，或兼容层产生的未知文本值。当前 `MCPTool.renderToolResultMessage()` 对数组分支假设非 image 项一定有 `item.text: string`，缺少安全规范化。最小修复应在 renderer 入口收敛数据形态，而不是改 MCP 客户端调用。

## TDD 计划

1. 新增最小 Ink 渲染测试，直接覆盖 MCP text result renderer。
2. RED: 在当前 upstream 上渲染 issue 中的 `{ "result": "地点..." }` 文本形态，确认会触发现有裸文本错误或缺少期望输出。
3. GREEN: 在 MCP renderer 内增加局部文本规范化，所有文本都通过 `OutputLine`/`Text`。
4. 回归: 跑新增测试、现有 `user-tool-result-message-orphaned` 测试和 `bun run typecheck`。

## 风险

- 未接真实 Python MCP server 做端到端交互；本轮用 UI 渲染单测覆盖崩溃点。
- 如果 issue 触发点实际来自 permission request 而非 result message，需要追加针对 permission renderer 的小测试，但仍不扩大到模型或协议层。
