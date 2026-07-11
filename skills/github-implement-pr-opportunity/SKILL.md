---
name: github-implement-pr-opportunity
description: 当用户授权 Codex 对 github-daily-pr-opportunity-scan 或 github-run-pr-opportunity-pipeline 中标记为「值得继续」的候选项目执行后续贡献时使用：完成 live preflight、克隆或 Fork 仓库、实现最小可验证修改、运行测试、提交并推送分支、创建 PR，并记录结果。不要用于扫描候选项目或自动合并 PR。
---

# GitHub PR 机会执行

## 授权边界

把用户对当前候选或当前流水线中 `值得继续` 项目的明确授权视为允许：

- clone 公开仓库
- 必要时 Fork
- 创建独立分支
- 修改代码或文档
- 安装合理的本地依赖
- 运行测试、检查和构建
- commit、push 和创建 PR
- 修复本次修改导致的 CI 失败

禁止自动 merge、签署法律协议、使用付费资源、处理未公开安全问题或扩大到候选范围之外。

## Live preflight

修改前必须重新核实：

1. 仓库仍在维护且未归档。
2. Issue 仍存在，或无 Issue 的文档缺口仍可复现。
3. 默认分支尚未包含修复。
4. 没有开放 PR 覆盖相同方向。
5. `AGENTS.md`、`CONTRIBUTING.md`、PR 模板和维护者说明允许该贡献方式。
6. 本地验证命令明确且可执行。
7. 实际范围仍是低风险最小切口。
8. 根据贡献指南、近期合并 PR 和周边文档确定上游沟通语言。
9. `gh auth status` 显示当前账号具备读取仓库、Fork 和创建 PR 所需权限。

出现重复 PR、默认分支已修、issue-first、维护者批准门禁、重型验证或范围膨胀时，标记为 `skipped` 或 `blocked`，不要写代码。

## 仓库准备

1. 在主控仓库的 `work/opportunity-pipeline` 下创建独立目录。
2. 不覆盖已有目录或未提交修改；目录不干净时换新目录。
3. 先 clone 上游并完成检查，确认可以提交后再 Fork。
4. 读取目标仓库全部适用规则。
5. 使用 `git switch -c` 创建单一用途分支。

## 实现

- 只修改完成当前切口必需的文件。
- 复用仓库现有模式，避免无关重构和格式化噪声。
- 不添加没有必要的依赖。
- 先建立能够证明问题的测试或验证，再实现修复。
- 内部计划记录留在主控仓库，不把 AI 内部文档加入上游 PR。

## 语言

内部状态和面向用户的总结使用中文。

以下内容遵循目标仓库的主要沟通语言和贡献规范：

- 代码注释
- 文档修改
- 分支名称
- commit message
- PR 标题与正文
- 上游评论

不能只根据 GitHub `primaryLanguage` 字段决定沟通语言。

## 验证

至少运行与改动直接相关的：

- 目标测试
- 格式或 lint 检查
- 类型检查
- 必要构建
- `git diff --check`

检查完整 diff、`git status`、临时文件、凭据、生成物和意外格式化。无法证明失败与本次修改无关时，不创建 PR。

## 提交 PR

进入提交阶段时使用 `manual-pr-flow`：

1. 精确 `git add`，不要默认 `git add .`。
2. 按目标仓库规范 commit。
3. 使用 `git push -u` 推送到用户 Fork。
4. 先使用 `gh pr list --head <owner>:<branch>` 查询该 head 是否已有 PR。
5. 已存在时复用并补录该 PR；确认不存在时才使用 `gh pr create` 创建 ready PR。
6. PR 正文写清问题、修改、验证和限制。
7. 使用 `gh pr view` 与 `gh pr checks` 核对远程 diff 和初始 CI。

不要创建占位 PR，不要声称运行过实际未运行的验证。

## 输出

记录：

- `owner/repo`
- 最终状态
- 本地目录与分支
- commit SHA
- PR 链接
- 实际验证命令和结果
- CI 状态
- 跳过或阻塞原因

永远不要自动 merge。
