# GitHub PR 自动化仓库迁移完成记录

## 完成结果

- 已将本地 `main` 的 8 个待推送提交同步到 GitHub。
- GitHub 仓库已从 `cnYui/github-10-pr-pr-5-pr` 改名为 `cnYui/github-pr-automation`。
- 本地主控仓路径已切换为 `D:\CodeWorkSpace\github-pr-automation`。
- `origin` 已更新为 `https://github.com/cnYui/github-pr-automation.git`。
- `work/`、`data/` 和 `node_modules/` 已从旧路径原样迁入新路径；候选仓库中的未提交改动没有被覆盖、删除或加入主控仓 Git。
- 已合并的本地分支 `codex/github-project-discovery-skill` 已删除。

## Git 清理结果

- 改名前工作区干净，`main` 相对旧远程仅超前 8 个已提交记录，没有遗漏的已修改或未跟踪文件。
- 历史上下文、日期报告、三个 Skill 和流水线源码均已纳入版本管理。
- `work/`、`data/`、`node_modules/`、Python 缓存和本地日志继续由 `.gitignore` 排除。
- 新主控仓当前只跟踪应进入远程的源码、报告、文档和 Skill；运行态与候选仓库不进入 Git。
- 旧路径中的两个 Vite 日志和 Python `__pycache__` 已删除。

## 自动化绑定

- 现有自动化 `cnyui-pr` 已通过 Codex 自动化接口更新。
- 名称、提示词、状态、模型和每 12 小时整点执行的频率保持不变。
- `projectId` 与工作目录均已改为 `D:\CodeWorkSpace\github-pr-automation`。
- GitHub PR 机会扫描与实施流水线的新 cron 尚未创建，仍需用户确定具体执行时间。

## GitHub 工具边界

- `gh` 负责 GitHub 认证、仓库改名、Fork、PR、Review、评论和 checks 等平台侧操作。
- `git` 负责本地分支、暂存、提交、合并和推送。
- Codex 与目标仓库工具链负责代码修改、格式化、类型检查、测试和构建。
- 流水线允许自动创建 PR，但始终禁止自动 merge。

## 路径迁移说明

直接重命名旧目录时，Codex 主进程仍持有旧路径空 `.codex` 目录的监听句柄。为避免强制关闭 Codex 句柄导致当前应用不稳定，本次采用以下无数据损失迁移方式：

1. 从已改名且已同步的 GitHub 仓库检出新主控仓。
2. 校验新旧仓 `HEAD` 均为 `ccfebdc`。
3. 将 `work/`、`data/` 和 `node_modules/` 在同一磁盘内原样移动到新路径。
4. 通过官方 Codex 工作区深链注册新项目，并更新自动化绑定。

旧路径 `D:\CodeWorkSpace\github-10-pr-pr-5-pr` 不再包含唯一运行态数据，也不再作为自动化工作目录。关闭或重启 Codex 释放监听句柄后，可以删除该残留目录。

## Codex 工具环境

- 使用官方 `codex://threads/new?path=...` 深链将新路径注册为 Codex 项目。
- 为核对当前 Codex 项目与自动化行为，已增加官方 `openaiDeveloperDocs` MCP 配置；当前应用重启后会加载该文档源，不影响仓库运行。

## 验证

- `npm test`：12 个测试文件、34 项测试通过。
- `npm run typecheck`：通过。
- `npm run build`：通过。
- 迁移主体代码基线与远程 `main` 在记录提交前均为 `ccfebdc`。
- 新主控仓工作区干净，`origin` 指向新仓库。
- `cnyui-pr` 的 TOML 已落盘为新 `projectId` 和新工作目录。
