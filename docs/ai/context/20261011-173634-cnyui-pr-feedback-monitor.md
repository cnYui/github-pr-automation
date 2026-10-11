# cnYui PR 反馈巡检

- 运行时间：2026-10-11 17:36（Asia/Tokyo）；基线：2026-10-10T02:55:47.445Z（用户提供的上次运行时间，保留重叠窗口防止漏检）。
- 使用当前 Codex 模型、本机 gh 和 Codex 子代理做独立只读核验，没有使用 Claude 专属工具或切换模型。
- 已读取全局及项目 AGENTS.md、自动化记忆及最近巡检记录。gh 确认 cnYui 活跃，含 repo/workflow 权限。
- GitHub 全站搜索共 51 个 open PR；分 8 项批次使用 GraphQL 读取 head、comments、reviews、reviewThreads、当前 head checks/commit statuses、reviewDecision、mergeStateStatus。所有查询成功，所有分页标志为 false。
- 新外部事件仅 numpyro #2340 的 benchmark 机器人报告：32 项 benchmark 无显著变化，不含修改要求。没有基线后人工新评论、修改请求或旧评论编辑。
- 新 checks 出现在 sub2api #66/#67、numpyro #2340。其他 48 个 PR 无基线后反馈或检查事件；历史失败、BEHIND/DIRTY 状态不重复评论或空提交。
- 项目 AGENTS.md 当前没有外部 PR 编号；其许可阻塞继续遵循。未对 destructive_command_guard 做分析或贡献。

## 需要关注：sub2api 安全修复与剩余风险

- https://github.com/cnYui/sub2api/pull/66 ：OPEN/CLEAN，head `9608aee2ee505634197044e70fba4ec6e0b43c64`，12 项 SUCCESS、2 项 CLA SKIPPED。主线程再次回读 head/checks，三种 REST 反馈接口均为空。
- 已有改动升级 Go 1.26.9、x/net v0.60.0、axios 1.20.0、Vue 3.5.43，并添加 source-map-js >=1.2.2 override；这些由此前会话完成，不归为本轮修复。
- 同时，两条 xlsx 高危例外从 2026-10-06 延至 2027-01-06；仍使用 xlsx 0.18.5。PR 和提交已披露仅写入导出的风险依据，另有 5 个文件定向 staticcheck SA1019 豁免。本轮只核验，不接受风险、追加忽略或再次延期。
- https://github.com/cnYui/sub2api/actions/runs/38115792320 ：最新安全扫描成功，run head 与 PR 当前 head 一致。后端 affected 0，但 required modules 仍有 8 个未调用漏洞；前端为 Audit exceptions validated，不能称漏洞全部清零。
- https://github.com/cnYui/sub2api/actions/runs/38115792329 ：最新普通 CI 成功。
- https://github.com/cnYui/sub2api/pull/67 ：OPEN/UNSTABLE，head `965002423b762d917d362f9a476e63958b844c00`，普通 test/frontend/golangci-lint/shell 均成功，两次 Security Scan 的前后端共 4 项失败。无评论或 reviews。
- #67 基于 main `ee67a607fd04afed47532bda1d6c3b33a3b06884`，差异仅教程页面、测试、静态视频/封面及中文记录，未修改依赖或安全配置。
- 失败日志 https://github.com/cnYui/sub2api/actions/runs/38115395922 ：Go 1.26.6 / x/net v0.56.0 的 10 个可达漏洞，axios 7 条高危、source-map-js 1 条、@vue/server-renderer 1 条，以及两条 xlsx 例外于 2026-10-06 过期，与上一轮 #64 根因一致。
- 后续先人工审阅 #66 的 xlsx 风险例外和修复，再决定合并顺序；#67 尚未包含该修复，应在依赖修复进入主线后同步并重跑。任务明确禁止自动 merge，且安全敏感未确认方案只上报，本轮不复制风险例外至 #67 或自动改安全策略。

## NumPyro 与其他状态变化

