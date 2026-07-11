# GitHub PR 自动化主控仓库实施计划

## 1. 清理历史状态

- 审计当前分支、未提交文件和未跟踪目录。
- 保留并提交有意义的历史 `docs/ai/context` 与日期报告。
- 将快照、流水线状态、克隆仓库、缓存和误生成目录加入忽略规则。
- 检查待提交内容不包含凭据。

## 2. 纳入 Skill 源码

- 将现有 `github-daily-pr-opportunity-scan` 迁入仓库。
- 用 `skill-creator` 初始化 `github-implement-pr-opportunity`。
- 用 `skill-creator` 初始化 `github-run-pr-opportunity-pipeline`。
- 生成并核对三个 `agents/openai.yaml`。
- 增加确定性的 Skill 安装脚本。

## 3. 实现流水线基础能力

- 抽离 GitHub token 解析，增加 `gh auth token` 回退。
- 增加原子 JSON 写入。
- 新增 pipeline schema、store、lease、ledger 和状态转换。
- 新增薄 CLI，供编排 Skill 创建、恢复和推进运行。
- 增加 `config/pipeline.json`。

## 4. 测试

- 覆盖 token 优先级与无泄漏失败。
- 覆盖 lease 冲突、过期接管和 owner 校验。
- 覆盖候选快照、状态转换、恢复和 ledger 去重。
- 限制 Vitest 只执行本仓测试。
- 运行全量测试、类型检查、构建和三个 Skill 校验。
- 只做无远程写入的流水线 dry-run，不在本次改造中自动创建外部 PR。

## 5. Git 与改名

- 精确暂存并提交历史清理与流水线代码。
- 将功能分支快进合并到 `main`。
- 推送并确认远端状态。
- 使用 `gh` 将远程仓库改名为 `github-pr-automation`。
- 将本地目录改名并更新现有自动化路径。
- 重新核对 `origin`、GitHub 仓库、Skill 安装和工作区状态。

## 6. 后续 cron

本次先准备可执行项目。新 cron 需要用户确定具体时间后再创建；它只调用 `github-run-pr-opportunity-pipeline`，绑定本地项目并使用持久状态恢复。
