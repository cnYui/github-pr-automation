# context7 PR #2734 Docker 示例复核记录

## 结果

- 状态：`DONE`
- PR：`upstash/context7#2734`
- 工作目录：`D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\context7-2734-followup`
- 分支：`codex/context7-300-docker-stdio-docs`
- 推送前 head：`4c9822798b32c94b65058e4c3e52b2723d228f8d`
- 推送后 head：`96254c6309f16d889ec3d3e4d104acaa74a68932`
- 新提交：`96254c6 docs: clarify Docker stdio client examples`
- PR 回复：`https://github.com/upstash/context7/pull/2734#issuecomment-4678096455`

## 检查范围

- `packages/mcp/README.md`
- `docs/resources/all-clients.mdx`
- 搜索关键词：`Docker`、`mcp/context7`、`MCP_TRANSPORT`、`Cline`、`Roo Code`、`Claude Desktop`、`VS Code`
- 对照源码确认：`@upstash/context7-mcp` CLI 默认 `--transport stdio`，因此自建 Docker 镜像可作为 stdio client 的本地 server 使用。

## 改动

- 自建 Dockerfile 示例从 `CMD ["context7-mcp"]` 改为显式 `CMD ["context7-mcp", "--transport", "stdio"]`。
- Docker MCP Toolkit `mcp/context7` 示例保留 `MCP_TRANSPORT=stdio`。
- 将 Docker Toolkit 示例拆清：
  - Cline / Roo Code / Claude Desktop 使用 `mcpServers` 配置形状。
  - VS Code 使用 `servers` 配置形状，并显式 `type: "stdio"`。

## 验证

- `pnpm install --frozen-lockfile`：通过，lockfile 未变。
- `pnpm exec prettier --check packages/mcp/README.md docs/resources/all-clients.mdx`：通过。
- `git diff --check HEAD^ HEAD`：通过。
- `gh pr view 2734 --repo upstash/context7 --json headRefOid,comments,statusCheckRollup,reviewDecision,url`：确认 PR head 为 `96254c6309f16d889ec3d3e4d104acaa74a68932`，评论已发布，当前无远端 checks。

## 限制

- 本机 Docker CLI 存在，但 Docker Desktop daemon 未运行；未运行 `mcp/context7` 容器实测。文档判断基于仓库源码、现有客户端配置形状和 Docker Toolkit 镜像的 `MCP_TRANSPORT=stdio` 约定。