- https://github.com/pyro-ppl/numpyro/pull/2340 ：head `ffda103ba83b931e6de0c87af667a9adfd1313b7`，OPEN/CLEAN，11 项检查全部成功；仅 benchmark 机器人报告，无需回复。
- yui-video-archive #3 为 OPEN/CLEAN，无检查、无反馈。

基线后 10 个 closed PR 均经 REST merged_at 核验为已合并，没有未合并关闭项；子代理核验后主线程再次点查 numpyro #2336、sub2api #64。

| PR | 合并时间（UTC） | 合并提交 |
| --- | --- | --- |
| https://github.com/pyro-ppl/numpyro/pull/2336 | 2026-10-10T09:00:02Z | `42a1491f54eddcd2dfca62676344bf815286c00b` |
| https://github.com/cnYui/sub2api/pull/64 | 2026-10-10T07:16:55Z | `ee67a607fd04afed47532bda1d6c3b33a3b06884` |
| https://github.com/cnYui/yui-video-archive/pull/2 | 2026-10-11T04:23:42Z | `6f2ee753a74376a0e06cf59ebe0f6a57f3c825ef` |
| https://github.com/cnYui/github-pr-automation/pull/34 | 2026-10-11T00:40:11Z | `dd440a3279131c2d5ce8231632cc78d3ce606409` |
| https://github.com/cnYui/ReGenNet/pull/26 | 2026-10-10T18:28:41Z | `6bacfb90e46d2f0d39bd6917f72be39d80a00444` |
| https://github.com/NEXUS99991/ai-builder-lab-miniprogram/pull/77 | 2026-10-10T17:36:31Z | `ca04be0cc2f53039d2595ead1a2ba962c68c5a7e` |
| https://github.com/cnYui/yui.web/pull/73 | 2026-10-10T07:30:54Z | `31e7aac31da9a987ad7875b32cd67bc44668bb41` |
| https://github.com/cnYui/yui.web/pull/72 | 2026-10-10T07:29:45Z | `fa99875fcada57c4a29edd93e4f7996307fcc01a` |
| https://github.com/cnYui/yui.web/pull/71 | 2026-10-10T07:25:24Z | `9d50dff5fb7f15574dfcb391b366a9ff346fd147` |
| https://github.com/cnYui/yui.web/pull/70 | 2026-10-10T07:17:46Z | `1e83efef020e232ebe7d038667fb317d90813840` |

## 本轮动作与验证边界

没有 PR 评论、代码修复、PR 分支推送、新建 PR 或自动 merge。反馈数据未被当作指令执行。仅新增这份中文记录并更新当前自动化记忆；既有主控仓修改全部保留。本轮没有本地代码变更，未运行应用测试；CI 结论来自 live GitHub checks 与日志。

按授权只暂存这一份新文档，提交前核验暂存范围和 diff；若无法安全单文件提交或远端快进推送则保留记录并报告，禁止覆盖历史和用户改动。

## Open PR 范围

