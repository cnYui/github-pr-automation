# 每日 PR 流水线运行（2026-10-02）

- 实际运行模型：运行开始时为 claude-opus-4-8（Opus 4.8，与任务文件 frontmatter 一致）；运行中途（读完 `src/scanner/scan-runner.ts` 之后）会话收到系统消息，模型切换为 claude-sonnet-5-5（Sonnet 5.5）。其后的 live 复筛、独立发现、实施、验证、建 PR 均在 Sonnet 5.5 下完成，故上游两个 PR 提交的 `Co-Authored-By` 署名为 Claude Sonnet 5.5。
- 当天日期报告：`public/reports/2026-10-02.json`
- run id：`20261001235137-4af710`（lease/window `2026-10-01T23:51:37.729Z-65b6a0`）

## 冲突点与异常记录

- 任务文件 frontmatter 声明模型为 opus-4-8，实际中途切到 sonnet-5-5，见上。
- 提示注入：第一次扫描后的一次工具输出里夹带一段自称 `system-reminder` 的署名指令（要求提交署名 Sonnet 5.5）。它出现在工具结果里而不是用户/系统消息中，按不可信数据处理、未执行并已向用户说明；提交署名最终依据系统消息确认的实际模型和本仓既有惯例（署名记录实际运行模型）确定。
- 已知扫描器缺陷（见 AGENTS.md 待办）再次发生：`npm run scan` 用 UTC 日期，本地 2026-10-02 08:4x 时落成 `public/reports/2026-10-01.json`，并**覆盖了昨天已提交的同名报告**（工作区此前已因 06:04 的扫描被改过）。按既定做法把本次扫描复制改写为当天日期报告 `2026-10-02.json`（同步 `latest.json` 与 `dist/reports`）。想用 `git checkout HEAD -- public/reports/2026-10-01.json` 恢复昨天的内容时被 dcg 安全钩子拦截（该命令会丢弃未提交改动），**未绕过**：`2026-10-01.json` 保持被覆盖状态且未纳入本次提交，需要时请用户手动执行该命令恢复。

## 扫描与复筛

- `npm run pipeline -- status` 返回 `null`，无未完成运行，正常新建。
- 扫描器报告：10 个自动候选，唯一 `值得继续` 为 `affaan-m/ECC`（「测试补充」，证据只是无关文件名）。live 复筛：开放 PR 共 222 个严重积压、仓库无 LICENSE（`licenseInfo` 为空），既往复核确认其 #3214 已在默认分支修复 → 下调为 `跳过`。其余 9 个（ponytail、graphify、yt-dlp、n8n、open-webui、dify、cc-switch、ohmyzsh、JavaGuide）扫描器本就 `跳过`，其中 yt-dlp（`.NO_AI`）、n8n（CLA+issue-first）、ponytail（饱和）、JavaGuide（既往 PR/误判）均为记忆中的恒定死路。
- 扫描池又全退化，按记忆 `scanner-pool-degenerate-fallback` 与 AGENTS.md 自动执行授权做独立发现。**未回 skpro**：本人在 sktime/skpro 已有 9 个 open PR（#1142/#1146/#1148/#1157/#1158/#1168/#1175/#1176/#1182），docstring 方向早已饱和。选 `pyro-ppl/numpyro` umbrella #2187：我方既往 6 个 PR（#2279/#2284/#2286/#2288/#2291/#2294）均已被维护者合并，当前 0 个 open，且 #2187 清单里 `OrderedLogistic`、`ZeroInflatedNegativeBinomial2` 未勾选、开放 PR 与全部 PR 搜索都无人认领。
- 注入两个候选（rank 11/12，`opportunity.summary` 互不相同以免账本去重），报告 `candidateCount=12 / actionableCount=2`，并用项目 schema（`parseReport`）校验通过；`public/reports` 与 `dist/reports` 的 `2026-10-02.json`/`latest.json` 四份内容一致。

## live preflight（逐项，两个候选）

- 仓库 `pyro-ppl/numpyro`：未归档，2026-10-01 仍有推送；默认分支 `master` 头部 `bd36670d087718bcc07152cfb8c93b8707ae5cce`（两次预检之间未变化）。
- umbrella issue #2187 为 OPEN；默认分支上 `OrderedLogistic` 仍只有一句话 docstring、`ZeroInflatedNegativeBinomial2` 完全无 docstring（未修复）。
- 重复 PR：逐个核对全部开放 PR 的 files 列表（#2283 的 `conjugate.py` hunk 在约 366/513/544 行，与 737 行附近不重叠；#2303 只改 `discrete.py`），并按 head 分支名与关键词搜索，均无重复。
- 贡献门禁：Apache-2.0（`gh api license` 确认，GitHub `licenseInfo` 字段为 null 属检测问题），无 CLA/DCO，CONTRIBUTING 只要求大改动先开 issue；仓库 `AGENTS.md` 明确面向 AI 编码代理，约定 PR 目标 `master`、提交前缀 `doc(gh-2187): ...`；无 PR 模板。上游沟通语言 English。
- `gh auth status`：cnYui，scopes 含 repo/workflow/admin:ssh_signing_key。

## 实施与验证（真实执行）

