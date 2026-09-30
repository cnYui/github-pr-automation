# 每日 PR 流水线运行（2026-10-01）

- 实际运行模型：claude-opus-4-8（Opus 4.8）
- 当天日期报告：`public/reports/2026-10-01.json`
- run id：`20260930235121-079634`（lease/window `2026-09-30T23:51:21.051Z-73f98a`）

## 扫描与复筛

- `npm run pipeline -- status` 返回 `null`，无未完成运行，正常新建。
- `npm run scan` 刷新候选。受已知 UTC 日期偏移 bug 影响，扫描器写入 `public/reports/2026-09-30.json`；已复制并改写为当天日期报告 `2026-10-01.json`（并同步 `latest.json` 与 `dist/reports`）。
- 扫描池延续退化：10 个自动候选中 9 个 `跳过`，唯一 `值得继续` 为 `Snailclimb/JavaGuide`——15.9w star 中文面试文档库，扫描器「测试补充」为误判（无真实测试套件），社区饱和、无可本地验证的低风险切口，live 判定下调为 `跳过`。
- 按记忆 `scanner-pool-degenerate-fallback` 采用独立发现：`gh search issues` 的 good-first-issue 结果多为微型/一次性仓，价值低、风险高；回到经验证可靠的 sktime/skpro docstring umbrella #1135。

## 本轮处理

- 处理候选数：1（独立发现注入的 sktime/skpro SPLL docstring 示例）。
- skpro 现有 open docstring PR 已较多，为避免重复：用 umbrella 配方（`all_objects` + 检测 `>>>`）列出 41 个缺示例对象，逐一比对 open PR 认领情况，仅 `SPLL`（生存分析概率指标）未被认领且仅依赖 numpy/pandas/skpro 核心，可纯本地 doctest 验证。

## live preflight（逐项）

- 默认分支 HEAD `8b9f2256` 的 `_spll.py` 类 docstring 仍无 `>>>`，`_tags` 仍含 `tests:skip_by_name:["test_class_has_doctest_example"]`（未在默认分支修复）。
- open PR 搜索（`SPLL in:title` 与全文 `SPLL`）均为空，无重复 PR。
- 贡献门禁：BSD-3、umbrella 公开征集、无 CLA/账号/付费门禁；cnYui 已有 sktime/skpro fork。
- 默认分支 `main`，base 确认。

## 实施与验证（真实执行）

- 克隆 `sktime/skpro`@`8b9f2256` → 分支 `doc/spll-docstring-example`。
- 改动：`skpro/metrics/survival/_spll.py`，新增 numpydoc `Examples`（含 `C_true` censoring 用法、聚合分数与 `evaluate_by_index`），移除 `test_class_has_doctest_example` 跳过标记（+17/-3）。示例数值由本地实际运行捕获；聚合标量因浮点 repr 跨平台差异标 `# doctest: +SKIP`，`evaluate_by_index(...).to_numpy()` 行做真实断言。
- `pytest --doctest-modules skpro/metrics/survival/_spll.py -o addopts=""` → **1 passed**。
- `pytest -k "doctest_example and SPLL" -o addopts=""` → **2 passed**（移除 skip 后 `test_class_has_doctest_example` 对 SPLL 两组参数均生效并通过）。
- commit `f1670081ce558a26187a4bdfe1db6a5871371696`（本机 SSH 签名在该 fork clone 未生效，显示未签名；skpro 无 signed-commit 门禁，可接受）。

## 创建的 PR

- sktime/skpro#1182：`[DOC] add usage example to SPLL survival metric docstring`
  - 链接：https://github.com/sktime/skpro/pull/1182
  - commit：`f1670081ce558a26187a4bdfe1db6a5871371696`
  - 状态：OPEN / MERGEABLE，CI `docs/readthedocs.org:skpro` PENDING。

## 阻塞 / 跳过

- JavaGuide：误判 + 饱和，`跳过`（见上）。
- 其余 9 个自动候选（ECC、n8n、yt-dlp、ohmyzsh、dify、open-webui、ponytail、cc-switch、graphify）扫描器本就 `跳过`；n8n/ponytail 亦为记忆中的恒定 blocker/饱和仓。

## 收尾

- `close` 释放租约、生成 summary（completed）。
- `clean` 按 3 天保留清理 `work/opportunity-pipeline`，移除 `pyro-ppl__numpyro-20260928`（保留 4 个，含本轮 skpro clone）。

## 剩余队列

- 本轮候选队列已全部进入终态（1 个 pr_opened），current run 已清除，无待恢复项。
