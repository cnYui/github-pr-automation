# GLips/Figma-Context-MCP PR #384 提交记录

## PR

- URL: https://github.com/GLips/Figma-Context-MCP/pull/384
- 标题: `feat: support request bearer oauth tokens over HTTP`
- 分支: `cnYui:codex/http-bearer-oauth-token`
- base: `GLips/Figma-Context-MCP:main`
- commit: `c04b9ff62452ed9b3afcc89c4c480aadba698903`

## 改动范围

- `src/server.ts`
  - 解析请求级 `Authorization: Bearer TOKEN`。
  - 请求级 `X-Figma-Token` 优先，bearer token 其次，最后回落到 server 启动级凭据。
  - request scoped telemetry redaction 覆盖请求级 API key 和 bearer token。
- `src/services/figma.ts`
  - 缺失凭据错误文案补充 `Authorization: Bearer` 入口。
- `src/tests/http-header-auth.test.ts`
  - 新增请求级 bearer token 转发测试。
  - 新增请求级 bearer token 覆盖 server API key 测试。

## 验证

- RED: `pnpm test -- src/tests/http-header-auth.test.ts` 中新增 bearer 测试失败，失败原因分别是无凭据和仍使用 server API key。
- GREEN: `pnpm exec vitest run src/tests/http-header-auth.test.ts` 通过，5 个测试。
- `pnpm exec vitest run src/tests/http-header-auth.test.ts src/tests/telemetry-redaction.test.ts` 通过，2 个测试文件、6 个测试。
- `pnpm exec vitest run src/tests/server.test.ts --testNamePattern "StreamableHTTP transport|Method not allowed|Multi-client test|Server lifecycle"` 通过，10 个测试，1 个 process-level case 被过滤。
- `pnpm type-check` 通过。
- `pnpm lint` 通过。
- pre-commit hook 自动通过 `scan-hidden-chars`、`format`、`lint`、`type-check`。

## 未跑的内容

未把 full `pnpm test` 作为最终通过项。原因是本机 Windows 环境里上游现有 `src/tests/server.test.ts` 的 process-level case 直接 `spawn("tsx")`，此前触发 `spawn tsx ENOENT`，和本次 bearer auth 改动无关。PR 描述里已说明这个限制。

## 远端状态

创建 PR 后，`gh pr checks` 返回 no checks reported；GitHub status API 对 head commit 返回 `total_count: 0`、`state: pending`。
