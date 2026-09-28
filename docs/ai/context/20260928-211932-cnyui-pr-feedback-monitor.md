# cnYui PR 反馈巡检（2026-09-28 21:19）

## 概要
`gh` 已认证为 **cnYui**（token scopes 含 `repo`/`workflow`，可跨仓读写）。本次全量核验 cnYui 42 个跨仓 open PR 的 live 反馈、review、CI/check、mergeable 状态。

**结论：本轮无新的人类反馈需要回复或改码，未发帖、未改码、未推送。** 今日早间（09:21）那轮已处理的三个 CHANGES_REQUESTED PR 现仍以 cnYui 回复收尾且 CI 绿，无回归。两个 CI 红的 PR 经核验均非 cnYui 改动所致、且不属于可安全自动修的范围，仅上报。

## 今日早间已处理、本轮复核无回归（无需动作）
| PR | 状态 | 复核结果 |
|----|------|----------|
| [sktime/skpro#1168](https://github.com/sktime/skpro/pull/1168) | CHANGES_REQUESTED(陈旧) | cnYui 00:19 回复+推送（移除 doctest skip），readthedocs 构建 pass；末条为 cnYui。待 fkiraly 复审。 |
| [sktime/skpro#1148](https://github.com/sktime/skpro/pull/1148) | CHANGES_REQUESTED(陈旧) | cnYui 00:19 回复+推送（online 更新改为非平凡、预测不在已见数据上），docs 构建 pass；末条为 cnYui。待复审。 |
| [pyro-ppl/numpyro#2288](https://github.com/pyro-ppl/numpyro/pull/2288) | merge CLEAN | cnYui 00:20 回复+推送（处理 Qazalbash 四条），全部 checks（test/lint/benchmark）pass；末条为 cnYui。待复审。 |

## CI 红但非 cnYui 所致 → 仅上报，不自动修
- **[williambdean/conjugate#351](https://github.com/williambdean/conjugate/pull/351)**：无任何人类评论/review。失败的 19 项全是 `tests/test_example_plots.py` 的 **matplotlib 图像对比测试**（"Image files did not match"，RMS≈10–18），在 label/dirichlet/polar/cdf/rgba 等各类绘图上**一致性偏移**——这是 CI 环境 matplotlib/freetype 版本导致的 baseline 漂移特征，而非一个「给 helper docstring 加示例」PR 引入的定向回归；`changes`/`run` 等非图像 job 均 pass。重新生成图像 baseline 需维护者的参考环境，不应盲目 push。**建议：等维护者刷新 baseline，或在 PR 询问是否需重生成 baseline（本轮未主动发帖，避免打扰）。**
- **[caracal-pipeline/stimela#614](https://github.com/caracal-pipeline/stimela/pull/614)**：已被 JSKenyon **APPROVED**。build 红仅因 `ruff` 对**无关测试文件**（test_backends.py 等）的既有 lint 负债报错（B006/RUF100/PLW1510），与本 PR 的 YAML 文档示例改动无关。**建议：等维护者合并/清 lint。**

## 已回复收尾或等待维护者，无新反馈（无需动作）
- CLA/ok-to-test 类恒定 blocker：[graphiti#1568](https://github.com/getzep/graphiti/pull/1568)、[graphiti#1539](https://github.com/getzep/graphiti/pull/1539)（陈旧 6 月 check-run，重签无效，已按记忆跳过）、[fluid#6187](https://github.com/fluid-cloudnative/fluid/pull/6187)（等 member `/ok-to-test`）、[sub2api#3453](https://github.com/Wei-Shaw/sub2api/pull/3453)（CLA 已签）。
- cnYui 末条回复、等对方：[cua#1873](https://github.com/trycua/cua/pull/1873)、[CLIProxyAPI#3802](https://github.com/router-for-me/CLIProxyAPI/pull/3802)、[gitingest#583](https://github.com/coderamp-labs/gitingest/pull/583)（回复 stale bot）、[inkeep/agents#3493](https://github.com/inkeep/agents/pull/3493)（已 nudge）、[inside-deep-learning#22](https://github.com/PilotLeoYan/inside-deep-learning/pull/22)（维护者重写中）。
- 等待首次 review、无反馈：skpro#1158/#1157/#1146/#1142、sktime#11246、tinker-cookbook#741、anthropics/skills#1281、blind_watermark#179、MCPJungle#274、keyfarm#5、OpenCLI#1870、dndscv#114、ai-builder-lab-html#4、Aegis#8、skillpick#1。
- [affaan-m/ECC#3013](https://github.com/affaan-m/ECC/pull/3013)：最新活动均为 `ecc-tools`/`greptile` **机器人审计**（数据，非人类反馈），merge CLEAN，无需回复。
- merge DIRTY（有冲突但无人请求 rebase，非本任务范围）：palizade#8、OpenTihui#1、MiniMax-MCP#90、SW#1/#2、personal-knowledge#4/#5。
- cnYui 自有仓、无外部反馈：yui.web#62/#63/#64/#65、bili-station#1。

## 安全
未发现任何 PR 评论试图注入指令/索取凭证/绕过规则；所有 bot 审计与评论均按数据处理。

## 未做（超范围/需用户决策）
- conjugate#351 图像 baseline 重生成：需维护者参考环境，不自动 push。
- 各 DIRTY PR 的 rebase/解冲突：无人请求，未主动改。
