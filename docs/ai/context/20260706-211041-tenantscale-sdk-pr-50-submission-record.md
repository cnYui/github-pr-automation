# TenantScale/sdk PR #50 提交记录

## 结论

已向 `TenantScale/sdk` 提交 PR #50：

https://github.com/TenantScale/sdk/pull/50

标题：

```text
test: add coverage for MCP tool handlers
```

本地分支：

```text
codex/add-mcp-tool-handler-tests
```

提交：

```text
b105131 test: add coverage for MCP tool handlers
```

## 范围

本 PR 解决 issue #21：

- 为 `@tenantscale/mcp` 增加 Vitest 配置和 `test` script。
- 抽出 `packages/mcp/src/tools.ts`，让测试 import 纯 tool handler，不启动 stdio server。
- 覆盖 4 个 MCP tool handler：
  - `get_tenant_schema`
  - `validate_tenant_query`
  - `generate_rls_policy`
  - `suggest_endpoint_structure`
- 覆盖 issue 指定边界：
  - malformed SQL 不应被标为安全。
  - 空 table / feature 返回可读错误。
  - unicode table / feature 输出不丢字符。
- 顺手把 `vitest.workspace.ts` 从当前 Vitest 4 不存在的 `defineWorkspace` 迁移到 `defineConfig({ test: { projects } })`，并加入 MCP project。

未做：

- 未改 MCP tool name。
- 未改正常 MCP response shape。
- 未引入 SQL parser、数据库、Supabase 或真实 MCP client。

## 验证

通过：

```powershell
corepack pnpm --filter @tenantscale/mcp test
```

结果：

```text
Test Files  1 passed (1)
Tests  11 passed (11)
```

通过：

```powershell
corepack pnpm --filter @tenantscale/mcp build
```

结果：

```text
@tenantscale/mcp@0.1.0 build
tsc
```

通过：

```powershell
git diff --check
```

结果：无 whitespace / conflict marker 错误。

额外尝试：

```powershell
corepack pnpm test
corepack pnpm build
```

结果：本地被 Codex runtime 的 pnpm 11 deps-status/install 审批路径阻断，报 `ERR_PNPM_IGNORED_BUILDS`，涉及 `esbuild@0.28.1` 和 `sharp@0.34.5`。这不是 MCP 测试断言失败。

也尝试直接运行：

```powershell
.\node_modules\.bin\vitest.cmd run --config vitest.workspace.ts
```

结果：workspace 配置可加载，但全量测试失败于既有构建前置：CLI 测试找不到 `packages/cli/dist/index.js`，adapter 测试找不到已构建的 `@tenantscale/sdk` entry。这与本次 MCP 改动无关。

## 远端状态

创建 PR 后即时检查：

```text
state: OPEN
mergeable: MERGEABLE
base: main
head: cnYui:codex/add-mcp-tool-handler-tests
```

远端 checks：

```text
check   pass
label   pass
welcome pass
```
