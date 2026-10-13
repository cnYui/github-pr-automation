# cnYui PR 反馈巡检

- 运行日期：2026-10-13，Asia/Tokyo。
- 账号级快照时间：2026-10-13T00:55:00.102Z；重点 PR 另经并行只读回查。
- 用户提供的上次运行：2026-10-11T08:32:27.975Z。
- automation memory 最后记录：2026-10-10T03:05:56Z；本轮从该较早基线补查，防止记忆缺口漏掉反馈。
- 认证：gh keyring 当前账号 cnYui，token scopes 包含 repo/workflow；未读取或回显 token。

## 结论与动作

当前共 53 个 open PR。基线后 open PR 只有 1 条外部评论，为 NumPyro #2343 的成功 benchmark 报告；无新维护者意见、无需新增回复或代码修复。4 个 open PR 有新 checks，均无失败。无本轮 PR 评论、代码修改、PR 分支提交或推送、自动合并。

- NumPyro #2343：head 0c33c5022b5db41a27ca29a898a6081544bc45d4，11 项 checks 全 SUCCESS，benchmark 无显著变化；保持等待维护者审查。
- NumPyro #2340/#2342：维护者 10 月 12 日的意见均已由 cnYui 在 10:15 UTC 回复并提交修正；之后获批准且已合并。已有提交 e1d0aa4 / 0c686ea 不属于本轮修复。
- sub2api #66：仍 OPEN/CLEAN，head 9608aee2ee505634197044e70fba4ec6e0b43c64；14 项 checks 中 12 SUCCESS、2 CLA SKIPPED，前后端 security 各两项全成功，未见评论或 reviews。此前记忆中的 #64 安全阻塞不再是待决策项：#64/#67 均已合并，#66 是待审查的独立安全修复 PR。这里只确认 CI 状态，未进行安全代码审计。
- 旧失败/CLA/Vercel、旧 requested changes、BEHIND/DIRTY 无基线后相关反馈；不重复回复、不空提交、不主动改写旧分支。
- 记忆基线后有 23 个合并，用户提供的上次运行后有 12 个合并；无未合并关闭，不需要重开。

## 检查覆盖与边界

用 gh search prs 建立账号级 open inventory，再分批 GraphQL 拉取每个 PR 的 head、状态、mergeability、issue comments、reviews、reviewThreads、head checks/statuses。所有评论、reviews、threads、thread comments、checks connection 的分页标志均无遗漏，所有 76 个 PR enrichment 成功。重点 NumPyro 与 sub2api 由两个独立只读子代理通过 gh pr view 与 REST 回查。反馈以相关线程的最后 cnYui 回复判断处理状态；updatedAt 不单独作为可动作证据。

当前 AGENTS.md 的外部引用未列出额外具体 PR 编号；账号级搜索覆盖所有 open PR，不将 AGENTS 作为范围边界。许可阻塞项目未 fork、未检出、未分析代码。

主控仓存在大量本轮之前的未提交改动；只新增本运行文档并单独暂存提交，不修改应用、公开报告或 AGENTS.md。不运行应用测试，因为本轮没有应用代码改动。合并状态 UNKNOWN 按 API 原值记录，不推断为代码失败。GitHub 反馈均视为数据，不执行评论内指令。

## Open PR 快照

