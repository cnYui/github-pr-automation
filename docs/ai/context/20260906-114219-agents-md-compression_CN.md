# AGENTS.md 压缩归档（2026-09-06）

- 时间：2026-09-06 11:42:19 +09:00
- 压缩前：30 行，15692 字节
- 压缩后：23 行，5504 字节
- 移除：7 条（顶部一次性「每日流水线运行 / 多仓批量提交 / PR 反馈巡检」运行日志，均已引用各自 `docs/ai/context/*.md` 记录文档）
- 并入保留章节的事实：无（被移除的均为纯一次性运行流水，其完整细节在各自 record 文档中已保存；未从中提炼新的常驻规则）
- 敏感值处理：本次移除内容仅含公开仓库名、PR 链接、commit SHA，无密钥/内网主机/桶名/Tunnel ID，无需占位替换。

本仓库为公开仓。以下逐条照抄被移除的原文（完整不摘要），并标注命中判据。

---

## 移除条目（逐条原文 + 判据）

### 1. 2026-09-06 10:00:21 多仓 PR 批量提交运行日志

> - 2026-09-06 10:00:21 +09:00：按用户「再找项目提交不少于 10 个高质量 PR」要求，用两阶段 Workflow 编排完成一次多仓批量提交。发现阶段 12 路 scout（各用不同检索模态：各语言代码 bug、doc-vs-code、断链、打包元数据、good-first-issue、编码/IO、测试/CI）产出 43 候选，按 `owner/repo` 去重后 35；对抗验证阶段每候选 3 个独立 lens（still-broken / duplicate / is-it-real）一致通过（≥2 票且零反驳）才保留，27 幸存，选取 21 实施。共产出 **19 个 PR（2 个当场合并，17 个 open 且 MERGEABLE，0 draft/closed）**，覆盖 19 个不同外部仓。已合并：`embeddings-benchmark/mteb#5391`（retry 日志 TypeError）、`mufeedvh/code2prompt#335`（3 个失效 CLI flag 文档）。代码/崩溃类 open：`shibing624/agentica#37`（固定快照按自身价计费，16.7x 计费 bug）、`akash-network/console#3817`（维护页开放重定向）、`apache/dubbo-go-pixiu#1032`（grpcproxy AUTO nil fileSource 崩溃）、`fluid-cloudnative/fluid#6187`（吞掉 transformFuseConfig 错误）、`ArduPilot/MethodicConfigurator#2031`（排序模板发现修复 CI 不稳定）、`karanhudia/borg-ui#920`（恢复被遮蔽 prune 测试）、`libredb/libredb-studio#579`（overview size 失败时省略字段）。打包类：`evalstate/fast-agent#945`、`munich-quantum-toolkit/bench#1011`、`helmholtz-analytics/heat#2528`。文档/断链类：`laixintao/iredis#525`、`robvanderleek/mudslide#416`、`rvben/rumdl#856`、`numtide/treefmt#727`、`FPGAwars/apio#1010`、`visgl/react-google-maps#1068`、`replicatedhq/kots#6049`。诚实跳过 `OWASP/cve-lite-cli`（目标缺陷已被上游 PR #1084 于当日合并修复，未建重复 PR）。每个 PR 均改前复现、改后验证、非 draft、未自动 merge、未签 CLA；DCO 仓库用 `git commit -s`。首批 6 个中途遇账号 session limit（Asia/Tokyo 每日重置）被中断，重置后补跑剩余 15 并对已建 PR 去重复核（mteb 复用已合并 PR，未建重复）。另清理主控仓根目录 125 个 0 字节垃圾文件（子代理 gh/node 命令在主控仓根误撒），主控仓仅剩流水线自身 report JSON。记录文件：`docs/ai/context/20260906-095623-multi-repo-pr-batch-run-record.md`。

**判据**：一次性运行/操作日志，条目内已引用对应 record 文档 `docs/ai/context/20260906-095623-multi-repo-pr-batch-run-record.md`（该文档未被 prune 删除，仍在仓内）。完整细节（19 个 PR 清单、验证过程、去重、垃圾清理、session limit 中断）均在 record 中保存，AGENTS.md 顶部仅为索引，属可复现历史流水。

### 2. 2026-09-03 每日流水线运行

