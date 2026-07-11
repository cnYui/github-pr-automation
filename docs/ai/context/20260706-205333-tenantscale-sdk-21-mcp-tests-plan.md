# TenantScale MCP Tool Handler Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `TenantScale/sdk#21` 提交一个最小测试补充 PR，让 `@tenantscale/mcp` 的 4 个 tool handler 能被 Vitest 覆盖。

**Architecture:** 把 `packages/mcp/src/index.ts` 拆成入口 wiring 和纯 handler 模块。测试只 import 新的 `packages/mcp/src/tools.ts`，避免单元测试启动 stdio MCP server。

**Tech Stack:** TypeScript、pnpm workspace、Vitest、MCP SDK。

---

## 背景

既有设计文档：`docs/ai/context/20260706-204319-tenantscale-sdk-21-mcp-tests-design.md`。

issue 要求为 MCP package 补测试，重点覆盖 malformed SQL、空 table name 和 unicode 输入。当前风险不是测试数量，而是 `index.ts` 顶层启动 stdio server，直接 import 会污染测试进程。因此先抽纯逻辑，再补测试。

## 方案选择

推荐方案：新增 `tools.ts` 承载 `TOOLS`、4 个 handler 和 `callTenantScaleTool()`。

取舍：

- 优点：测试不启动 stdio，改动小，能复用现有 handler 文本输出。
- 风险：需要轻微调整入口文件，但不改变 tool name 和 response shape。
- 不选内联 mock stdio：会把测试耦合到启动副作用，不能解决根问题。
- 不选引入 SQL parser：issue 要的是 handler 测试和基础边界，不需要重型解析。

## 文件结构

- Create: `packages/mcp/src/tools.ts`
  - 负责导出 tool definitions、纯 handler、dispatch。
- Modify: `packages/mcp/src/index.ts`
  - 只保留 `Server`、`StdioServerTransport` 和 request handler 注册。
- Create: `packages/mcp/src/__tests__/tools.test.ts`
  - 覆盖 4 个 tool handler 和 issue 指定边界。
- Create: `packages/mcp/vitest.config.ts`
  - MCP package 的 Vitest 配置。
- Modify: `packages/mcp/package.json`
  - 增加 `"test": "vitest run"`。
- Modify: `vitest.workspace.ts`
  - 增加 `packages/mcp` workspace entry。

## Task 1: 克隆与基线核验

- [ ] **Step 1: 克隆仓库**

```powershell
New-Item -ItemType Directory -Force -Path work | Out-Null
gh repo clone TenantScale/sdk work/tenantscale-sdk-21
Set-Location work/tenantscale-sdk-21
```

- [ ] **Step 2: 创建分支**

```powershell
git checkout -b codex/add-mcp-tool-handler-tests
```

- [ ] **Step 3: 安装依赖**

```powershell
pnpm install --frozen-lockfile
```

- [ ] **Step 4: 核验 issue 和重复 PR**

```powershell
gh issue view 21 --repo TenantScale/sdk --json state,title,url
gh pr list --repo TenantScale/sdk --state open --search "mcp test OR MCP tests OR vitest" --json number,title,url,headRefName
```

Expected: issue 仍为 open，未发现同向 open PR。

## Task 2: RED 测试

- [ ] **Step 1: 新增失败测试**

Create `packages/mcp/src/__tests__/tools.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { callTenantScaleTool } from "../tools";

const textOf = async (name: string, args: Record<string, unknown>) => {
  const result = await callTenantScaleTool(name, args);
  return result.content.map((item) => item.text).join("\n");
};

describe("MCP tool handlers", () => {
  it("returns the default tenant schema", async () => {
    const text = await textOf("get_tenant_schema", {});

    expect(text).toContain("tenants");
    expect(text).toContain("tenant_users");
    expect(text).toContain("tenant_id");
  });

  it("preserves unicode table names in schema output", async () => {
    const text = await textOf("get_tenant_schema", { table_name: "請求書" });

    expect(text).toContain("請求書");
  });

  it("marks tenant-scoped SELECT queries as safe", async () => {
    const text = await textOf("validate_tenant_query", {
      query: "SELECT * FROM invoices WHERE tenant_id = 'tenant_123'",
    });

    expect(text).toContain("✅");
    expect(text).toContain("tenant_id");
  });

  it("warns when SELECT queries miss tenant scope", async () => {
    const text = await textOf("validate_tenant_query", {
      query: "SELECT * FROM invoices",
    });

    expect(text).toContain("⚠️");
    expect(text).toContain("tenant_id");
  });

  it("handles malformed SQL without throwing", async () => {
    const text = await textOf("validate_tenant_query", { query: "SELCT from" });

    expect(text).toContain("tenant_id");
  });

  it("rejects empty table names for policy generation", async () => {
    const text = await textOf("generate_rls_policy", { table_name: "   " });

    expect(text).toContain("table_name is required");
  });

  it("generates RLS policy SQL for a table", async () => {
    const text = await textOf("generate_rls_policy", { table_name: "invoices" });

    expect(text).toContain("ALTER TABLE invoices ENABLE ROW LEVEL SECURITY");
    expect(text).toContain("CREATE POLICY");
    expect(text).toContain("tenant_id");
  });

  it("suggests REST endpoints for a feature", async () => {
    const text = await textOf("suggest_endpoint_structure", {
      feature: "billing",
      methods: ["GET", "POST", "PATCH", "DELETE"],
    });

    expect(text).toContain("/api/tenant/[tenantId]/billing");
    expect(text).toContain("GET");
    expect(text).toContain("POST");
    expect(text).toContain("PATCH");
    expect(text).toContain("DELETE");
  });

  it("preserves unicode feature names in endpoint suggestions", async () => {
    const text = await textOf("suggest_endpoint_structure", { feature: "請求" });

    expect(text).toContain("請求");
  });

  it("rejects empty feature names", async () => {
    const text = await textOf("suggest_endpoint_structure", { feature: "" });

    expect(text).toContain("feature is required");
  });
});
```

