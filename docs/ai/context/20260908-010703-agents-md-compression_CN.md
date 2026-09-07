# AGENTS.md 压缩归档（2026-09-08）

- 压缩时间：2026-09-08 01:07:03 +09:00
- 压缩前：22 行，5161 字节
- 压缩后：20 行，4183 字节
- 移除条目：2 条（均为一次性迁移/同步操作日志，且条目内已引用对应 `docs/ai/context/*.md` 记录文档；其持久事实已在保留条目中重复表述）
- 并入保留章节的事实：无

## 一、被移除条目（原文完整照抄）

### 1. 2026-07-11 主控仓库迁移完成

> - 2026-07-11 主控仓库迁移完成：GitHub 仓库为 `cnYui/github-pr-automation`，本地主路径为 `D:\CodeWorkSpace\github-pr-automation`；`work/`、`data/` 和本地依赖已完整迁入，现有 `cnyui-pr` 自动化也已保持原频率并改绑新路径。旧路径仅因 Codex 进程监听空 `.codex` 目录而暂时保留，重启 Codex 后可删除，不再作为主控仓使用。详见 `docs/ai/context/20260711-210903-github-pr-automation-repository-migration-record.md`。

**命中判据：** 一次性的迁移记录，条目内已引用对应记录文档 `docs/ai/context/20260711-210903-github-pr-automation-repository-migration-record.md`。其中的持久事实——仓库标识 `cnYui/github-pr-automation`、本地主路径、`work/`/`data/` 不入 Git——已分别在保留条目「2026-07-11 主控仓库方向」（改名为 `github-pr-automation`）、「2026-07-11 持久化边界」（`work/` 与 `data/` 不进入 Git）、以及保留条目「2026-07-14 主控仓同步边界」中已确认的 `origin` 结构里重复表述；本地主路径本身也是每个会话的工作目录环境值。条目末尾关于「旧路径暂时保留、重启 Codex 后可删除」为已过期的过渡性说明，无警示价值。

### 2. 2026-07-14 主控仓同步边界

> - 2026-07-14 主控仓同步边界：本轮处理根仓库 `git status` 中全部报告、上下文文档和项目记忆；继续排除 `.gitignore` 管理的 `work/`、`data/`、依赖、环境文件和运行缓存。远端 `cnYui/github-pr-automation` 已存在且 `origin` 配置正确，不重复创建，直接验证后同步 `main`。设计与计划见 `docs/ai/context/20260714-093703-workspace-sync-design.md` 和 `docs/ai/context/20260714-093703-workspace-sync-plan.md`。

**命中判据：** 一次性的同步操作日志，条目内已引用对应设计/计划文档 `docs/ai/context/20260714-093703-workspace-sync-design.md` 与 `docs/ai/context/20260714-093703-workspace-sync-plan.md`。其中仍生效的边界——排除 `.gitignore` 管理的 `work/`、`data/` 等——已在保留条目「2026-07-11 持久化边界」（`work/` 与 `data/` 不进入 Git，公开报告和上下文文档继续版本管理）中确立；「远端已存在、`origin` 配置正确、不重复创建」为本轮一次性操作说明。

## 二、本次刻意保留的内容

以下条目虽写法像历史记录，但确立的是至今仍照做的规则、边界、架构决策或未完成待办，或属于踩过的坑/教训，一律保留：

- 整节 `## GitHub 每日 PR 机会展示页`（含页面/自动化/数据口径/贡献范围/推荐门槛/Skill 方向/实现计划全部条目）——当前展示页与扫描流程的边界定义。
- 文件最开头标题 `# 项目记忆`。
- 2026-06-07 失败 PR 根因复查：确立「CLA 未签 / Vercel 授权阻塞类失败 PR 不应通过改代码或空提交重提解决」这一至今生效的教训（坑）。
- 2026-07-11 候选实施复核修正：确立「后续机会扫描必须同时检查默认分支实现状态，不能只看 issue/PR 状态」这一反直觉教训（上游可能已直接提交修复）。
- 2026-07-11 主控仓库方向：仓库改名为 `github-pr-automation`，保留扫描/执行/编排三个独立 Skill 由一个 cron 串联，`skills/` 为唯一源码——架构决策。
- 2026-07-11 自动执行授权：`值得继续` 进 live preflight，复核通过后允许 clone/fork/改/验证/commit/push/建 PR，禁止自动 merge；内部记录中文、上游遵循目标仓库语言——仍生效的边界规则。
- 2026-07-11 持久化边界：不可变候选快照、lease、current run、ledger 支持并发保护/失败恢复/跨日去重；`work/` 与 `data/` 不入 Git——持久化设计。
- 2026-07-11 GitHub 工具边界：`gh` 负责认证与远程操作，本地修改/测试/分支/commit/push 用 git 与项目工具链，始终禁止自动 merge——工具边界规则。
- 2026-07-14 `destructive_command_guard` PR 阻塞：该仓 LICENSE rider 排除 OpenAI/Anthropic 及其代理并禁止分析/修改/测试/发布，未取得作者书面许可前不得推进——坑/blocker，防止重复尝试被禁止的 PR。
- 2026-09-06 待办合并：扫描器两个已知未修复缺陷（CLI 生成报告 UTC 日期偏移一天、`--help` 未静默执行）——未完成待办。

（本仓库为公开仓：本次被移除条目原文中不含密钥/内网主机/桶名/Tunnel ID 等敏感值，路径 `D:\CodeWorkSpace\github-pr-automation` 为仓库既有公开信息，故照抄不做占位替换。）
