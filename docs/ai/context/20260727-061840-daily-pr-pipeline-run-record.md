# 2026-07-27 每日 GitHub PR 机会流水线运行记录

## 运行结果

- 自动化：`github-pr`（每日 GitHub PR 机会流水线）
- 本地时间：2026-07-27 06:18 JST
- 日期报告：`public/reports/2026-07-27.json`
- 同步报告：`public/reports/latest.json`、`dist/reports/2026-07-27.json`、`dist/reports/latest.json`
- Run id：`20260726210948-9d57df`
- Lease id：`2026-07-26T21:09:48.045Z-bb5f29`
- 最终状态：`completed`
- 剩余队列：0

## 扫描与复筛

- `npm run pipeline -- status` 初始返回 `null`，没有未完成运行。
- 当前东京日期是 2026-07-27，但 UTC 仍是 2026-07-26；为避免扫描 CLI 的 UTC 日期落前一日问题，本轮直接调用现有 `runScan()` 写入本地当天报告。
- 自动报告中的 `ohmyzsh/ohmyzsh` 经 live 复筛跳过：可定位方向已有开放 PR 覆盖或问题过宽，无法建立低风险本地验证。
- 自动报告中的 `Snailclimb/JavaGuide` 经历史与本轮 live 复筛跳过：#2768 默认分支已实现，#2752 属维护策略决策。
- 额外复筛 `kakunin-ai/kakunin-mcp#7`，因首个 PR 要走 CLA check，按本轮约束跳过。
- 额外复筛 `SRENIX-AI/agentic-sre#233`，默认分支已在 `docs/SETUP_GUIDE.md` 包含集中 probe env var 表，按“默认分支已修”跳过。
- 本轮落盘唯一 `值得继续` 候选为 `0xzr/freellmpool#52`。

## 已创建 PR

- 仓库：`0xzr/freellmpool`
- Issue：`https://github.com/0xzr/freellmpool/issues/52`
- PR：`https://github.com/0xzr/freellmpool/pull/83`
- 分支：`cnYui:codex/docs-summary-badge-recipe`
- Commit：`0f1232b9df7df575c12d7bdda804d3ab7c9e9439`
- 改动：在 README 中补充 `freellmpool badge --summary -o summary.svg` 示例，说明 `FREELLMPOOL_PUBLIC_BADGE=1` 时 proxy 可公开 `/summary.svg`，并把 `/summary.svg` 加入 operations surface 列表。
- 远端状态：PR open、mergeable；`Sourcery review` 已通过。

## 实际验证

- `.venv\Scripts\ruff.exe check .`：通过，`All checks passed!`
- `.venv\Scripts\pytest.exe tests/test_svg.py`：通过，`6 passed`
- `git diff --check HEAD^ HEAD`：通过，无输出
- `gh pr view 83 --repo 0xzr/freellmpool`：确认 base `main`、head `cnYui:codex/docs-summary-badge-recipe`、commit `0f1232b9df7df575c12d7bdda804d3ab7c9e9439`
- `npm run pipeline -- close --lease ...`：运行完成并释放 lease
- `npm run pipeline -- status`：close 后返回 `null`
- 主控仓库 `npm run typecheck`：通过
- 主控仓库 `npm test`：通过，12 个测试文件、34 项测试全部通过
- 主控仓库 `npm run build`：通过
- 主控仓库报告 SHA：`public/reports/2026-07-27.json`、`dist/reports/2026-07-27.json`、`public/reports/latest.json`、`dist/reports/latest.json` 一致

## 注意事项

- 目标仓库 `.venv/` 在其 `.gitignore` 中，未进入提交。
- 主控仓库 `work/` 与 `data/` 仍按既有 `.gitignore` 排除，流水线状态只用于本地恢复。
- 主控仓库存在多天历史未提交报告和上下文文件，本轮未清理或回退这些历史改动。
