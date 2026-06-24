# GitHub Daily PR Opportunity Scan Skill 实现记录

## 范围

本轮完成了两部分：

- 当前仓扫描器改造：默认搜索入口从泛热度改成更偏可贡献候选池，并把“本地难以验证的重型项目”降级或跳过。
- 本机 Skill 安装：在 `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan` 创建并填充可用 Skill、reference 和候选发现脚本。

## 本机 Skill 安装路径

- `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\SKILL.md`
- `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\agents\openai.yaml`
- `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\references\search-queries.md`
- `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\references\scoring-rubric.md`
- `C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\scripts\find_candidates.py`

## 仓内改动

- `src/scanner/search-templates.ts`
- `src/scanner/search-templates.test.ts`
- `src/scanner/candidates.ts`
- `src/scanner/candidates.test.ts`
- `src/scanner/github-client.ts`
- `src/scanner/scan-runner.ts`
- `src/scanner/repository-signals.ts`
- `src/scanner/repository-signals.test.ts`
- `tests/skill/github-daily-pr-opportunity-scan.md`

## 已通过验证

- `npm test -- src/scanner/search-templates.test.ts src/scanner/candidates.test.ts`
- `npm test -- src/scanner/repository-signals.test.ts`
- `npm test -- src/scanner/search-templates.test.ts src/scanner/candidates.test.ts src/scanner/repository-signals.test.ts`
- `npm test -- src/scanner/scan-runner.test.ts src/scanner/report-builder.test.ts src/shared/report-schema.test.ts src/web/report-view.test.ts`
- `python C:\Users\yui\.codex\skills\.system\skill-creator\scripts\quick_validate.py C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan`
- `python -m py_compile C:\Users\yui\.codex\skills\github-daily-pr-opportunity-scan\scripts\find_candidates.py`

## 真实调用结果

- 直接运行 Skill 脚本时，当前环境没有显式 `GITHUB_TOKEN`，脚本按预期明确报错 `缺少 GITHUB_TOKEN`。
- 复用本机现有 `gh` 登录态后，`find_candidates.py --limit 5 --format json` 成功返回候选列表。
- 复用同一临时 token 后，`npm run scan` 成功执行。
- `parseReport(public/reports/latest.json)` 输出 `10`，说明新报告通过现有 schema。

## Git 与工作树说明

- 实现分支：`codex/github-project-discovery-skill`
- 本轮已创建提交：
  - `f06a9d8 feat: narrow scanner queries to actionable repos`
  - `df247c4 feat: penalize repos that are hard to verify locally`
  - `8bd2e2e test: refresh github project discovery skill scenarios`
- `public/reports/latest.json`、`public/reports/2026-06-24.json` 和 `data/` 在验证时被刷新或生成。
- 但本仓在开始前就已有未提交的 `public/reports/latest.json` / `dist/reports/latest.json` 等历史工作树改动，因此本轮没有擅自把这些报告产物一起收进提交。

## 后续注意

- 新 Skill 要被后续会话自动发现，通常需要重启 Codex。
- 当前本机 Skill 已可用，但它依赖 GitHub 访问能力；如果环境里没有 `GITHUB_TOKEN`，需要显式注入，或像本轮一样临时复用 `gh auth token`。
