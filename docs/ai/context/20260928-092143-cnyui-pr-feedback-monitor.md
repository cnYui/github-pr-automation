# cnYui PR 反馈巡检运行记录（2026-09-28 09:21 本地）

## 概览
- 认证：`gh auth status` 确认为 **cnYui**，token scopes 含 `repo`/`workflow`（有跨仓写权限）。
- 巡检范围：`gh search prs --author cnYui --state open` 共 **42 个 open PR**，全部三类反馈通道（issue 评论 / reviews / inline review 评论）逐一核验。
- 结论：**3 个 PR 有 cnYui 上次回复之后的新维护者反馈**（均为 `CHANGES_REQUESTED`），已全部自动修复 + 验证 + push + 回帖；其余 39 个无新人类反馈。

## 自动修复（高风险·默认处理，均已验证并推送）

### 1. sktime/skpro#1168 — [DOC] ConstraintViolation 用法示例
- 反馈：fkiraly（CHANGES_REQUESTED 2026-09-27）"Please remove doctest skips."
- 修复：`skpro/metrics/_constraint_violation.py` 中把带 `# doctest: +SKIP` 的示例行改为 `float(cv(y_true, y_pred))` → `0.3`（用 `float()` 包裹以规避 numpy 标量 repr 的版本差异），使示例真正作为 doctest 运行。
- 验证：`python -m pytest -o addopts="" --doctest-modules skpro/metrics/_constraint_violation.py` → **1 passed**（numpy 1.26.4 / py3.12）。
- 提交：`ab414247`（push 到 cnYui/skpro `docs/constraint-violation-doctest-example`；live head 已核验 = ab41424）。
- 回帖：https://github.com/sktime/skpro/pull/1168#issuecomment-5861187210
- 备注：临时 clone 未继承 SSH 签名配置，本次提交未签名；skpro 未要求签名 commit，非 blocker。

### 2. sktime/skpro#1148 — [DOC] OnlineRefit / OnlineRefitEveryN 用法示例
- 反馈：fkiraly（CHANGES_REQUESTED 2026-09-27T15:00，在 cnYui 01:56 回复之后）"The predictions should not be made on seen data in the base example, that would be training on the test set."
- 修复：`_refit.py` 与 `_refit_every.py` 的 docstring 示例改为三段互不相交的数据划分——先 `train_test_split(test_size=0.2)` 留出 `X_test`，再把余下拆成较大 fit 批 + 较小 update 批；`fit`→`update`→在从未参与训练的 `X_test` 上 `predict_proba`。保留 OnlineRefitEveryN 的 N=32 阈值演示（16 缓冲→计数 16，再 32→计数 0）。
- 验证：`python -m pytest -o addopts="" --doctest-modules skpro/regression/online/_refit.py skpro/regression/online/_refit_every.py` → **2 passed in 6.83s**。
- 提交：`527e883e`（push 到 cnYui/skpro `docs/1135-online-refit-doctest-examples`；live head 已核验 = 527e883）。
- 回帖：https://github.com/sktime/skpro/pull/1148#issuecomment-5861186175

### 3. pyro-ppl/numpyro#2288 — doc(gh-2187) SoftLaplace 数学文档
- 反馈：Qazalbash（CHANGES_REQUESTED 2026-09-27）4 条 inline（`numpyro/distributions/continuous.py`）。
- 修复：①密度公式按其 `suggestion` 在 `\cosh` 内加 `\displaystyle`；②log_prob 中 3 处 `\ln`→`\log`；③icdf 中 `\ln`→`\log`；④按 inline `diff_hunk`（id 4117360278）删除方差的冗余第二形式 `= \frac{\pi^2\sigma^2}{4}`，保留 `\mathrm{Var}[X]=\left(\frac{\pi\sigma}{2}\right)^2`。
- 验证：doc-only 无 doctest；`git diff` 核对（+4/-5，均为预期）+ `ast.parse` → PARSE OK。
- 提交：`4b62620`（push 到 cnYui/numpyro `doc/gh-2187-softlaplace`；live head 已核验 = 4b62620）。
- 回帖：https://github.com/pyro-ppl/numpyro/pull/2288#issuecomment-5861198594

## 无新反馈（无需动作）
- 已被 cnYui 回复覆盖的历史反馈：ECC#3013（chenhz01→cnYui 已答）、inside-deep-learning#22（PilotLeoYan→已答）、cua#1873（PreetamMatta→已答）、graphiti#1539（bonajoy→已答）。
- 仅 bot 活动 / 无评论：其余大多数 PR。
- stimela#614 已被 JSKenyon **APPROVED**（待维护者合并，无需动作）。
- graphiti#1539/#1568：CLA 失败为 6 月陈旧 check-run（已知，重签无效，跳过）。
- `CONFLICTING`（8 个，均旧 PR 且无维护者新请求，本次不做未经请求的 rebase）：palizade#8、OpenTihui#1、sub2api#3453、MiniMax-MCP#90、personal-knowledge#4/#5、SW#1/#2。

## 未合并 / 未关闭
- 本次全部 42 个 PR 状态均为 OPEN，无新合并/关闭。

## Blocker
- 无。三处修复所需的仅是代码/文档改动，均在权限内自动完成。