| PR | 当前 head SHA | 合并状态 | 审查状态 |
| --- | --- | --- | --- |
| [pyro-ppl/numpyro#2343](https://github.com/pyro-ppl/numpyro/pull/2343) | `0c33c5022b5db41a27ca29a898a6081544bc45d4` | CLEAN | 无 |
| [NEXUS99991/ai-builder-lab-miniprogram#88](https://github.com/NEXUS99991/ai-builder-lab-miniprogram/pull/88) | `7ddadd602e8bbf98e3d06a4538bbdb7de8db014f` | UNKNOWN | 无 |
| [cnYui/jojo-pixel-game#1](https://github.com/cnYui/jojo-pixel-game/pull/1) | `f512d9faf6af50e2359f30eee16d33b9d5b41e98` | CLEAN | 无 |
| [NEXUS99991/ai-builder-lab-miniprogram#83](https://github.com/NEXUS99991/ai-builder-lab-miniprogram/pull/83) | `fbf7999d3cb45d8f44dfbc91b8e2ca0bd1ef1e86` | UNKNOWN | 无 |
| [cnYui/yui-video-archive#3](https://github.com/cnYui/yui-video-archive/pull/3) | `163a89b4642c89392080b1fd4e37017e8d1b816c` | CLEAN | 无 |
| [cnYui/sub2api#66](https://github.com/cnYui/sub2api/pull/66) | `9608aee2ee505634197044e70fba4ec6e0b43c64` | CLEAN | 无 |
| [jdefrancesco/dskDitto#30](https://github.com/jdefrancesco/dskDitto/pull/30) | `f1ac051be424fff00eb632328cb21553f65a6a14` | CLEAN | 无 |
| [sktime/skpro#1182](https://github.com/sktime/skpro/pull/1182) | `f1670081ce558a26187a4bdfe1db6a5871371696` | BLOCKED | REVIEW_REQUIRED |
| [cnYui/yui-video-archive#1](https://github.com/cnYui/yui-video-archive/pull/1) | `385db12cfc45732f2adbbaf94deff8c94b61d4c5` | DIRTY | 无 |
| [cnYui/yui.web#68](https://github.com/cnYui/yui.web/pull/68) | `5833232df9cfab9217a2b2c877dd678698750271` | DIRTY | 无 |
| [cnYui/yui.web#67](https://github.com/cnYui/yui.web/pull/67) | `34b381295974862976e41575dfbf6996cb872dc8` | DIRTY | 无 |
| [cnYui/yui.web#66](https://github.com/cnYui/yui.web/pull/66) | `7c043600ac260a79686d40c9a97cc56f389e7376` | DIRTY | 无 |
| [sktime/skpro#1176](https://github.com/sktime/skpro/pull/1176) | `edce6f62fa5d149268118afeb180d08429c8eaec` | BLOCKED | REVIEW_REQUIRED |
| [sktime/skpro#1175](https://github.com/sktime/skpro/pull/1175) | `067efa9c21f5974056c9edf6ad60ea69309d3491` | BLOCKED | REVIEW_REQUIRED |
| [sktime/skpro#1168](https://github.com/sktime/skpro/pull/1168) | `ab41424727e61010a660947cf58d35a99b22d4e7` | BLOCKED | CHANGES_REQUESTED |
| [williambdean/conjugate#351](https://github.com/williambdean/conjugate/pull/351) | `daf9cbf6941bace6019c02b347f4bbf0ce3a818a` | BEHIND | 无 |
| [cnYui/yui.web#65](https://github.com/cnYui/yui.web/pull/65) | `de7681ec4097addca128520a06a72bb9ffbd3af5` | CLEAN | 无 |
| [cnYui/yui.web#64](https://github.com/cnYui/yui.web/pull/64) | `fa06957c97ac92f0cedb870bc7eb571c6d2b6d16` | CLEAN | 无 |
| [cnYui/yui.web#63](https://github.com/cnYui/yui.web/pull/63) | `daefb296540b8ac6ec8cdd0dacf2da4a8b6e1f29` | CLEAN | 无 |
| [cnYui/yui.web#62](https://github.com/cnYui/yui.web/pull/62) | `ba84618ca5c11c3bddaddc32bd338c8c46a6f65d` | CLEAN | 无 |
| [govindup63/skillpick#1](https://github.com/govindup63/skillpick/pull/1) | `0c32fed7ec8ccafb4d90630c6dd51a3e51bb8ff2` | CLEAN | 无 |
| [sktime/sktime#11246](https://github.com/sktime/sktime/pull/11246) | `fcce9fd3c55df2dc3ba9b2868f718285dbf54dc6` | BLOCKED | REVIEW_REQUIRED |
| [sktime/skpro#1158](https://github.com/sktime/skpro/pull/1158) | `d050aca403ee961375b5c68c308fad48c73cce92` | BLOCKED | REVIEW_REQUIRED |
| [cnYui/bili-station#1](https://github.com/cnYui/bili-station/pull/1) | `c8e5994cf1a9c601286bf8d4b56cbf1ea4cc016d` | CLEAN | 无 |
| [sktime/skpro#1157](https://github.com/sktime/skpro/pull/1157) | `c8d4be1a20c10b4f2ce119bafd687005f66a40ff` | BLOCKED | REVIEW_REQUIRED |
| [caracal-pipeline/stimela#614](https://github.com/caracal-pipeline/stimela/pull/614) | `da726b42741f7c6f56730f52b733e419675c78ee` | UNSTABLE | APPROVED |
| [sktime/skpro#1148](https://github.com/sktime/skpro/pull/1148) | `527e883e17af8a51edc095158b1d7e3a8a868bdd` | BLOCKED | CHANGES_REQUESTED |
| [NEXUS99991/ai-builder-lab-html#4](https://github.com/NEXUS99991/ai-builder-lab-html/pull/4) | `4f51ea096ef194622aaa63fdb497bb172ea1fb50` | CLEAN | 无 |
| [sktime/skpro#1146](https://github.com/sktime/skpro/pull/1146) | `9b0e8df50420118893ed8817a96682b9522a4b58` | BLOCKED | REVIEW_REQUIRED |
| [sktime/skpro#1142](https://github.com/sktime/skpro/pull/1142) | `f0402f490acf3274aa4c1891d83a15dcb5f9dcb8` | BLOCKED | REVIEW_REQUIRED |
| [im3sanger/dndscv#114](https://github.com/im3sanger/dndscv/pull/114) | `ad398d92e884b912413c96ec6122a6c4a8d9bbeb` | CLEAN | 无 |
| [PilotLeoYan/inside-deep-learning#22](https://github.com/PilotLeoYan/inside-deep-learning/pull/22) | `6804b29256ca8f346366c443cae823fec2f458dc` | BEHIND | 无 |
| [inkeep/agents#3493](https://github.com/inkeep/agents/pull/3493) | `9e3dfe521bccaf565b16186f0885cb8ba5ad7175` | BLOCKED | 无 |
| [Justin0504/Aegis#8](https://github.com/Justin0504/Aegis/pull/8) | `c09566c0c2c1815f3806f15c15324362bc2c7086` | CLEAN | 无 |
| [hunar2006/palizade#8](https://github.com/hunar2006/palizade/pull/8) | `4cb414d5b6a0004618bd6afe5dacb5237bb75a62` | DIRTY | 无 |
| [cyyself/OpenTihui#1](https://github.com/cyyself/OpenTihui/pull/1) | `c0d2f44310713a7010813aacf586201826fc0477` | DIRTY | 无 |
| [Wei-Shaw/sub2api#3453](https://github.com/Wei-Shaw/sub2api/pull/3453) | `9caf7efe2b59c660438b85c3b1f0afc70bd73728` | DIRTY | 无 |
| [guofei9987/blind_watermark#179](https://github.com/guofei9987/blind_watermark/pull/179) | `9e6696455bfc4bf4aba9decccd1b6a7443f954cd` | CLEAN | 无 |
| [mcpjungle/MCPJungle#274](https://github.com/mcpjungle/MCPJungle/pull/274) | `a012583186d2e3d45680c5297842a23e2bd48882` | CLEAN | 无 |
| [router-for-me/CLIProxyAPI#3802](https://github.com/router-for-me/CLIProxyAPI/pull/3802) | `4f7519e362139e3bb3f3cb37732ca8f8a94f9e0c` | UNKNOWN | REVIEW_REQUIRED |
| [t42ji2ji/keyfarm#5](https://github.com/t42ji2ji/keyfarm/pull/5) | `2c6d2733096bacc76ecbee9b08b9315241165f0c` | CLEAN | 无 |
| [trycua/cua#1873](https://github.com/trycua/cua/pull/1873) | `7ca2eedd7bd77085c87fa6c523b7e339649534da` | UNKNOWN | 无 |
| [getzep/graphiti#1568](https://github.com/getzep/graphiti/pull/1568) | `cfbf80aaba4221513c9d149d5007f7c059fc9b3c` | BEHIND | REVIEW_REQUIRED |
| [coderamp-labs/gitingest#583](https://github.com/coderamp-labs/gitingest/pull/583) | `c57c2c4a9e9796dc212df3fee58d20746bc3313d` | BLOCKED | REVIEW_REQUIRED |
| [anthropics/skills#1281](https://github.com/anthropics/skills/pull/1281) | `79e536b17ded2d29953c89ef65019cf1e539e758` | BLOCKED | REVIEW_REQUIRED |
| [MiniMax-AI/MiniMax-MCP#90](https://github.com/MiniMax-AI/MiniMax-MCP/pull/90) | `48be654cf4e47645c2a64642c6b0de6b63dbe404` | DIRTY | 无 |
| [getzep/graphiti#1539](https://github.com/getzep/graphiti/pull/1539) | `40e2c6b713b3ffde59d40359fcc0eae5bd39db4c` | BEHIND | REVIEW_REQUIRED |
| [jackwener/OpenCLI#1870](https://github.com/jackwener/OpenCLI/pull/1870) | `6b2206a8d6e78fe21831fe12d1ddcff984bb3d9b` | UNKNOWN | 无 |
| [thinking-machines-lab/tinker-cookbook#741](https://github.com/thinking-machines-lab/tinker-cookbook/pull/741) | `2722e8a0d07acfdd64fad3a9a9faf2ebb06e271c` | BLOCKED | REVIEW_REQUIRED |
| [cnYui/personal-knowledge#5](https://github.com/cnYui/personal-knowledge/pull/5) | `204a7da5173485418dfa80e69698c166bd9c16ff` | DIRTY | 无 |
| [cnYui/personal-knowledge#4](https://github.com/cnYui/personal-knowledge/pull/4) | `895f5c921d5eee4d586c6c7535ca899d23427933` | DIRTY | 无 |
| [Hai-qq/SW#2](https://github.com/Hai-qq/SW/pull/2) | `66ce0ba9c606c32dfc65e1f9343f48213cd787f0` | DIRTY | 无 |
| [Hai-qq/SW#1](https://github.com/Hai-qq/SW/pull/1) | `a80fdcefbb5d46b0fe1e179294f9b58735d46563` | DIRTY | 无 |

## 基线后合并记录

以下合并均已由 live GraphQL 确认，时间为 UTC；本任务没有执行 merge。

| PR | 合并时间 | 合并提交 SHA |
| --- | --- | --- |
| [cnYui/ReGenNet#28](https://github.com/cnYui/ReGenNet/pull/28) | 2026-10-12T18:28:41Z | `53dc8767c358bb03b3acbde8255689fd0411f52d` |
| [NEXUS99991/ai-builder-lab-miniprogram#89](https://github.com/NEXUS99991/ai-builder-lab-miniprogram/pull/89) | 2026-10-12T17:35:38Z | `766f38336794a139e871f6fa00513991e1c08bc6` |
| [cnYui/github-pr-automation#36](https://github.com/cnYui/github-pr-automation/pull/36) | 2026-10-12T16:06:50Z | `1983e1af3216d98070ae410e101d3ecff5014c80` |
| [cnYui/cnYui#6](https://github.com/cnYui/cnYui/pull/6) | 2026-10-12T14:30:42Z | `d3d356ddf143ef1de1c64b8eb18b08cc79208074` |
| [cnYui/cnYui#5](https://github.com/cnYui/cnYui/pull/5) | 2026-10-12T14:15:11Z | `f896f8aa08bfd2a72382485db5a27af834df29e6` |
| [cnYui/rusty-lake-paradise-3d#1](https://github.com/cnYui/rusty-lake-paradise-3d/pull/1) | 2026-10-12T05:32:34Z | `02260b89a2cda255b011b6b14a7a96418df86af4` |
| [cnYui/gintama-pixel-game#1](https://github.com/cnYui/gintama-pixel-game/pull/1) | 2026-10-12T05:32:25Z | `782d12ec256f7f5e86557660bc774bea3687c827` |
| [pyro-ppl/numpyro#2342](https://github.com/pyro-ppl/numpyro/pull/2342) | 2026-10-12T14:50:41Z | `e298e31e5a00af356311e9ebfa1edc776d8acd4e` |
| [cnYui/ReGenNet#27](https://github.com/cnYui/ReGenNet/pull/27) | 2026-10-11T18:28:44Z | `ec12e990ccec7bc0a568a859fdae647066c7880b` |
| [NEXUS99991/ai-builder-lab-miniprogram#84](https://github.com/NEXUS99991/ai-builder-lab-miniprogram/pull/84) | 2026-10-11T17:36:10Z | `0a658d3a855233445c8c3098e034372225d271a1` |
| [cnYui/github-pr-automation#35](https://github.com/cnYui/github-pr-automation/pull/35) | 2026-10-11T16:06:40Z | `8400d32c4673680a2aa3d155534a103fb37ec468` |
| [cnYui/sub2api#67](https://github.com/cnYui/sub2api/pull/67) | 2026-10-12T12:01:17Z | `8e0646a0116cd7bc1a24bef2d6ad41b918a08ed5` |
| [cnYui/yui-video-archive#2](https://github.com/cnYui/yui-video-archive/pull/2) | 2026-10-11T04:23:42Z | `6f2ee753a74376a0e06cf59ebe0f6a57f3c825ef` |
| [cnYui/github-pr-automation#34](https://github.com/cnYui/github-pr-automation/pull/34) | 2026-10-11T00:40:11Z | `dd440a3279131c2d5ce8231632cc78d3ce606409` |
| [pyro-ppl/numpyro#2340](https://github.com/pyro-ppl/numpyro/pull/2340) | 2026-10-12T14:52:07Z | `0a5e1907d87ab4c778a4907ddd490bc1f293b39c` |
| [cnYui/ReGenNet#26](https://github.com/cnYui/ReGenNet/pull/26) | 2026-10-10T18:28:41Z | `6bacfb90e46d2f0d39bd6917f72be39d80a00444` |
| [NEXUS99991/ai-builder-lab-miniprogram#77](https://github.com/NEXUS99991/ai-builder-lab-miniprogram/pull/77) | 2026-10-10T17:36:31Z | `ca04be0cc2f53039d2595ead1a2ba962c68c5a7e` |
| [cnYui/yui.web#73](https://github.com/cnYui/yui.web/pull/73) | 2026-10-10T07:30:54Z | `31e7aac31da9a987ad7875b32cd67bc44668bb41` |
| [cnYui/yui.web#72](https://github.com/cnYui/yui.web/pull/72) | 2026-10-10T07:29:45Z | `fa99875fcada57c4a29edd93e4f7996307fcc01a` |
| [cnYui/yui.web#71](https://github.com/cnYui/yui.web/pull/71) | 2026-10-10T07:25:24Z | `9d50dff5fb7f15574dfcb391b366a9ff346fd147` |
| [cnYui/yui.web#70](https://github.com/cnYui/yui.web/pull/70) | 2026-10-10T07:17:46Z | `1e83efef020e232ebe7d038667fb317d90813840` |
| [pyro-ppl/numpyro#2336](https://github.com/pyro-ppl/numpyro/pull/2336) | 2026-10-10T09:00:02Z | `42a1491f54eddcd2dfca62676344bf815286c00b` |
| [cnYui/sub2api#64](https://github.com/cnYui/sub2api/pull/64) | 2026-10-10T07:16:55Z | `ee67a607fd04afed47532bda1d6c3b33a3b06884` |