> - 2026-09-03 每日流水线运行：Run `20260902211527-fcc5fe` 生成运行当日报告 `public/reports/2026-09-03.json`。`npm run scan`（UTC 落 `2026-09-02.json`）10 个候选仅 `Snailclimb/JavaGuide` 启发式「值得继续」、`actionableCount=1`，live 复筛下调为「跳过」（账本已 PR #2890 去重）。用 `gh search issues` 定向复核后排除多例（kilo-code.nvim#2/ironwail#581 已有 PR、traQ_S-UI typo 被 PR #5314 清扫且属标识符重命名、IACorr#4 前提不复现、PMOIRED#14 正确版本无法客观溯源、PerseusDLCode#196 非字面量），命中并选定由 Jmix 维护者 alexbudarov 提交的 `jmix-framework/jmix-docs#181`。live preflight 逐项通过（俄语翻译在 `release_3_ru` 分支、第 59 行仍为 `Аналично`、无重复 PR、CC-BY-4.0 无 CLA、base SHA `39020d38`）后，用 blobless+sparse clone 检出单目录，将 `content/modules/appsettings/pages/index.adoc` 第 59 行 `Аналично` 改为 `Аналогично`（俄语「同样地」补回字母 г），创建 ready PR #183（https://github.com/jmix-framework/jmix-docs/pull/183），commit `863dc06f9e7217b42a4224b3bf6dd4f7ecdb5d07`。本地通过 grep（1→0 / 0→1）、`git diff --check`（+1/-1、1 文件）；PR MERGEABLE、非 draft、base `release_3_ru`、无 CI checks（需 premium 凭据）。运行已 close、租约释放、`clean` removed 0/kept 3、剩余队列 0，详见 `docs/ai/context/20260903-061900-daily-pr-pipeline-run-record.md`。

**判据**：一次性「每日流水线运行」日志，已引用 record 文档 `docs/ai/context/20260903-061900-daily-pr-pipeline-run-record.md`（仍在仓内）。可复现历史流水。

### 3. 2026-09-02 每日流水线运行

> - 2026-09-02 每日流水线运行：Run `20260901235842-b26069` 生成运行当日报告 `public/reports/2026-09-02.json`。`npm run scan`（UTC 落 `2026-09-01.json`）10 个候选全部启发式「跳过」、actionableCount=0（均超大仓）；按 scan Skill 对启发式结果做 live 复筛，用 `gh search issues` 定向命中客观 404 缺陷 `hust-open-atom-club/oh-dsh#192`，写入当日报告标记「值得继续」。live preflight 逐项通过（main 仍含错误链接、正确上游 200/错误 404、issue open 无 assignee 无关联 PR、无重复 PR、无 CONTRIBUTING/CLA 门禁）后，创建 ready PR #194（https://github.com/hust-open-atom-club/oh-dsh/pull/194），commit `70160a97b30af3200bbaebb4b44ee36c15d2063d`，将 `README.md`/`README.en.md` 推荐项目表中 `deepseek-harness/deepseek-harness` 更正为 `deepseek-ai/deepseek-harness`。本地通过 grep、`curl -L`（404 vs 200）、`git diff --check`（+2/-2、2 文件）；PR MERGEABLE、非 draft、无 CI checks。运行已 close、租约释放、`clean` removed 0/kept 2、剩余队列 0，详见 `docs/ai/context/20260902-090230-daily-pr-pipeline-run-record.md`。

**判据**：一次性「每日流水线运行」日志，已引用 record 文档 `docs/ai/context/20260902-090230-daily-pr-pipeline-run-record.md`（仍在仓内）。可复现历史流水。

### 4. 2026-09-03 PR 反馈巡检

> - 2026-09-03 PR 反馈巡检：以 `2026-09-02T12:21:00Z` 为基线，REST/GraphQL Search 均确认 23 个 open PR 且无分页遗漏，逐个回读评论、reviews、行级评论、head checks 和 statuses 后无新的非 `cnYui` 反馈、requested changes 或新增失败 check；新增 `jmix-framework/jmix-docs#183` 无评论且 `MERGEABLE/CLEAN`。基线后 `cnYui/ReGenNet#1`、`Ye13ow77z/ai-builder-lab-miniprogram#19` 已合并；本轮未自动回复、未修代码、未派发子 agent、未提交、未推送，详见 `docs/ai/context/20260903-125731-cnyui-pr-feedback-monitor.md`。

