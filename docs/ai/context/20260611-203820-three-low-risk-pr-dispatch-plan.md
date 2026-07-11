# 三个低风险候选并行 PR 派发计划

## 背景

用户要求把当前看板前三个风险低、适合写 PR 的项目直接完成并提交 PR。

本轮主控仓只做协调、记录和二次核验，不在主控仓实现上游改动。三个上游任务互相独立，分别交给三个 worker 在独立目录推进。

## 当前登录与身份

- GitHub CLI 已登录：`cnYui`
- Git 提交身份：`cnYui <xiaobianfuai@gmail.com>`
- `user.useConfigOnly=true`

## 派发边界

### 1. `mcpjungle/MCPJungle#247`

- 目录：`work/MCPJungle-247`
- 分支：`codex/add-cli-config-validation`
- 目标：为 CLI 增加配置文件验证入口，优先复用或新增 server-side validation，再接入 `mcpjungle validate <file>`
- 范围：只做最小可测切片，避免一次性推断所有配置 schema
- 验证优先级：目标 Go 单测、相关 CLI 测试、必要时 `go test ./...`

### 2. `IBM/mcp-context-forge#22`

- 目录：`work/mcp-context-forge-22`
- 分支：`codex/docs-beeai-integration`
- 目标：补 BeeAI Framework 与 MCP Gateway 的集成文档
- 范围：按 issue 指定位置新增 `docs/docs/using/agents/beeai.md`，并更新 `.pages`
- 验证优先级：文档链接/格式检查、项目现有文档构建或最小 markdown/pre-commit 检查

### 3. `coleam00/Archon#1895`

- 目录：`work/Archon-1895`
- 分支：`codex/fix-workflow-bash-output-quoting`
- 目标：清理 shipped workflow 中 `$node.output` 被双引号包裹的 bash footgun，并刷新 bundled defaults
- 范围：优先修 issue 点名的 `.archon/workflows/defaults/archon-fix-github-issue.yaml`，必要时跑生成命令更新 bundled 输出；不误改 `when:`、`prompt:`、`command:` 等非 bash 文本
- 验证优先级：先构造或运行 validator 证明 warning 存在，再修复；之后跑 `bun run cli validate workflows` 和必要的 `bun run validate`

## Worker 统一要求

- 先重新确认 issue 仍 open，且没有新 open PR 覆盖同一问题。
- 先读仓库贡献指南、测试脚本和现有模式。
- 行为改动必须按 TDD：先补失败测试或用现有 validator 记录 RED，再做最小实现。
- 提交前检查 `git status --short`、`git diff --stat`、`git diff --check`。
- 只提交与当前 issue 直接相关的文件。
- 推送到 `cnYui` fork 并创建 PR 到上游默认分支。
- 回传：本地目录、分支、commit SHA、PR URL、改动文件、验证命令和结果、远端 checks 初始状态、任何 blocker。

## 主控窗口验收

- 读取三个 worker 的回传。
- 用 GitHub CLI 或 MCP 二次确认 PR URL、head SHA、改动范围和 checks。
- 新建提交记录文档并更新 `AGENTS.md` 索引。
