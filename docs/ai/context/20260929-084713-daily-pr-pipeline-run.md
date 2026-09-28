# 每日 GitHub PR 机会流水线运行（2026-09-29）

- 实际运行模型：Claude Opus 4.8（claude-opus-4-8）
- 运行日期：2026-09-29（JST）
- run id：`20260928233913-d5bc53`
- 当天日期报告：`public/reports/2026-09-29.json`
- lease：`2026-09-28T23:39:13.553Z-f77863`（close 已释放）

## 流程摘要

1. `pipeline status` = null，无未完成运行。
2. `npm run scan` 产出 `public/reports/2026-09-28.json`（扫描器 UTC 日期偏移已知缺陷）。扫描器 3 个 `值得继续`（affaan-m/ECC、n8n-io/n8n、yt-dlp/yt-dlp）经 live 复筛全部为死路：
   - n8n：CLA + issue-first 恒定门禁（历史已确认 blocker）→ 跳过。
   - yt-dlp：仓库根 `.NO_AI/README.md` 明确禁止 AI 生成贡献 → 跳过。
   - ECC（Everything Claude Code）：仓库欢迎贡献（MIT/CI/CONTRIBUTING），但候选切口 #3214 已在默认分支修复（`claude-scope-migration.js` 已移除 `--config`，闭合 PR #3215 有未决设计争议）；#3236 属安装流程中风险重构；仓库 100+ open PR 积压 + AI 门禁繁重 → 谨慎，本轮不取。
3. 扫描池退化，按既有回退方案用 `gh search issues` 独立发现：sktime/skpro issue #1135（good first issue/documentation，为各 estimator 补可运行 doctest 示例）。
4. 构建当天日期报告 `public/reports/2026-09-29.json`（含 2 个 skpro 独立候选=值得继续 + 扫描器结果降级留档），以该报告启动流水线。

## 本轮处理候选（2 个，均 pr_opened）

### 1. sktime/skpro — AUCalibration 示例（PR #1175）
- 分支：`docs/aucalibration-usage-example`，commit `067efa9c21f5974056c9edf6ad60ea69309d3491`
- 改动：`skpro/metrics/_aucc.py`（+16/-6），新增 numpydoc Examples 并移除 `test_class_has_doctest_example` 跳过标记
- PR：https://github.com/sktime/skpro/pull/1175
- 验证（本地实跑，main=8b9f225）：
  - `pytest -k "AUCalibration"` → 31 passed
  - `test_class_has_doctest_example[AUCalibration]` + `test_doctest_examples[AUCalibration]` 均 PASSED（doctest 实际执行）
  - `black --check` / `isort --check-only` / `flake8` 均通过；`git diff --check` 无空白错误

### 2. sktime/skpro — LinearizedLogLoss 示例（PR #1176）
- 分支：`docs/linearizedlogloss-usage-example`，commit `edce6f62fa5d149268118afeb180d08429c8eaec`
- 改动：`skpro/metrics/_logloss_linearized.py`（+16/-6），同上模式
- PR：https://github.com/sktime/skpro/pull/1176
- 验证（本地实跑，main=8b9f225）：
  - `pytest -k "LinearizedLogLoss"` → 31 passed
  - `test_class_has_doctest_example[LinearizedLogLoss]` + `test_doctest_examples[LinearizedLogLoss]` 均 PASSED
  - `black --check` / `isort --check-only` / `flake8` 均通过；`git diff --check` 无空白错误

示例统一采用维护者同族 PR（CRPS #1154 / LogLoss #1152）的 `load_diabetes` + `train_test_split(random_state=42)` + `NaiveProbaRegressor` 模板，只保留稳定 repr 输出（`NaiveProbaRegressor()`），把度量值赋给变量不打印，规避 numpy 版本 repr 漂移，doctest 跨版本稳健。

## CI 初始状态

两 PR 的 `docs/readthedocs.org:skpro` 构建 pending（docstring 变更的文档构建），完整 pytest 门禁将随后运行；本地已完整跑通目标 doctest，预期为绿。

## 结束动作

- `close` → 状态 completed，两候选均 pr_opened，lease 释放，生成 `data/pipeline/runs/20260928233913-d5bc53/summary.md`。
- `clean`（保留 3 天）→ 删除 1 个过期克隆目录，保留 3 个（含本轮 `sktime__skpro-20260929`）。

## 剩余队列

本轮报告仅 2 个 `值得继续`，均已 pr_opened，队列清空。扫描器候选池持续退化（AI 饱和 / star 失真 / NO_AI / CLA 门禁），独立发现（skpro #1135 系列）仍是可靠低风险 doctest PR 来源。