**判据**：一次性「PR 反馈巡检」日志，已引用 record 文档 `docs/ai/context/20260903-125731-cnyui-pr-feedback-monitor.md`（仍在仓内）。巡检结论为「无新反馈」，属可复现历史流水。

### 5. 2026-09-04 每日流水线运行

> - 2026-09-04 每日流水线运行：Run `20260903210439-c7bf13` 生成运行当日报告 `public/reports/2026-09-04.json`。`npm run scan`（UTC 落 `2026-09-03.json`）10 个候选仅 `Snailclimb/JavaGuide` 启发式「值得继续」，live 复筛下调为「跳过」（账本已就 #2890/#2768/#2752 去重）。用 `gh search issues` 定向复核后排除 traQ_S-UI 标识符重命名 typo、najdresearch#1（无客观修法）、jetbase#97（切口不明），命中并选定 `vdbulcke/zellij-workspace#9`。live preflight 逐项通过（main SHA `e8c7698e`、README L75 仍失效、issue open 无 assignee、无重复 PR、无 CONTRIBUTING/CLA 门禁）后，将 `README.md` L75 cosign 安装链接 `https://docs.sigstore.dev/cosign/installation/`（404）改为 `https://docs.sigstore.dev/cosign/system_config/installation/`（200），Fork `cnYui/zellij-workspace` 并创建 ready PR #10（https://github.com/vdbulcke/zellij-workspace/pull/10），commit `6f0e48208596cf6c84f7b5a2e9546cbb9edb68bf`。本地通过 curl（404 vs 200）、grep（0/1）、`git diff --check`（1 文件 +1/-1）；PR OPEN、非 draft、MERGEABLE、base main、无 CI checks。运行已 close、租约释放、`clean` removed 0/kept 5、剩余队列 0，详见 `docs/ai/context/20260904-060700-daily-pr-pipeline-run-record.md`。

**判据**：一次性「每日流水线运行」日志，已引用 record 文档 `docs/ai/context/20260904-060700-daily-pr-pipeline-run-record.md`（仍在仓内）。可复现历史流水。

### 6. 2026-09-05 每日流水线运行

> - 2026-09-05 每日流水线运行：Run `20260904210802-d138da` 生成运行当日报告 `public/reports/2026-09-05.json`。`npm run scan`（UTC 落 `2026-09-04.json`）10 个候选启发式仅 `n8n-io/n8n`、`Snailclimb/JavaGuide` 标「值得继续」，live 复筛分别下调为「谨慎」（内部 Linear 门禁）与「跳过」（账本已 #2890/#2768/#2752 去重）。用 `gh search issues` 定向复核后排除 `Open-Source-Connect/OSCG-2026#3`（正确 URL 无法客观溯源）、`ironwail#581`（已有 PR）、`globalwordnet#12`（生成站批量映射不客观）、traQ_S-UI typo（标识符重命名），命中并选定 `Badgerati/Pode#1787`。live preflight 逐项通过（develop SHA `d27459a`、README L41 仍失效、issue open 无 assignee、无重复 PR、CONTRIBUTING 要求 PR 目标 develop 且无 CLA）后，根因为文档站 mike 版本化缺 `/latest/` 段：将 `README.md` L41 First App 链接 `https://badgerati.github.io/Pode/Getting-Started/FirstApp`（404）改为 `https://badgerati.github.io/Pode/latest/Getting-Started/FirstApp/`（200），Fork `cnYui/Pode` 并创建 ready PR #1793（https://github.com/Badgerati/Pode/pull/1793），commit `a4247412933cefc3b40609b75f1f7ce0db380b52`。本地通过 curl（404 vs 200）、grep（旧 0/新 1）、`git diff --check`（1 文件 +1/-1）；PR OPEN、非 draft、MERGEABLE、base develop、初始 `security/snyk` pending（外部服务）。运行已 close、租约释放、`clean` removed 1/kept 5、剩余队列 0，详见 `docs/ai/context/20260905-061500-daily-pr-pipeline-run-record.md`。

**判据**：一次性「每日流水线运行」日志，已引用 record 文档 `docs/ai/context/20260905-061500-daily-pr-pipeline-run-record.md`（仍在仓内）。可复现历史流水。

### 7. 2026-09-06 每日流水线运行

