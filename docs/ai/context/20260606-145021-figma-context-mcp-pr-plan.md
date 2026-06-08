# GLips/Figma-Context-MCP PR 计划

## 背景

用户指定从当前日报候选中推进 `GLips/Figma-Context-MCP` 并提交 PR。当前报告给出的机会类型是测试补充，候选方向包括 MCP OAuth、telemetry redaction、Figma payload 限制。

## 最新取证

- `telemetry redaction` 已有开放 issue `#354` 和开放 PR `#356`，重复提交风险高。
- payload/大文件限制已有开放 PR `#158`、`#256`、`#270` 等，方向拥挤且容易和维护者现有判断冲突。
- OAuth issue `#337` 由 owner 创建，明确指出当前远程 HTTP server 不支持 MCP-spec OAuth 发现与客户端到 server 的 bearer 认证。
- 当前代码只支持启动级 `FIGMA_OAUTH_TOKEN` 或请求级 `X-Figma-Token`，没有请求级 `Authorization: Bearer` 入口。

## 设计选择

本轮不尝试一次性完成完整 OAuth authorization code flow。原因是完整实现需要 client registration、callback、token exchange、token validation 等配置和产品决策，单次外部 PR 风险偏高。

本轮选择最小可合并切口：让 HTTP `/mcp` 与兼容 `/sse` 入口接受请求级 `Authorization: Bearer <token>`，并将它解析为请求级 Figma OAuth token。这样可以复用现有 `FigmaService` 的 OAuth header 行为，先补上 MCP 客户端常见 bearer 传递路径。

## 实现计划

1. 在 `src/tests/http-header-auth.test.ts` 先新增失败测试：
   - 通过 HTTP request `Authorization: Bearer request-oauth-token` 调用 `get_figma_data`。
   - 断言转发到 Figma API 的 header 是 `Authorization: Bearer request-oauth-token`。
   - 断言请求级 Bearer 优先于启动级 API key。
2. 修改 `src/server.ts`：
   - 新增 `getRequestBearerToken(req)`。
   - `resolveRequestAuth` 接受请求级 API key 和 bearer token。
   - 请求级 `X-Figma-Token` 优先，`Authorization: Bearer` 其次，保持现有 API key 行为不变。
   - telemetry request secret redaction 同时覆盖请求级 API key 和 bearer token。
3. 验证：
   - 先运行新增测试并确认 RED。
   - 实现后运行相关测试。
   - 运行 `pnpm type-check` 和 `pnpm lint`。
4. 提交与 PR：
   - fork 分支使用 `codex/http-bearer-oauth-token`。
   - PR 标题使用 Conventional Commit：`feat: support request bearer OAuth tokens over HTTP`。
   - PR 描述说明这是 `#337` 的小步前置，不关闭完整 OAuth issue。

## 风险

- 该 PR 不实现 OAuth discovery、401 challenge、authorization server metadata 或 authorization code flow，因此不应写 `Closes #337`。
- 请求级 Bearer token 会被当作 Figma OAuth token 使用，实际有效性由 Figma API 验证；这是和现有启动级 `FIGMA_OAUTH_TOKEN` 一致的边界。