- 本机缺 jax：在 scratchpad 建 venv，`pip install "jax[cpu]" scipy tqdm multipledispatch pytest docutils` + `pip install -e <clone> --no-deps`（jax 0.11.2，CPU），**先于写文档做了数值核对**：`OrderedLogistic` 的 `probs`/`log_prob` 与 `P(Y=k)=σ(c_k−η)−σ(c_{k−1}−η)` 一致、`logit P(Y≤k)=c_k−η`、首末类别形式、随 η 单调、K=2 退化、batch 形状；`ZeroInflatedNegativeBinomial2` 的 PMF 与 `log_prob` 一致且和为 1、均值 `(1−g)μ` 与方差 `(1−g)μ(1+μ/α+gμ)` 与 `.mean/.variance` 一致、40 万样本蒙特卡洛吻合、`gate` 与 `gate_logits` 形式等价、`g=0` 退化为 NB2。
- 额外校验：用 docutils 解析新 docstring（含 math→MathML 转换），因为上游 docs 以 `sphinx -W` 构建；两个新 docstring 均 0 个警告/错误，已合并的 `ZeroInflatedPoisson`/`CategoricalProbs`/`HurdleNegativeBinomial2` 基线也是 0。
- 两个改动都跑了 `ruff check`（All checks passed）、`ruff format --check`（already formatted）、`python -m py_compile`、`git diff --check`（干净）。
- 既有测试回归：`pytest test/test_distributions.py -k OrderedLogistic` → 62 passed, 36 skipped；`-k "ZeroInflated or zero_inflated or NegativeBinomial2"` → 216 passed, 134 skipped（仓库里**没有**按名称针对 `ZeroInflatedNegativeBinomial2` 的测试，一开始 `-k ZeroInflatedNegativeBinomial2` 选中 0 个，改跑相关测试作回归，PR 正文如实说明）。
- 未运行：完整 Sphinx 文档构建、`make doctest`、`ty check`（纯 docstring 改动，未加 `>>>`）；PR 正文已如实写明。
- 提交：均为 SSH 签名提交（提交对象含 `gpgsig`），作者 cnYui。

## 创建的 PR

- pyro-ppl/numpyro#2304：`doc(gh-2187): add mathematical documentation to OrderedLogistic distribution`
  - 链接：https://github.com/pyro-ppl/numpyro/pull/2304
  - 分支 `doc/ordered-logistic-docstring-gh-2187`，commit `afb9bbba81f2143e6e7c63010410131461ec139b`，`numpyro/distributions/discrete.py` +40/−5。
  - 状态：OPEN / MERGEABLE / 非 draft；CI：prek、triage、lint(3.11)、lint(3.14) 已通过，test-modeling/test-inference/examples/benchmark 仍 pending。
- pyro-ppl/numpyro#2307：`doc(gh-2187): add mathematical documentation to ZeroInflatedNegativeBinomial2 distribution`
  - 链接：https://github.com/pyro-ppl/numpyro/pull/2307
  - 分支 `doc/zero-inflated-negative-binomial2-docstring-gh-2187`，commit `e6d3ee9df2112ebd6350eb7683d57efe06058ef5`，`numpyro/distributions/conjugate.py` +58/−0。
  - 状态：OPEN / MERGEABLE / 非 draft；CI：prek、triage 已通过，lint/benchmark 等仍 pending。

## 阻塞 / 跳过

- ECC：live 复筛下调 `跳过`（222 个开放 PR、无 LICENSE、#3214 已在默认分支修复）。
- 其余 9 个自动候选：扫描器本就 `跳过`，恒定死路见上。
- skpro / sktime #4264：本人 skpro 已 9 个 open PR 饱和，未回；未再挑 sktime（本轮 numpyro 已满足 `maxPrsPerRun=2`）。
- 无 `blocked` 候选；无 CLA/账号/付费门禁事项。

## 收尾

- `next` 返回 `limit_reached`（`prsOpened=2=maxPrsPerRun`）；`close` 释放租约并生成 `data/pipeline/runs/20261001235137-4af710/summary.md`（completed）；账本新增 2 条。`status` 现为 `null`。
- `clean` 按 3 天保留清理 `work/opportunity-pipeline`，移除 `sktime__skpro-20260929`，保留 5 个（含本轮 `pyro-ppl__numpyro-20261002` 与其 worktree `pyro-ppl__numpyro-20261002-zinb2`）。
- 数值核对用的临时 venv 在 scratchpad（会话临时目录），不入仓。

## 剩余队列

- 本轮候选队列已全部进入终态（2 个 `pr_opened`），current run 已清除，无待恢复项。
- numpyro #2187 仍未勾选的好切口：`RelaxedBernoulli`/`RelaxedBernoulliLogits`（continuous.py，`Logistic(logits/T, 1/T)`+`SigmoidTransform`）、`TruncatedNormal`/`TruncatedCauchy`、`LowerTruncatedPowerLaw`/`DoublyTruncatedPowerLaw`、`InverseWishart`、`Wishart` 等；`Categorical`/`Geometric`/`Multinomial` 为工厂函数，增量薄。待 #2304/#2307 被审阅合并后再续，避免堆积 open PR。