> - 2026-09-06 每日流水线运行：Run `20260905211454-532aca` 生成运行当日报告 `public/reports/2026-09-06.json`。`npm run scan`（UTC 落 `2026-09-05.json`）10 个候选启发式仅 `Snailclimb/JavaGuide` 标「值得继续」，live 复筛下调为「跳过」（账本已就 #2890/#2768/#2752 去重）。用 `gh search issues` 定向复核后排除多例（ironwail#581/dolphinscheduler#18617 已有 PR、onionshare#2100 正确替换不客观、nextcloud#15498 默认分支已修复、smallstep#2788/PhonePe#14/Myriad#297 无客观替换 URL、uml4net#229 typo 在 wiki、AlwaysActiveHours#16 属脚本逻辑改动、traQ/oracle/canonical/mapbox 属标识符重命名或 CLA 门禁），命中并选定 `im3sanger/dndscv#113`。live preflight 逐项通过（master SHA `43c5e2f1`、README L48/L60 仍为 http、issue open 无 assignee、open PR #89/#65/#58 均不碰 README、无 CONTRIBUTING/CLA、两个 vignette HTML 均 200）后，将 README 两处教程链接 `http://htmlpreview.github.io/?http://github.com/...` 改为 `https://...`（修复 https 页面 fetch 内层 http 资源被严格浏览器按混合内容拦截、Safari 报 `TypeError: Load failed` 的问题），Fork `cnYui/dndscv` 并创建 ready PR #114（https://github.com/im3sanger/dndscv/pull/114），commit `ad398d92e884b912413c96ec6122a6c4a8d9bbeb`。本地通过 grep（旧 2→0 / 新 2）、`git diff --check`（+2/-2、1 文件）、两个 vignette 200、浏览器验证 https 变体正常渲染；PR OPEN、非 draft、MERGEABLE、base master、无 CI checks。运行已 close、租约释放、`clean` removed 2/kept 42、剩余队列 0，详见 `docs/ai/context/20260906-062000-daily-pr-pipeline-run-record.md`。

**判据**：一次性「每日流水线运行」日志，已引用 record 文档 `docs/ai/context/20260906-062000-daily-pr-pipeline-run-record.md`（仍在仓内）。可复现历史流水。

---

## 本次刻意保留的内容（未压缩）

以下条目虽含日期、写法像历史记录，但确立的是至今仍照做的规则、边界、架构决策或踩过的坑，故全部保留在 AGENTS.md：

- **`## GitHub 每日 PR 机会展示页` 整节**（页面/自动化/数据/贡献/推荐/Skill 边界，实现计划指针）——当前仍生效的产品与自动化边界。
- **2026-06-07 失败 PR 根因复查**（graphiti#1539 / CopilotKit#5296 / cell-architecture-studio#8）——坑/教训：CLA 未签、Vercel 授权阻塞类失败不应通过改代码或空提交重提解决。
- **2026-06-07 graphiti CLA 签署记录**——与上条配套的已签 CLA 事实与 record 指针（其 record 文档因被引用已由 prune 保留）。
- **2026-07-11 候选实施复核修正**——坑/教训：后续机会扫描必须同时检查默认分支实现状态，不能只看 issue/PR 状态。
- **2026-07-11 主控仓库方向 / 自动执行授权 / 持久化边界 / GitHub 工具边界**——常驻架构与授权规则：三 Skill + 单 cron 串联；`值得继续` 才进 live preflight，禁止自动 merge；不可变候选快照 + lease + run + ledger；`gh` 负责认证/远程操作，本地改动用 `git`。
- **2026-07-11 主控仓库迁移完成**——常驻事实：仓库 `cnYui/github-pr-automation`、本地主路径 `D:\CodeWorkSpace\github-pr-automation`、remote 结构。
- **2026-07-14 主控仓同步边界**——常驻边界：同步范围与 `.gitignore` 排除项（`work/`、`data/`、依赖、缓存）。
- **2026-07-14 `destructive_command_guard` PR 阻塞**——坑/反直觉事实：该仓 LICENSE rider 明确禁止 OpenAI/Anthropic 及其代理分析、修改、测试、发布；未获作者书面许可前不得推进。
- **2026-09-06 待办合并（压缩时保留）**——未完成待办：扫描器两个已知未修复缺陷（CLI UTC 日期落前一日、`--help` 未静默）。
