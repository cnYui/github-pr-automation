# IBM/mcp-context-forge#22 BeeAI 文档计划

## 背景

- worker：worker 2
- 上游仓库：`IBM/mcp-context-forge`
- 本地工作目录：`D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\mcp-context-forge-22`
- 分支：`codex/docs-beeai-integration`
- 目标 issue：`https://github.com/IBM/mcp-context-forge/issues/22`

## 已确认事实

- `gh auth status` 显示当前登录账号为 `cnYui`。
- 全局 Git 身份为 `cnYui <xiaobianfuai@gmail.com>`，`user.useConfigOnly=true`。
- issue #22 当前状态为 `OPEN`。
- 精确搜索 `BeeAI`、`MCPTool`、`bee.md`、`beeai.md`、`Add BeeAI framework client integration` 没有发现覆盖同一文档的 open PR。
- 目标目录最初不存在；首次 clone 超时留下半成品 `.git`，已确认无 HEAD/default refs 后只删除该新建目标目录并重新浅克隆。

## 缺口证明

- `docs/docs/using/agents/beeai.md` 当前不存在。
- `docs/docs/using/agents/.pages` 当前只列出 `bee.md`，没有 `beeai.md`。
- 现有 `docs/docs/using/agents/bee.md` 使用旧 Bee Agent Framework 叙述和旧链接，缺少 Python 示例、`MCPTool.from_client`、`streamablehttp_client`、`sse_client`、TypeScript HTTP/SSE transport 变体和 `mcpgateway-wrapper` 示例。

## 当前 API 来源

- BeeAI Framework 官方文档：`https://framework.beeai.dev/modules/tools`
- BeeAI Framework TypeScript 示例：`typescript/examples/tools/mcp.ts`
- BeeAI Framework Python 示例：`python/examples/tools/mcp/mcp_stdio.py`、`mcp_streamable_http.py`、`mcp_sse.py`
- BeeAI Framework Python MCPTool 实现：`python/beeai_framework/tools/mcp/mcp.py`
- MCP TypeScript SDK v1 文档和源码用于 transport import：`@modelcontextprotocol/sdk/client/stdio.js`、`streamableHttp.js`、`sse.js`

## 设计

- 使用 `docs/docs/using/agents/beeai.md` 作为新规范页面，满足 issue 指定位置和当前 BeeAI 命名。
- 将 `.pages` 中的 `bee.md` 替换为 `beeai.md`，让左侧导航指向新页面。
- 更新 `docs/docs/using/agents/index.md` 中 BeeAI 条目到 `beeai.md`。
- 删除或保留旧 `bee.md` 的取舍：
  - 删除会移除旧 `/using/agents/bee/` 页面，可能影响外部链接。
  - 保留会留下一个不在导航中的旧页面，但避免破坏旧 URL。
  - 本次采用保留旧页、不导航的最小风险方案。

## 实施计划

1. 新增 `docs/docs/using/agents/beeai.md`，内容覆盖 BeeAI 概览、安装、Python stdio wrapper、Python Streamable HTTP/SSE、TypeScript stdio wrapper、TypeScript HTTP/SSE transport 变体、工具发现提示和官方链接。
2. 更新 `docs/docs/using/agents/.pages`，把 `bee.md` 替换成 `beeai.md`。
3. 更新 `docs/docs/using/agents/index.md`，BeeAI 条目链接到 `beeai.md`。
4. 运行缺口回归检查：文件存在、导航引用、关键 API/链接 grep。
5. 运行轻量文档验证：Markdown 结构/链接检查、`git diff --check`；如可用，优先跑 docs 最小构建或 touched-file markdown lint。
6. 自查 `git status --short`、`git diff --stat`、`git diff`，只提交相关文档文件。
7. 提交、推送到 `cnYui` fork，并创建指向 `IBM/mcp-context-forge:main` 的 PR。
8. 创建 PR 后读取 PR URL、head SHA 和初始 checks 状态。

## 风险边界

- 本次只改文档，不改生产代码或构建配置。
- 示例以当前 BeeAI 和 MCP SDK 文档为准，但不在本地运行 BeeAI 端到端示例；验证重点是文档存在、导航、格式和链接。
- 旧 `bee.md` 保留为非导航页面，避免破坏现有 URL；后续如维护者要求可改为删除或重定向方案。
