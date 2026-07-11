# mcp-context-forge #5185 review follow-up plan

## 背景

- 自动化巡检 `author:cnYui is:pr is:open` 发现 `IBM/mcp-context-forge#5185` 在上次运行后有新维护者反馈。
- 新反馈包含两项：
  - issue comment：运行 `pre-commit` 并提交更新后的 secrets 文件。
  - review thread：导航已经从 `bee.md` 改到 `beeai.md`，需要删除旧 `bee.md`。

## 处理边界

- 只处理 PR #5185 现有分支 `cnYui:codex/docs-beeai-integration`。
- 不改主控仓应用代码。
- 不扩大 BeeAI 文档内容范围，只按 review 删除旧页面并提交工具生成的基线文件。

## 执行计划

1. 在干净的 `work/mcp-context-forge-22` 中同步 PR 分支。
2. 删除 `docs/docs/using/agents/bee.md`。
3. 运行仓库 pre-commit，确认是否生成或更新 secrets baseline。
4. 运行 touched-file 文档检查和 `git diff --check`。
5. 提交并推送到现有 PR 分支。
6. 在 PR 中简短回复已处理项和实际验证命令。

## 风险

- pre-commit 可能需要仓库依赖或网络；若本地无法完整运行，需要记录具体失败并只提交可验证结果。
- secrets baseline 属于工具生成文件，必须由仓库 hook 产生，不能手写猜测。
