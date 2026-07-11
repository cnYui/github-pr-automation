# TenantScale/sdk#21 PR 设计文档

## 目标

为 `TenantScale/sdk#21` 提交一个测试补充 PR，让 `@tenantscale/mcp` 包具备 Vitest 测试配置和覆盖 4 个 MCP tool handler 的回归测试。

## 当前状态

- issue：https://github.com/TenantScale/sdk/issues/21
- 当前状态：open。
- 当前 open PR：无。
- 结论：没有发现同向 open PR。

## 真正问题

`packages/mcp/src/index.ts` 同时承担三件事：

- 定义 MCP tools。
- 实现 tool handler 的业务逻辑。
- 在模块顶层连接 stdio transport 并启动 server。

这导致直接 import `index.ts` 做单元测试会启动 MCP stdio server。真正需要解决的不是“随便加几个测试”，而是先把纯 handler 逻辑从启动入口中分离出来，让测试能在不启动进程通信的情况下覆盖业务行为。

## 最小 PR 边界

必须做：

- 新增 `packages/mcp/vitest.config.ts`。
- 在 `packages/mcp/package.json` 增加 `test` script。
- 抽出可测试的纯 handler 模块。
- 覆盖 4 个工具：
  - `get_tenant_schema`
  - `validate_tenant_query`
  - `generate_rls_policy`
  - `suggest_endpoint_structure`
- 覆盖 issue 明确要求的边界：
  - malformed SQL
  - empty table names
  - unicode edge cases

不做：

- 不改变 MCP tool name。
- 不改变 MCP response shape：仍返回 `{ content: [{ type: "text", text }] }`。
- 不引入外部数据库、Supabase 或真实 MCP client。
- 不扩展功能语义，例如真实 SQL parser、真实 schema introspection。

## 设计

建议把 `packages/mcp/src/index.ts` 拆薄为 server wiring，只负责 MCP `Server`、`StdioServerTransport` 和 request handler 注册。

新增 `packages/mcp/src/tools.ts`，负责：

- 导出 `TOOLS`。
- 导出 4 个 handler 函数。
- 导出一个小的 `callTenantScaleTool(name, args)` 函数，集中处理 tool dispatch，并返回 MCP text content。

测试只 import `tools.ts`，不 import `index.ts`。这样不会启动 stdio server，也符合当前 workspace 中其他 package 用 Vitest 覆盖纯逻辑的模式。

## 预期改动文件

- `packages/mcp/src/tools.ts`
  - 新增。承载 `TOOLS`、handler 和 dispatch。
- `packages/mcp/src/index.ts`
  - 修改。保留 server wiring，复用 `tools.ts`。
- `packages/mcp/src/__tests__/tools.test.ts`
  - 新增。覆盖 4 个 tool handler。
- `packages/mcp/vitest.config.ts`
  - 新增。沿用其他 package 的 `globals: true`、`environment: "node"`、`include: ["src/**/__tests__/**/*.test.ts"]`。
- `packages/mcp/package.json`
  - 增加 `"test": "vitest run"`。
- `vitest.workspace.ts`
  - 增加 `mcp` workspace entry，root 指向 `./packages/mcp`。

## 测试设计

`get_tenant_schema`：

- 无 table 参数时，返回标准表说明，并包含 `tenants`、`tenant_users`、`tenant_id`。
- table 为 unicode 名称时，返回文本中包含原 table 名，证明不丢字符。

`validate_tenant_query`：

- `SELECT * FROM invoices WHERE tenant_id = '...'` 返回安全。
- `SELECT * FROM invoices` 返回缺少 WHERE / tenant scope 的警告。
- malformed SQL 例如 `SELCT from` 不应抛异常，应返回缺少 tenant scope 的可读提示或安全失败提示。
- empty table name 应返回可读提示，不应生成空表名误导文本。

`generate_rls_policy`：

- 正常 table 返回 `ALTER TABLE`、`ENABLE ROW LEVEL SECURITY`、`CREATE POLICY` 和 tenant_id index。
- empty table name 应返回错误文本或抛出明确参数错误；测试先定义期望，再实现最小校验。

`suggest_endpoint_structure`：

- `feature = "billing"` + `GET/POST/PATCH/DELETE` 返回对应 REST route。
- unicode feature 名不应破坏输出。
- empty feature 应返回明确错误。

## 实现顺序

1. 写 `tools.test.ts`，先验证当前缺少 `tools.ts` 导致测试失败。
2. 创建 `tools.ts`，移动纯逻辑。
3. 改 `index.ts` 使用 `TOOLS` 和 `callTenantScaleTool`。
4. 补空字符串校验，保持已有正常输出不变。
5. 增加 `vitest.config.ts`、`package.json` test script、workspace entry。
6. 跑目标测试，再跑 workspace 相关测试。

## 验证命令

优先：

```bash
pnpm --filter @tenantscale/mcp test
```

如果 filter 不稳定：

```bash
cd packages/mcp
pnpm test
```

再跑：

```bash
pnpm test
git diff --check
```

## 风险

- 当前 `index.ts` 顶层启动 stdio，测试必须避开 import 入口文件。
- 不要为了 malformed SQL 引入重型 SQL parser；issue 目标是 handler 测试，不是 SQL 解析器重写。
- 空 table / feature 的行为当前没有定义，测试应选择最小、可读、不会影响正常调用的错误文本或参数错误。

## 建议 PR 信息

标题：

```text
test: add coverage for MCP tool handlers
```

正文要点：

- 为 `@tenantscale/mcp` 增加 Vitest 配置和 test script。
- 抽出纯 MCP tool handler，避免测试启动 stdio server。
- 覆盖 4 个 tool handler 和 issue 指定边界。
- 附验证命令。