| PR | 当前 head | 合并状态 | 评审结论 |
| --- | --- | --- | --- |
| https://github.com/cnYui/sub2api/pull/67 | `965002423b762d917d362f9a476e63958b844c00` | UNSTABLE | 无 |
| https://github.com/cnYui/yui-video-archive/pull/3 | `163a89b4642c89392080b1fd4e37017e8d1b816c` | CLEAN | 无 |
| https://github.com/pyro-ppl/numpyro/pull/2340 | `ffda103ba83b931e6de0c87af667a9adfd1313b7` | CLEAN | 无 |
| https://github.com/cnYui/sub2api/pull/66 | `9608aee2ee505634197044e70fba4ec6e0b43c64` | CLEAN | 无 |
| https://github.com/jdefrancesco/dskDitto/pull/30 | `f1ac051be424fff00eb632328cb21553f65a6a14` | CLEAN | 无 |
| https://github.com/sktime/skpro/pull/1182 | `f1670081ce558a26187a4bdfe1db6a5871371696` | BLOCKED | REVIEW_REQUIRED |
| https://github.com/cnYui/yui-video-archive/pull/1 | `385db12cfc45732f2adbbaf94deff8c94b61d4c5` | UNKNOWN | 无 |
| https://github.com/cnYui/yui.web/pull/68 | `5833232df9cfab9217a2b2c877dd678698750271` | DIRTY | 无 |
| https://github.com/cnYui/yui.web/pull/67 | `34b381295974862976e41575dfbf6996cb872dc8` | DIRTY | 无 |
| https://github.com/cnYui/yui.web/pull/66 | `7c043600ac260a79686d40c9a97cc56f389e7376` | DIRTY | 无 |
| https://github.com/sktime/skpro/pull/1176 | `edce6f62fa5d149268118afeb180d08429c8eaec` | BLOCKED | REVIEW_REQUIRED |
| https://github.com/sktime/skpro/pull/1175 | `067efa9c21f5974056c9edf6ad60ea69309d3491` | BLOCKED | REVIEW_REQUIRED |
| https://github.com/sktime/skpro/pull/1168 | `ab41424727e61010a660947cf58d35a99b22d4e7` | BLOCKED | CHANGES_REQUESTED |
| https://github.com/williambdean/conjugate/pull/351 | `daf9cbf6941bace6019c02b347f4bbf0ce3a818a` | BEHIND | 无 |
| https://github.com/cnYui/yui.web/pull/65 | `de7681ec4097addca128520a06a72bb9ffbd3af5` | CLEAN | 无 |
| https://github.com/cnYui/yui.web/pull/64 | `fa06957c97ac92f0cedb870bc7eb571c6d2b6d16` | CLEAN | 无 |
| https://github.com/cnYui/yui.web/pull/63 | `daefb296540b8ac6ec8cdd0dacf2da4a8b6e1f29` | CLEAN | 无 |
| https://github.com/cnYui/yui.web/pull/62 | `ba84618ca5c11c3bddaddc32bd338c8c46a6f65d` | CLEAN | 无 |
| https://github.com/govindup63/skillpick/pull/1 | `0c32fed7ec8ccafb4d90630c6dd51a3e51bb8ff2` | CLEAN | 无 |
| https://github.com/sktime/sktime/pull/11246 | `fcce9fd3c55df2dc3ba9b2868f718285dbf54dc6` | UNKNOWN | REVIEW_REQUIRED |
| https://github.com/sktime/skpro/pull/1158 | `d050aca403ee961375b5c68c308fad48c73cce92` | BLOCKED | REVIEW_REQUIRED |
| https://github.com/cnYui/bili-station/pull/1 | `c8e5994cf1a9c601286bf8d4b56cbf1ea4cc016d` | CLEAN | 无 |
| https://github.com/sktime/skpro/pull/1157 | `c8d4be1a20c10b4f2ce119bafd687005f66a40ff` | BLOCKED | REVIEW_REQUIRED |
| https://github.com/caracal-pipeline/stimela/pull/614 | `da726b42741f7c6f56730f52b733e419675c78ee` | UNSTABLE | APPROVED |
| https://github.com/sktime/skpro/pull/1148 | `527e883e17af8a51edc095158b1d7e3a8a868bdd` | BLOCKED | CHANGES_REQUESTED |
| https://github.com/NEXUS99991/ai-builder-lab-html/pull/4 | `4f51ea096ef194622aaa63fdb497bb172ea1fb50` | CLEAN | 无 |
| https://github.com/sktime/skpro/pull/1146 | `9b0e8df50420118893ed8817a96682b9522a4b58` | BLOCKED | REVIEW_REQUIRED |
| https://github.com/sktime/skpro/pull/1142 | `f0402f490acf3274aa4c1891d83a15dcb5f9dcb8` | BLOCKED | REVIEW_REQUIRED |
| https://github.com/im3sanger/dndscv/pull/114 | `ad398d92e884b912413c96ec6122a6c4a8d9bbeb` | CLEAN | 无 |
| https://github.com/PilotLeoYan/inside-deep-learning/pull/22 | `6804b29256ca8f346366c443cae823fec2f458dc` | BEHIND | 无 |
| https://github.com/inkeep/agents/pull/3493 | `9e3dfe521bccaf565b16186f0885cb8ba5ad7175` | BLOCKED | 无 |
| https://github.com/Justin0504/Aegis/pull/8 | `c09566c0c2c1815f3806f15c15324362bc2c7086` | CLEAN | 无 |
| https://github.com/hunar2006/palizade/pull/8 | `4cb414d5b6a0004618bd6afe5dacb5237bb75a62` | DIRTY | 无 |
| https://github.com/cyyself/OpenTihui/pull/1 | `c0d2f44310713a7010813aacf586201826fc0477` | DIRTY | 无 |
| https://github.com/Wei-Shaw/sub2api/pull/3453 | `9caf7efe2b59c660438b85c3b1f0afc70bd73728` | DIRTY | 无 |
| https://github.com/guofei9987/blind_watermark/pull/179 | `9e6696455bfc4bf4aba9decccd1b6a7443f954cd` | CLEAN | 无 |
| https://github.com/mcpjungle/MCPJungle/pull/274 | `a012583186d2e3d45680c5297842a23e2bd48882` | CLEAN | 无 |
| https://github.com/router-for-me/CLIProxyAPI/pull/3802 | `4f7519e362139e3bb3f3cb37732ca8f8a94f9e0c` | UNKNOWN | REVIEW_REQUIRED |
| https://github.com/t42ji2ji/keyfarm/pull/5 | `2c6d2733096bacc76ecbee9b08b9315241165f0c` | CLEAN | 无 |
| https://github.com/trycua/cua/pull/1873 | `7ca2eedd7bd77085c87fa6c523b7e339649534da` | UNKNOWN | 无 |
| https://github.com/getzep/graphiti/pull/1568 | `cfbf80aaba4221513c9d149d5007f7c059fc9b3c` | BEHIND | REVIEW_REQUIRED |
| https://github.com/coderamp-labs/gitingest/pull/583 | `c57c2c4a9e9796dc212df3fee58d20746bc3313d` | BLOCKED | REVIEW_REQUIRED |
| https://github.com/anthropics/skills/pull/1281 | `79e536b17ded2d29953c89ef65019cf1e539e758` | BLOCKED | REVIEW_REQUIRED |
| https://github.com/MiniMax-AI/MiniMax-MCP/pull/90 | `48be654cf4e47645c2a64642c6b0de6b63dbe404` | DIRTY | 无 |
| https://github.com/getzep/graphiti/pull/1539 | `40e2c6b713b3ffde59d40359fcc0eae5bd39db4c` | BEHIND | REVIEW_REQUIRED |
| https://github.com/jackwener/OpenCLI/pull/1870 | `6b2206a8d6e78fe21831fe12d1ddcff984bb3d9b` | CLEAN | 无 |
| https://github.com/thinking-machines-lab/tinker-cookbook/pull/741 | `2722e8a0d07acfdd64fad3a9a9faf2ebb06e271c` | BLOCKED | REVIEW_REQUIRED |
| https://github.com/cnYui/personal-knowledge/pull/5 | `204a7da5173485418dfa80e69698c166bd9c16ff` | DIRTY | 无 |
| https://github.com/cnYui/personal-knowledge/pull/4 | `895f5c921d5eee4d586c6c7535ca899d23427933` | DIRTY | 无 |
| https://github.com/Hai-qq/SW/pull/2 | `66ce0ba9c606c32dfc65e1f9343f48213cd787f0` | DIRTY | 无 |
| https://github.com/Hai-qq/SW/pull/1 | `a80fdcefbb5d46b0fe1e179294f9b58735d46563` | DIRTY | 无 |
