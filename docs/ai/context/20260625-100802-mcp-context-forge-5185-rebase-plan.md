# mcp-context-forge PR #5185 rebase follow-up plan

## 背景

- 用户提供的邮件对应 `IBM/mcp-context-forge#5185`。
- 6 月 12 日关于删除旧 `bee.md` 和更新 `.secrets.baseline` 的反馈已在历史评论中处理。
- 6 月 24 日维护者要求同步 fork 并 rebase；当前 GitHub 仍显示 PR `mergeable=CONFLICTING`、`mergeStateStatus=DIRTY`，说明还需要重新同步最新 `origin/main`。

## 目标

- 让 PR 分支重新基于最新 `IBM/mcp-context-forge/main`。
- 保留 BeeAI 文档改动和 `.secrets.baseline` 中对示例 `MCP_AUTH` 的 false positive 审计。
- 本地验证 `.secrets.baseline` JSON、detect-secrets 目标 hook、diff whitespace；能运行 `make pre-commit` 时运行并记录结果。
- 用 `--force-with-lease` 推送 `cnYui:codex/docs-beeai-integration`，并在 PR 留下简短技术回复。

## 执行计划

1. 在 `work/mcp-context-forge-22` 检查工作树和远端，确认不覆盖未提交用户改动。
2. `git fetch origin main` 和 `git fetch fork codex/docs-beeai-integration`。
3. 将本地分支重放到最新 `origin/main`；如 `.secrets.baseline` 冲突，保留主线最新 baseline 后重新运行 detect-secrets 生成和审计。
4. 复查 `docs/docs/using/agents/.pages`、`beeai.md`、`index.md`、`.secrets.baseline` 的最终 diff。
5. 运行：
   - `python -m json.tool .secrets.baseline`
   - detect-secrets target hook with repository pinned command where available
   - `git diff --check origin/main...HEAD`
   - `make pre-commit`，若本机环境失败则记录失败点并尽量跑目标 hook
6. 生成 signed commit，推送到 fork 分支。
7. 回读 PR 状态和 DCO，回复维护者当前验证结果。

## 风险

- `make pre-commit` 可能在 Windows 上因 Python app alias、Shell 工具或全仓历史问题失败；这种情况需要明确区分环境失败和 PR 变更失败。
- `.secrets.baseline` 冲突必须以仓库当前 baseline 为基础重新审计，不能只手工拼接旧文件。
