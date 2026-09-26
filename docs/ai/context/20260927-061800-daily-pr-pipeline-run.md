# 每日 GitHub PR 机会流水线运行（2026-09-27）

- 实际运行模型：Claude Opus 4.8（claude-opus-4-8）
- 运行日期（JST）：2026-09-27；scanner UTC 落点：2026-09-26（已知 UTC 日期偏移缺陷，报告另存为当天日期）
- run id：`20260926211351-71fa83`
- lease/window id：`2026-09-26T21:13:51.286Z-d85ced`
- 当天日期报告：`public/reports/2026-09-27.json`（已同步 `dist/reports/2026-09-27.json`）

## 概要

- `npm run pipeline -- status` = null，无未完成运行，走全新扫描。
- 扫描器 `2026-09-26.json` 唯一 `值得继续` = yt-dlp/yt-dlp（测试补充）；live 复核确认其根目录含 `.NO_AI/`，明确拒绝 AI 生成贡献 → 贡献门禁 blocked，降级为「跳过」。其余 9 项均为文档缺口高风险死路（n8n/JavaGuide/ohmyzsh/dify/open-webui/ponytail 等）。
- 扫描池再次全退化（与既有记忆一致），改用独立发现：`gh` 枚举 sktime/skpro good-first-issue #1135「为缺 docstring 示例的对象补 numpydoc Examples」。
- 本地枚举（`skpro.registry.all_objects`）得 41 个无 `>>>` 示例对象；逐一排除 40 个开放 PR 覆盖项（#1140/#1155/#1152/#1154/#1157/#1158/#1146/#1148 等）与 issue 评论已认领项后，选定 `ConstraintViolation` 指标（无 PR、未认领、核心依赖即可验证）。

## 处理候选：1（sktime/skpro）

- PR：https://github.com/sktime/skpro/pull/1168
- 分支：`docs/constraint-violation-doctest-example`（head owner cnYui）
- 提交 SHA：`119728003e250d8271bb0a34337711c693d3f74c`
- 基线：sktime/skpro `main` @ `90a14f972f2937e22267f4bc89fadc71e70f80ee`
- 改动：为 `skpro/metrics/_constraint_violation.py` 的 `ConstraintViolation` 补 numpydoc `Examples`（含可执行 doctest），并移除 `tests:skip_by_name: ["test_class_has_doctest_example"]` 跳过标签。示例套用已被接受的兄弟指标 `EmpiricalCoverage`(PR #1155) 风格：`pred_interval` 形态 y_pred，标量 `np.float64` 输出用 `# doctest: +SKIP`，稳定的 `.to_numpy()` 输出直接校验。

### 实际执行并观察到的验证

- `pytest skpro/tests/test_all_estimators.py -k ConstraintViolation` → 31 passed。
- `test_class_has_doctest_example[ConstraintViolation]` PASSED；`test_doctest_examples[ConstraintViolation]` PASSED（此前被跳过）。
- `flake8 _constraint_violation.py` 干净（exit 0）；`isort --profile black` 干净。
- black 仅提示文件首行「模块 docstring 后加空行」这一与本次改动无关的既有项（新版 black 行为），本次不改动无关行；改动区块本身 black 合规。

## live preflight 结论

- 默认分支未修复：文件仍含跳过标签且无 `>>>`。
- 关联 Issue #1135 open（good first issue）。
- 无重复 PR（按 head 分支与关键词双查）。
- 贡献门禁：BSD-3-Clause，CONTRIBUTING 无 CLA。
- 通信语言：英文（上游内容用英文）。

## 阻塞/跳过项

- yt-dlp/yt-dlp：`.NO_AI/` 明确拒绝 AI 生成贡献，贡献门禁 blocked，跳过。
- n8n-io/n8n、Snailclimb/JavaGuide、DietrichGebert/ponytail、ohmyzsh/ohmyzsh、langgenius/dify、open-webui/open-webui、affaan-m/ECC、farion1231/cc-switch、Graphify-Labs/graphify：均为文档缺口高风险/已有相近 PR/贡献饱和死路，跳过。

## 剩余队列

- 本轮 `值得继续` 仅 1 项且已 pr_opened，`next` 返回 empty。maxPrsPerRun=2 未触顶但候选耗尽。
- close 释放租约成功（status=null），current run 全部终态已清除。
- `npm run pipeline -- clean` 回收 1 个超期克隆（pyro-ppl__numpyro-20260923），保留 4 个（含本轮 sktime__skpro-20260927）。
