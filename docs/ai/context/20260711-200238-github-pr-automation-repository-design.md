# GitHub PR 自动化主控仓库设计

## 目标

将现有 `github-10-pr-pr-5-pr` 仓库重命名为 `github-pr-automation`，并把候选扫描、执行 PR、定时编排三个 Skill 的源码和持久状态能力统一纳入版本管理。

## 核心边界

- 保留三个独立 Skill，由一个编排 Skill 在同一次 cron 运行中串联。
- `值得继续` 只允许候选进入 live preflight，不允许跳过默认分支、重复 PR、贡献门禁和本地验证复核。
- 允许自动 clone、fork、修改、测试、commit、push 和创建 PR，禁止自动 merge。
- 内部状态与总结使用中文；上游代码注释、文档、提交信息和 PR 文案遵循目标仓库的主要沟通语言。
- GitHub 远程操作使用 `gh`，本地分支、提交和推送使用 `git`，代码修改与验证使用目标仓库工具链。

## 路径

- 主控源码：`D:\CodeWorkSpace\github-pr-automation`
- Skill 源码：仓库内 `skills/<skill-name>`
- Skill 安装：`C:\Users\yui\.codex\skills\<skill-name>`
- 候选仓库：`work/opportunity-pipeline`
- 运行状态：`data/pipeline`
- 公开报告：`public/reports`

仓库内 Skill 是唯一源码，安装目录由同步脚本生成。

## 状态模型

每轮运行复制日期报告到 `data/pipeline/runs/<runId>/candidates.json`，同时记录源报告路径与 SHA-256。执行阶段只读取该快照，不重新读取可能被覆盖的 `latest.json`。

候选状态：

`pending -> preflight -> implementing -> verifying -> pr_opened`

任一步可以转为 `skipped` 或 `blocked`。没有完整 preflight 证据时禁止进入 `implementing`。

## 并发与恢复

- 使用排他 lease 文件阻止 cron 重叠运行。
- lease 过期后允许下一轮接管。
- `current.json` 指向未完成运行，下一次启动优先恢复。
- ledger 以 issue URL 或稳定机会哈希去重，避免跨日重复提交。
- 所有状态 JSON 使用临时文件加原子 rename 写入。

## Git 内容策略

- 提交项目源码、Skill 源码、公开报告、构建后的静态页面和 `docs/ai/context` 历史记录。
- 忽略 `work/`、`data/`、运行锁、缓存、日志、凭据和 Python `__pycache__`。
- 删除仓库根目录误生成的字面量 `~/` 目录，不触碰真实用户主目录。
- 当前分支清理并验证后快进合并到 `main`，不制造无意义 merge commit。

## 仓库改名

使用 `gh repo rename github-pr-automation --yes` 修改远程名称，再将本地目录改为 `D:\CodeWorkSpace\github-pr-automation`。随后更新本地 remote、Codex 项目路径和现有 `cnyui-pr` 自动化绑定。

## 主要风险

- 当前自动扫描器只做启发式仓库信号分析，具体 issue 证据仍需 live preflight。
- 当前工作区包含大量历史文档和报告，必须先查敏感信息并按目录精确暂存。
- `GITHUB_TOKEN` 当前未设置，扫描器需要支持 `GH_TOKEN`、`GITHUB_TOKEN` 和 `gh auth token` 的非交互回退。
- `vitest` 必须限制在本仓测试，避免扫描 `work/` 内克隆仓库。
