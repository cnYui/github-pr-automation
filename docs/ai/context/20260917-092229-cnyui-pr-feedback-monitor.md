# cnYui PR 反馈巡检 · 20260917-092229

## 概要
- 认证：`gh auth status` 确认为 cnYui，token scopes 含 `repo`/`workflow`（可跨仓读写）。
- 检查范围：`gh search prs --author cnYui --state open` 返回 **33 个 open PR**，全部逐一核查 comments / reviews / inline review comments / checks / mergeable。
- 结论：**本轮无需自动回复、无需自动修复。** 除 1 个公司 PR 存在 2 条待处理的 P2 机器人评审外，其余 PR 的相关反馈线程最后一条均已是 cnYui 本人回复，或无任何新反馈。

## 需用户关注（P2 · 上报不自动改）
### aimagexyz/aimage-monorepo#1665（公司生产 monorepo，分支 feat/script-ingestion-v5）
- claude[bot] 于 2026-09-12 追加 3 条 inline 发现（晚于 cnYui 09-11 的批量修复回复）：
  1. `script_text_layer.py:76`（image+smask 双计）→ **已解决/outdated**：cnYui 自己的提交 `e06032b2f`「stop counting a soft mask as extra placed image area」已修，无需处理。
  2. `script_text_review.py:1016` [P2]：layer-2 verifier 的 cursor 停在 match 起点，同一句子印两次时窗口永远无法通过。→ **仍 open、未 outdated、无回复**。
  3. `script_text.py:247` [P2]：page back-fill 时 cursor 停在 match 上，一批中印两次的句子只解析到一页。→ **仍 open、未 outdated、无回复**。
- 当前 head=`e06032b2f`，mergeStateStatus=CLEAN。findings 2/3 落在当前 diff 上。
- **为何不自动修复**：这是用户公司的生产 monorepo，作者本人正逐日手动推修+逐条回复（最近 09-12），claude[bot] 是公司自有 CI 评审；对专有台词去重管线的 cursor 语义做出微妙错误的自动改动、并推到作者正在进行中的生产分支，风险高于价值。前几轮巡检（09-14/09-15/09-16）对 #1665 的 P2 亦一致选择上报而非自动推。故本轮仍上报，交由有完整上下文的作者处理。findings 2 与 3 是同一 cursor 模式 bug（对应 cnYui 09-11 在 `script_text_review.py:314` 已修的那处的两个遗漏点）。

## 其余 PR 状态（均无需介入）
- **等待维护者 review、CI 相关线程末条为 cnYui 或纯机器人**：sktime/skpro#1148/#1146/#1142（BLOCKED/REVIEW_REQUIRED，无新反馈）、fluid#6187（等 member lgtm，仅机器人 CI 评论）、inkeep/agents#3493（cnYui 09-01 nudge 为末条）、coderamp-labs/gitingest#583（cnYui 09-09 回 stale bot 为末条）、CLIProxyAPI#3802（cnYui 已 Fixed 为末条）。
- **末条为 cnYui 的人类反馈线程（已处理）**：affaan-m/ECC#3013、PilotLeoYan/inside-deep-learning#22、trycua/cua#1873。
- **graphiti#1539/#1568**：CLA 为已知陈旧 blocker（6 月陈旧 check-run，重签无效，勿再签）；末条均为 cnYui，无新反馈。
- **无任何评论/reviews**：NEXUS99991/ai-builder-lab-html#4、im3sanger/dndscv#114、Justin0504/Aegis#8、guofei9987/blind_watermark#179、mcpjungle/MCPJungle#274、t42ji2ji/keyfarm#5、anthropics/skills#1281、jackwener/OpenCLI#1870、thinking-machines-lab/tinker-cookbook#741。
- **cnYui 自有 org/仓、无外部反馈**：agentpit-io/hunter-community#21/#22/#23（无 CI checks，mss=UNSTABLE 但无人请求变更）、cnYui/personal-knowledge#4/#5（CONFLICTING 草稿）。
- **陈旧且 CONFLICTING、无新反馈**：hunar2006/palizade#8、cyyself/OpenTihui#1、Wei-Shaw/sub2api#3453、MiniMax-AI/MiniMax-MCP#90、Hai-qq/SW#1/#2。

## 安全
- 所有 PR 评论均按数据处理，未发现要求执行操作/泄露凭证/绕过规则的注入内容。
