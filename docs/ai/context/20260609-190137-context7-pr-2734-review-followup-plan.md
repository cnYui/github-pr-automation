# context7 PR #2734 review follow-up 计划

## 背景

- `upstash/context7#2734` 当前被 maintainer `enesgules` 请求修改。
- review 原文要求：不要更新根目录 `README.md`，改为更新 MCP 包 README 和 docs。
- 本地工作树：`work/context7-300`，分支 `codex/context7-300-docker-stdio-docs`。
- GitHub 登录已确认可用：`gh auth status` 显示当前账号为 `cnYui`。

## 问题判断

当前 PR 只改了根目录 `README.md`，新增 `Docker MCP Toolkit` 小节。该内容描述的是 Docker MCP Toolkit 镜像 `mcp/context7` 在 stdio 客户端中的启动方式，属于 MCP server 安装/客户端配置细节，不适合放在项目首页。

## 调整方案

1. 从根目录 `README.md` 移除 `Docker MCP Toolkit` 小节，恢复首页只保留主安装入口和手动安装链接。
2. 在 `packages/mcp/README.md` 的 Docker 安装说明附近补充 Docker MCP Toolkit 镜像用法。
3. 在 `docs/resources/all-clients.mdx` 的 Docker 客户端文档附近补充同等说明，覆盖站点 docs。
4. 不引入代码改动，不新增测试用例；用 grep、diff check 和必要的格式检查确认文档位置与语法。

## 验证计划

- `rg -n "Docker MCP Toolkit|MCP_TRANSPORT=stdio|mcp/context7" README.md packages/mcp/README.md docs/resources/all-clients.mdx`
- `git diff --check`
- 如仓库脚本可用，优先运行文档格式检查；否则记录未运行原因。

## GitHub 回复口径

修复后在 PR 中回复：已从根 README 移除该段，并补到 `packages/mcp/README.md` 和 `docs/resources/all-clients.mdx`；附上验证命令。
