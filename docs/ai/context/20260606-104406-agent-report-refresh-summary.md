# Agent 项目报告刷新摘要

## 已更新文件

- `public/reports/latest.json`
- `dist/reports/latest.json`
- `AGENTS.md`

## 入选项目

本轮报告包含 10 个 Agent/MCP/Skill 相关项目：

1. `MemTensor/MemOS`
2. `jackwener/OpenCLI`
3. `czlonkowski/n8n-mcp`
4. `GLips/Figma-Context-MCP`
5. `getzep/graphiti`
6. `CopilotKit/CopilotKit`
7. `shareAI-lab/Kode-CLI`
8. `github/github-mcp-server`
9. `zai-org/Open-AutoGLM`
10. `agentsmd/agents.md`

其中 7 个标记为 `值得继续`，3 个标记为 `谨慎`。本轮没有使用 24h Star 差分排序，`starsAdded24h` 统一保留为 `0` 以兼容现有 schema。

## 验证记录

- `npm run build`：通过。
- `npx vitest run src`：通过，7 个测试文件、14 个测试。
- `npx tsx -e "... parseReport(...)"`：通过，报告解析出 10 个项目和 7 个可推进项。
- `cmp -s public/reports/latest.json dist/reports/latest.json`：通过，public 与 dist 报告一致。

## 剩余风险

- `npm test` 仍会扫描 `work/headroom` 下的外部候选仓库测试，导致 unrelated failure：
  - `work/headroom/sdk/typescript/test/adapters/vercel-ai.test.ts` 缺少 `ai` 包。
  - `work/headroom/plugins/openclaw/test/engine-normalization.test.ts` 无法解析 `headroom-ai`。
- 当前 `work/headroom` 目录仍存在，大小约 279M；本轮未按用户授权删除它。
