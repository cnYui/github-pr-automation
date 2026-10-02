# 每日 PR 流水线运行（2026-10-03）

- 实际运行模型：claude-sonnet-5-5（Sonnet 5.5）
- 当天日期报告：`public/reports/2026-10-03.json`
- run id：`20261002210455-425eca`（lease `2026-10-02T21:04:55.135Z-79397f`）

## 异常与冲突
- 已知扫描器缺陷再现：`npm run scan` 用 UTC 日期，本地 2026-10-03 06:03（UTC 10-02）落成 `2026-10-02.json` 覆盖了昨日报告；已先备份、把扫描结果改日期为 2026-10-03 另存，并用备份还原 `2026-10-02.json`（public 与 dist 一致）。
- 扫描池再度退化：仅 n8n、JavaGuide 标「值得继续」，均为记忆中的恒定死路 → 下调为跳过；独立发现注入 numpyro #2187 两个候选。

## 候选与 preflight
- 默认分支 master `cefcb3e9e313350de83080123dbd962208d88b6e`；#2187 OPEN；RelaxedBernoulli*/LowRankMultivariateNormal 无 docstring；全部 PR 搜索无重复；开放 PR #2314（MatrixNormal，hunk 2876）不重叠；Apache-2.0、无 CLA；Levy 经核对已有文档故不选。

## 创建的 PR
- https://github.com/pyro-ppl/numpyro/pull/2315 （RelaxedBernoulli，commit `f197e27150b4ea1fd953579a95b55b7b4993b99f`）
- https://github.com/pyro-ppl/numpyro/pull/2316 （LowRankMultivariateNormal，commit `7d37ec1bb90e40a2e8d6f15e08d97972aab20db6`）
- 均 OPEN / MERGEABLE / 非 draft，SSH 签名提交；CI 待跑。

## 真实验证
- jax(CPU) 数值核对：Relaxed 密度（3 温度×3 logits 网格）、probs/logits 等价、采样构造、零温极限、ValueError；LowRank 的 log_prob 对 scipy、行列式引理、Woodbury 逆、协方差/方差/均值、40 万样本经验协方差。
- docutils 解析 0 警告；ruff check/format、py_compile、git diff --check 通过；pytest -k RelaxedBernoulli 60 passed/44 skipped；-k LowRankMultivariateNormal 74 passed/31 skipped。
- 未运行：完整 Sphinx 构建、make doctest、ty check。

## 发现（未处理）
- 上游既有缺陷：`LowRankMultivariateNormal.precision_matrix` 在 d≠m 时抛 `ValueError`（`solve_triangular(Wt_Dinv, capacitance_tril)` 参数形状不一致）。非文档范围，未改、未提 issue，docstring 也未声称该属性。

## 收尾
- next → limit_reached；close 成功；clean 移除 0 个（保留 6）；status 为 null。
