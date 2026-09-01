# 2026-07-27 每日 GitHub PR 机会流水线计划

## 运行约束

- 自动化 ID：`github-pr`
- 主控仓库：`D:\CodeWorkSpace\github-pr-automation`
- 必须先恢复未完成运行；`npm run pipeline -- status` 返回 `null`，本轮创建新运行。
- 日期报告使用本地当天 `public/reports/2026-07-27.json`，不使用 `latest.json` 作为流水线交接文件。
- 每轮最多创建 `config/pipeline.json` 中的 `maxPrsPerRun=2` 个 PR；本轮至少创建 1 个 ready PR。
- 禁止自动 merge；禁止处理需要 CLA、维护者批准、账号授权、付费服务、外部密钥或高风险大改的事项。

## 扫描与 live 复筛结论

- 已调用现有扫描模块生成 `public/reports/2026-07-27.json` 和 `public/reports/latest.json`。
- `Snailclimb/JavaGuide`：历史 live preflight 已多轮确认，隐藏目录功能默认分支已实现，英文版属于维护策略决策，跳过。
- `ohmyzsh/ohmyzsh`：自动候选对应的近期 issue/方向过宽；可定位方向已有开放 PR 覆盖，例如 compaudit、nounset、git helper 等，跳过。
- `kakunin-ai/kakunin-mcp#7`：Issue 明确且文档范围小，但仓库 `CONTRIBUTING.md`/`CLA.md` 要求首次 PR 走 CLA check，按本轮约束跳过。
- `SRENIX-AI/agentic-sre#233`：Issue 请求集中列出 `SRENIX_PROBE_<NAME>`，默认分支 `docs/SETUP_GUIDE.md` 已包含对应集中表格，跳过以避免重复。
- `0xzr/freellmpool#52`：Issue 仍 open，维护者标注 `good first issue`/`docs`，开放 PR 未覆盖 summary badge recipe；仓库 MIT，无 CLA；验证路径明确为 `ruff check .` 与 `pytest tests/test_svg.py`。

## 执行方案

1. 将今天报告 live 复筛后的结论落盘：把不适合项标为 `跳过`，追加 `0xzr/freellmpool#52` 为唯一 `值得继续` 候选。
2. 用 `public/reports/2026-07-27.json` 启动流水线并保存 lease id。
3. 对 `freellmpool#52` 写入 preflight JSON，记录默认分支 SHA、Issue 状态、重复 PR 检查、贡献门禁和验证命令。
4. 在 `work/opportunity-pipeline` 下使用独立目录 clone 上游，读取目标仓库 `AGENTS.md`/`CONTRIBUTING.md`，创建单一用途分支。
5. 只修改 `README.md`，补充 `freellmpool badge --summary -o summary.svg` 和 proxy `/summary.svg` recipe；不改 SVG 渲染行为。
6. 运行目标验证、diff check，记录 publication intent，按 head 分支查重后推送 fork 并创建 ready PR。
7. close 流水线释放 lease，追加运行记录、更新项目记忆和 automation memory。