- [ ] **Step 2: 验证 RED**

```powershell
pnpm --filter @tenantscale/mcp test
```

Expected: FAIL，因为 `../tools` 还不存在，证明测试确实覆盖新边界。

## Task 3: GREEN 实现

- [ ] **Step 1: 抽出纯 handler**

Create `packages/mcp/src/tools.ts`，从 `index.ts` 移动现有 tool definitions 和业务逻辑。

关键接口：

```ts
export const TOOLS = [
  {
    name: "get_tenant_schema",
    description: "Get recommended tenant schema for multi-tenant applications",
    inputSchema: {
      type: "object",
      properties: {
        table_name: { type: "string", description: "Optional table name to generate schema for" },
      },
    },
  },
  {
    name: "validate_tenant_query",
    description: "Validate SQL query for tenant isolation",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "SQL query to validate" },
      },
      required: ["query"],
    },
  },
  {
    name: "generate_rls_policy",
    description: "Generate Row Level Security policy for tenant isolation",
    inputSchema: {
      type: "object",
      properties: {
        table_name: { type: "string", description: "Table name" },
        tenant_column: { type: "string", description: "Tenant ID column name", default: "tenant_id" },
      },
      required: ["table_name"],
    },
  },
  {
    name: "suggest_endpoint_structure",
    description: "Suggest API endpoint structure for multi-tenant applications",
    inputSchema: {
      type: "object",
      properties: {
        feature: { type: "string", description: "Feature name" },
        methods: {
          type: "array",
          items: { type: "string" },
          description: "HTTP methods needed",
        },
      },
      required: ["feature"],
    },
  },
] as const;
```

`callTenantScaleTool()` 返回现有 MCP text content shape：

```ts
type ToolResult = {
  content: Array<{ type: "text"; text: string }>;
};

const textResult = (text: string): ToolResult => ({
  content: [{ type: "text", text }],
});
```

- [ ] **Step 2: 空参数最小校验**

在 `generate_rls_policy` 和 `suggest_endpoint_structure` handler 中用 `trim()` 判断空字符串，返回错误文本：

```ts
if (!tableName.trim()) {
  return "Error: table_name is required";
}
```

```ts
if (!feature.trim()) {
  return "Error: feature is required";
}
```

- [ ] **Step 3: 改入口复用纯模块**

Modify `packages/mcp/src/index.ts`：

```ts
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { TOOLS, callTenantScaleTool } from "./tools";

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) =>
  callTenantScaleTool(request.params.name, request.params.arguments ?? {}),
);
```

- [ ] **Step 4: 验证 GREEN**

```powershell
pnpm --filter @tenantscale/mcp test
```

Expected: PASS。

## Task 4: 测试配置接入

- [ ] **Step 1: 新增 package Vitest 配置**

Create `packages/mcp/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/__tests__/**/*.test.ts"],
  },
});
```

- [ ] **Step 2: 增加 package test script**

Modify `packages/mcp/package.json`:

```json
"scripts": {
  "build": "tsc",
  "dev": "tsx src/index.ts",
  "test": "vitest run"
}
```

保留现有 scripts，只新增 `test`。

- [ ] **Step 3: 接入 workspace**

Modify `vitest.workspace.ts`，加入 MCP entry：

```ts
{
  extends: "./packages/mcp/vitest.config.ts",
  test: {
    name: "mcp",
    root: "./packages/mcp",
  },
}
```

- [ ] **Step 4: 验证 workspace test**

```powershell
pnpm test
```

Expected: existing package tests 和 MCP tests 都通过。

## Task 5: 收尾验证和 PR

- [ ] **Step 1: 代码范围自查**

```powershell
git status --short
git diff --stat
git diff
```

Expected: 只包含 `packages/mcp` 测试/handler 拆分和 root Vitest workspace 变更。

- [ ] **Step 2: 格式和空白检查**

```powershell
git diff --check
```

Expected: 无 trailing whitespace 或 conflict marker。

- [ ] **Step 3: 提交**

```powershell
git add packages/mcp/src/tools.ts packages/mcp/src/index.ts packages/mcp/src/__tests__/tools.test.ts packages/mcp/vitest.config.ts packages/mcp/package.json vitest.workspace.ts
git commit -m "test: add coverage for MCP tool handlers"
```

- [ ] **Step 4: 推送并创建 PR**

```powershell
git push -u origin codex/add-mcp-tool-handler-tests
gh pr create --repo TenantScale/sdk --base main --head cnYui:codex/add-mcp-tool-handler-tests --title "test: add coverage for MCP tool handlers" --body-file pr-body.md
```

PR body 必须包含：

```markdown
## Summary
- add Vitest coverage for the four MCP tool handlers
- extract pure MCP tool handling so tests do not start the stdio server
- cover malformed SQL, empty names, and unicode inputs from #21

## Tests
- pnpm --filter @tenantscale/mcp test
- pnpm test
- git diff --check

Closes #21
```

## 验收标准

- `@tenantscale/mcp` 有可直接运行的 `pnpm --filter @tenantscale/mcp test`。
- 4 个 tool handler 均有回归测试。
- 测试不 import `index.ts`，不会启动 stdio server。
- 正常输出保持 MCP text content shape。
- PR 范围不引入数据库、Supabase、真实 MCP client 或 SQL parser。
