# 三个低风险候选 PR 并行执行计划

## 背景

当前日报页面前三个低风险候选分别是：

1. `googleworkspace/cli#839`
2. `trycua/cua#1868`
3. `upstash/context7#300`

本轮目标是用三个独立子 agent 分别修复、验证、提交 PR。主控仓只负责调度、审计和记录，不直接修改上游项目代码。

## 执行边界

- 子 agent 模型：`gpt-5.5`
- 推理强度：`xhigh`
- 每个子 agent 独立 clone 或使用独立工作目录，禁止修改 `D:\CodeWorkSpace\github-10-pr-pr-5-pr`
- 每个上游仓库使用 `codex/` 前缀分支
- Git author 必须为 `cnYui <xiaobianfuai@gmail.com>`，并设置 `user.useConfigOnly=true`
- 提交前必须核对是否已有重复 open PR
- 代码修复类任务必须按 TDD：先新增失败测试并记录 RED，再实现 GREEN
- 文档型任务至少跑 `git diff --check`，并用 grep 或项目现有文档检查方式证明示例可定位

## 子任务

### googleworkspace/cli#839

问题：`gws <service> <resource> --help` 的 Usage 缺少 service 层级。

预期：

- 新增 CLI help 回归测试或快照测试，先证明当前 Usage 错误
- 修复 help/usage 生成逻辑
- 验证 `gws sheets --help` 与 `gws sheets spreadsheets --help` 的 Usage 包含正确层级
- 避开已有 PR 覆盖的 `#789` 方向

### trycua/cua#1868

问题：PyPI distributions 或 `libs/` 独立包缺少 license metadata，导致企业 JFrog Artifactory 阻止安装。

预期：

- 枚举实际 Python package 与 `pyproject.toml`
- 补齐 license metadata、classifiers 或 LICENSE 包含规则
- 尽量只改 package metadata，不改 runtime
- 如项目已有 metadata 校验或 build 检查，优先复用

### upstash/context7#300

问题：Docker MCP Toolkit 使用 `mcp/context7` 时默认 HTTP transport 导致 VS Code/Cline/Roo 初始化失败；维护者已欢迎 README 更新，说明 `MCP_TRANSPORT=stdio`。

预期：

- 只更新 README 或文档配置示例
- 明确 Docker MCP Toolkit 场景需要 `MCP_TRANSPORT=stdio`
- 不修改 Dockerfile 默认 transport，避免影响 Smithery/HTTP 用法
- 用 grep、链接/格式检查或 `git diff --check` 验证

## 主窗口验收

每个子 agent 返回后，主窗口核对：

- PR URL 与目标 upstream/base branch
- commit SHA、author metadata、changed files
- 验证命令和结果
- open PR 查重结论
- 未跑测试及原因

随后在 `docs/ai/context/` 新增提交记录，并把项目记忆追加到 `AGENTS.md`。
