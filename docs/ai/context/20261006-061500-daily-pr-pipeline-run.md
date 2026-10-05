# 每日 PR 流水线运行（2026-10-06）

- 实际运行模型：claude-sonnet-5-5（Sonnet 5.5）
- 当天日期报告：`public/reports/2026-10-06.json`
- run lease：`2026-10-05T21:07:22.558Z-f44712`

## 异常与冲突
- 已知扫描器缺陷再现：UTC 日期 10-05 覆盖了 `2026-10-05.json`；已用 `git show HEAD:` 还原，扫描结果改日期为 2026-10-06 另存（public/dist/latest 同步）。
- 扫描池再度退化：仅 ponytail、n8n、JavaGuide 标「值得继续」（均为记忆中的死路）→ 下调跳过；独立发现注入 numpyro #2187 的 InverseWishartCholesky。
- `github-run-pr-opportunity-pipeline` 未注册为 Skill，改读仓内 `skills/` 源文件执行。

## 候选与 preflight
- 默认分支 master `033f7e2e57bd0396fba8493ae246debe52f2c973`；#2187 OPEN；InverseWishartCholesky 无公式；全量 PR 搜索无重复（#2103、#368 均 merged）；Apache-2.0、无 CLA；我方 numpyro 既往 PR 全 merged，当前 0 个 open。

## 创建的 PR
- https://github.com/pyro-ppl/numpyro/pull/2326 （InverseWishartCholesky，commit `e4e66af660e58ccc3db21a0321e468bc7688000e`，SSH 签名）
- OPEN / MERGEABLE / 非 draft；CI 待跑。

## 真实验证
- jax/scipy 数值核对（p=3, ν=5.5，4 个随机点）：文档密度与实现 log_prob、scipy.stats.invwishart.logpdf+Jacobian 一致；20 万样本 E[X⁻¹]≈νΨ⁻¹（验证 Bartlett 采样）；ruff check/format 通过；`pytest -k InverseWishart` 364 passed/260 skipped。
- 未运行：完整 Sphinx 构建；docutils 仅因无 Sphinx 角色报 `:class:` 未知。

## 收尾
- next → empty；close 成功；clean 移除 3 个（保留 3）；status 为 null。
- 剩余：#2187 其余分布（Truncated*、LowerTruncatedPowerLaw、DoublyTruncatedPowerLaw、CirculantNormal 等）；#2326 仍 open，别堆积。
