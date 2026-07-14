# 主控仓库工作区同步计划

## 步骤

1. 获取 `git status`、完整差异、未跟踪文件、忽略规则、远端配置和 `gh` 认证状态。
2. 确认 `cnYui/github-pr-automation` 是否存在；存在时复用并校验 `origin`，不存在时才创建私有仓库。
3. 检查未跟踪文件大小、Markdown 标题、JSON 可解析性、公开与构建日报一致性、敏感信息和空文件。
4. 新增设计、计划与执行记录，并更新 `AGENTS.md` 项目记忆。
5. 运行：
   - `npm test`
   - `npm run typecheck`
   - `npm run build`
   - `git diff --check`
6. 暂存根工作区全部应纳入版本控制的改动，复核 `git diff --cached --stat` 和暂存文件列表。
7. 提交并推送 `main` 到 `origin`。
8. 使用 `gh repo view`、`git rev-parse`、`git rev-list` 和 `git status` 确认本地与远端完全一致。

## 完成标准

- 根仓库工作区无未提交或未跟踪文件。
- 全量测试、类型检查、构建和差异检查通过。
- `main` 与 `origin/main` 指向同一提交。
- 远端仓库归属 `cnYui`，默认分支为 `main`。
- 忽略目录和本地敏感配置未被纳入提交。
