# context7 PR #2734 Docker 示例复核计划

## 背景

- PR：`upstash/context7#2734`
- 当前 head：`cnYui/context7` PR 分支，上次推送 `4c98227`
- maintainer 新反馈：要求复核现有 Docker 示例是否也不正确，点名 Cline，并检查 Docker examples 是否有效。

## 必须解决的问题

1. 确认 docs 中 `Docker MCP Toolkit`、`mcp/context7`、`docker`、`MCP_TRANSPORT` 相关示例的当前形态。
2. 对 stdio-based clients（Cline、Roo、Claude Desktop、VS Code 等）判断是否需要显式 `MCP_TRANSPORT=stdio` 或命令形式调整。
3. 如果存在不一致，仅修改相关文档，不做无关格式化。
4. 如果无需修改，用证据回复 maintainer。

## 执行边界

- 使用独立目录 `work/context7-2734-followup`；若目录已有未提交改动，则另起后缀目录。
- 使用现有 PR 分支，不新开 PR。
- 验证优先使用 touched-file Prettier 与 `git diff --check`，避免 repo 级历史格式噪声。
- PR 评论只说明已检查范围、修改文件和实际跑过的验证命令。
