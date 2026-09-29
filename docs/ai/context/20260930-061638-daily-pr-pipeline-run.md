# 每日 GitHub PR 机会流水线运行（2026-09-30）

- 实际运行模型：Claude Opus 4.8（claude-opus-4-8）
- 运行日期：2026-09-30（JST）
- 当天日期报告：`public/reports/2026-09-30.json`
- run 1：`20260929211150-164824`（lease `2026-09-29T21:11:50.382Z-bcf768`，已 close 释放）——skpro 候选，PR 创建后经复核发现重复已撤回
- run 2：`20260929212345-7e281d`（lease `2026-09-29T21:23:45.824Z-7573ae`，已 close 释放）——numpyro 候选，交付有效 PR

## 流程摘要

1. `pipeline status` = null，无未完成运行/未释放租约。
2. `npm run scan` 产出 `public/reports/2026-09-29.json`（扫描器 UTC 日期偏移已知缺陷，运行日实为 09-30）。本轮扫描 10 个候选**全部 `跳过`**（ponytail/ECC/n8n/yt-dlp/ohmyzsh/JavaGuide/dify/open-webui/cc-switch/graphify）——已记录的候选池退化（AI 饱和 / star 失真 / 已有相近 PR）。
3. 扫描池退化，按既有回退方案用 `gh search issues` 独立发现。评估两条线索后：
   - substrait-io/substrait #1240（docs 生成器渲染修复）：CONTRIBUTING 明确要求 **CLA**（cla-assistant.io）→ 命中禁止项，跳过。
   - sktime/skpro issue #1135（doctest 示例征集，无 CLA）→ 初选，最终因重复撤回（见下）。
   - pyro-ppl/numpyro issue #2187（分布数学 docstring 征集，无 CLA）→ 最终交付。

## Run 1（skpro OnlineDontRefit）——已撤回，教训留档

- 选取 online meta-strategy 家族 `OnlineDontRefit`（前两 sibling OnlineRefit/EveryN 本机 #1148 已提交）。
- live preflight 时做了 `gh pr list --head` 与 `--search "DontRefit"`（标题/正文）去重，均为空 → 误判无重复，创建 **PR #1180**（68f3e45，doctest 本地 12/0 通过、pytest `test_class_has_doctest_example[OnlineDontRefit]`+`test_doctest_examples[OnlineDontRefit]` 2 passed、black/isort/flake8 全绿）。
- **随后核对发现开放 PR #1140「一 PR 覆盖多 estimator」已包含 OnlineDontRefit 的示例并移除同一跳过标记**——`gh pr diff 1140` 确认。这正是 AGENTS 记忆里早已警告的「#1140 多-estimator PR，挑类前必须读 files 列表而非只看标题」的坑。
- **已撤回**：`gh pr close 1180 --delete-branch`（留礼貌评论指向 #1140），并删除 fork 分支。报告中该候选改判 `跳过`（reason=与 #1140 重复）。
- **教训（已写入记忆）**：skpro 去重必须对**全部开放 PR 的 files 列表**做交叉核验，不能只按 PR 标题/正文搜索，否则会漏检多-estimator 型 PR。

## Run 2（numpyro ZeroInflatedPoisson）——本轮有效交付

### pyro-ppl/numpyro — ZeroInflatedPoisson 数学 docstring（PR #2294）
- 分支：`doc/2187-zeroinflatedpoisson-math`，commit `bd7ccde`
- 改动：`numpyro/distributions/discrete.py`（+37/-4）——`ZeroInflatedPoisson` 此前仅 2 行参数 docstring，补类级 `r""" .. math::`：PMF（结构零 `g` + Poisson 抽样零 `(1-g)e^{-λ}`）、均值 `E[X]=(1-g)λ`、方差 `Var(X)=(1-g)λ(1+gλ)`，并说明 `g>0` 时 `Var>E` 的过离散意义；风格照同文件 `HurdleProbs`
- PR：https://github.com/pyro-ppl/numpyro/pull/2294（非 draft、MERGEABLE）
- 公式核验：逐行对照 `ZeroInflatedProbs` 实现——`log_prob`（value=0 时 `log(g+(1-g)e^{-λ})`）、`mean=(1-g)·base.mean`、`variance=(1-g)(m²+v)-mean²` 代入 Poisson(m=v=λ) 化简得 `(1-g)λ(1+gλ)`
- 验证（本地实跑，clone master=`1ba4eb87`）：`ruff check` All checks passed、`ruff format --check` already formatted、`python -m py_compile` OK（纯文档无 `>>>`，doctest 不受影响；本机无 jax，AST/lint 校验为该类文档改动的充分手段）
- live preflight：默认分支（master）仍为 2 行 minimal docstring（未修复）；#2187 open；交叉核验全部开放 PR files——仅 #2293 在 diff hunk 上下文出现类名、未改该类 docstring，无实际覆盖
- 依据：本机 numpyro doc PR #2279/#2284/#2286/#2288/#2291 **已全部 merged、0 堆积**，是当前最可靠低风险源

## 阻塞 / 跳过

- 扫描器 10 候选全 `跳过`（候选池退化，无合格切口）。
- substrait #1240：需 CLA，命中禁止项。
- skpro OnlineDontRefit：与开放 PR #1140 重复，创建后撤回（#1180 closed）。
- 未处理需 CLA / 账号授权 / 付费 / 维护者权限 / 大改动的事项。

## 剩余队列

- 两轮 run 各 1 个 `值得继续`；run 1 撤回、run 2 交付有效 PR #2294，合计有效交付 1 个，未超 `maxPrsPerRun=2`。
- 两次 `close` 均已释放租约并生成 `summary.md`；`clean` 删除 1 个超 3 天工作区、保留 4 个。
