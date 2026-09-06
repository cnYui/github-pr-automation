# 项目记忆

## GitHub 每日 PR 机会展示页

- 首版目标：每天发现 GitHub 最近 24 小时新增 Star 较高的热门项目，语言不限，生成只读表格报告，帮助用户选择后续要推进的项目。
- 页面边界：单页表格，只展示项目、热度、健康度、PR 切入口、证据、风险和建议动作，不放按钮，不操作 GitHub。
- 自动化边界：不自动 fork、不自动提交、不自动打开 PR；用户在对话中点名项目后才进入单独推进流程。
- 数据口径：页面可直接使用 GitHub Trending daily 填充；自动扫描优先用每日 Star 快照差分计算 24 小时新增 Star，首次运行可用 GitHub Search 冷启动。
- 贡献范围：文档缺口、示例补全、测试补充、小 bug、CI/类型错误修复；排除纯格式化、批量拼写和无明确价值的大改。
- 推荐门槛：只有低风险且切入口明确的项目标为 `值得继续`；中风险标为 `谨慎`；高风险标为 `跳过`。
- Skill 方向：创建 `github-daily-pr-opportunity-scan`，用于规范每日扫描流程和报告 JSON 输出，不用于自动提交 PR。
- 实现计划：见 `docs/ai/context/20260605-211520-github-daily-pr-opportunity-implementation-plan.md`；执行阶段按 TDD，先测试扫描逻辑和页面只读约束，再创建 Skill。
- 2026-06-07 失败 PR 根因复查：`graphiti#1539` 当前代码相关 checks 已通过且 triage 标记 `merge-ready`，仅 CLA 未签；`CopilotKit#5296` 和 `cell-architecture-studio#8` 失败均为 Vercel 授权/账号阻塞；这三项都不应通过改代码或空提交重提解决，详见 `docs/ai/context/20260607-104713-failed-pr-root-cause-review.md`。
- 2026-07-11 候选实施复核修正：`speckit-companion#419` 与 `Aegis#2` 虽仍 open 且无重复 PR，但已被上游直接提交修复；后续机会扫描必须同时检查默认分支实现状态，不能只看 issue/PR 状态。本轮分别改为 README 安装命令跟进和 `ProfileManager` 启动回归测试。
- 2026-07-11 主控仓库方向：将仓库改名为 `github-pr-automation`，保留扫描、执行、编排三个独立 Skill，由一个 cron 在同一次运行中串联；仓内 `skills/` 是 Skill 唯一源码，安装目录只作为同步产物。
- 2026-07-11 自动执行授权：`值得继续` 只允许进入 live preflight；复核通过后允许 clone、fork、修改、验证、commit、push 和创建 PR，禁止自动 merge。内部记录使用中文，上游内容遵循目标仓库的主要沟通语言。
- 2026-07-11 持久化边界：每轮使用不可变候选快照、lease、current run 和 ledger 支持并发保护、失败恢复和跨日去重；`work/` 与 `data/` 不进入 Git，公开报告和上下文文档继续版本管理。设计与计划见 `docs/ai/context/20260711-200238-github-pr-automation-repository-design.md` 和 `docs/ai/context/20260711-200238-github-pr-automation-repository-plan.md`。
- 2026-07-11 GitHub 工具边界：`gh` 负责认证、仓库/Fork/PR/Review/checks 等远程操作；本地修改、测试、分支、commit 和 push 必须组合 Codex、项目工具链与标准 `git`。自动化始终禁止自动 merge。
- 2026-07-11 主控仓库迁移完成：GitHub 仓库为 `cnYui/github-pr-automation`，本地主路径为 `D:\CodeWorkSpace\github-pr-automation`；`work/`、`data/` 和本地依赖已完整迁入，现有 `cnyui-pr` 自动化也已保持原频率并改绑新路径。旧路径仅因 Codex 进程监听空 `.codex` 目录而暂时保留，重启 Codex 后可删除，不再作为主控仓使用。详见 `docs/ai/context/20260711-210903-github-pr-automation-repository-migration-record.md`。
- 2026-07-14 主控仓同步边界：本轮处理根仓库 `git status` 中全部报告、上下文文档和项目记忆；继续排除 `.gitignore` 管理的 `work/`、`data/`、依赖、环境文件和运行缓存。远端 `cnYui/github-pr-automation` 已存在且 `origin` 配置正确，不重复创建，直接验证后同步 `main`。设计与计划见 `docs/ai/context/20260714-093703-workspace-sync-design.md` 和 `docs/ai/context/20260714-093703-workspace-sync-plan.md`。
- 2026-07-14 `destructive_command_guard` PR 阻塞：live preflight 确认该仓 LICENSE rider 明确排除 OpenAI、Anthropic 及其代理，并把分析、修改、测试和发布列为禁止使用；当前 Codex 身份不能继续生成或提交补丁，未 Fork、未改代码、未建 PR。只有取得作者 Jeffrey Emanuel 明确书面许可后才能重新复核并推进，详见 `docs/ai/context/20260714-102948-destructive-command-guard-pr-blocked-plan.md`。
- 2026-09-06 待办合并（压缩时保留）：扫描器存在两个已知未修复缺陷——CLI 生成报告时 UTC 日期落前一日（date 覆盖偏移，报告日期可能偏移一天）、`--help` 未静默执行；二者在 2026-07-13 至 2026-07-22 多次「每日流水线运行」记录中反复出现，本次压缩移除那些运行日志时统一保留此待办，原文出处见归档文档 `docs/ai/context/20260906-104420-agents-md-compression_CN.md`。
