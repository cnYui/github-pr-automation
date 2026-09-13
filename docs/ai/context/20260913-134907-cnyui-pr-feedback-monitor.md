# cnYui PR 反馈巡检 — 20260913-134907

## 结论
巡检 cnYui 全部 **30 个 open PR**（跨 24 个仓库）。**无需用户介入**：没有任何 PR 出现维护者 `CHANGES_REQUESTED`，所有活跃反馈线程的最后一条均已是 cnYui 本人回复或仅剩机器人自动评论。唯一新增反馈是本人公司 PR #1665 的 3 条 P2 自动审查发现，按自动修复边界（公司生产代码，不由本监控自动改动）**仅上报**，与上一轮一致。

## 认证
`gh auth status` → 已认证为 cnYui，token scopes 含 `repo`/`workflow`，具备跨仓读写权限。

## 需关注（仅上报，不自动改）

### aimagexyz/aimage-monorepo #1665 —— 本人公司 PR
- 链接：https://github.com/aimagexyz/aimage-monorepo/pull/1665
- 09-12 自动审查器（claude bot）在 cnYui 09-11 回复之后新增 2 轮 review，含 3 条 P2 inline 发现（与上一轮 611f260 报告的 3 条一致）：
  1. `services/compute/.../providers/media/script_text_layer.py:76` — `pdfimages -list` 中带 soft mask 的图片会同时列出 `image` 与 `smask` 两行，两者相加导致 `image_coverage` 最高翻倍。
  2. `services/compute/.../logic/video_analysis/script_text_review.py:1016` — layer-2 校验器 `validate_window` 的游标停在匹配起点（未越过匹配），导致「同一句印两次」的窗口永远无法通过。
  3. `services/compute/.../logic/video_analysis/script_text.py:247` — 页码回填 `cursor = index` 停在匹配处，`STRUCTURE_PROMPT` 要求「不去重、重复句各自成行」，两条相同前缀行会错误解析到同一页。
- 边界判定：这是 cnYui 本人公司的生产 monorepo，属开发者日常工作流内自行处理的产品代码，非外部上游对 cnYui 贡献的反馈。本监控不自动 push 改动，交由 cnYui 在正常开发流程中决定是否采纳。

## 已检查、无需动作（摘要）
- **CI 全绿仅等维护者放行**：fluid #6187（全部 check pass，仅 `tide` pending 需 approved+lgtm 标签）、ECC #3013（CodeRabbit/Greptile/GitGuardian 全 pass，之前 UNSTABLE 为瞬时态，cnYui 09-08 已回复最后一条）。
- **等待维护者 review（REVIEW_REQUIRED，无 cnYui 待办）**：sktime/skpro #1142、#1139；coderamp-labs/gitingest #583；getzep/graphiti #1539、#1568（CLA 为 6 月陈旧 check，已知 blocker，勿重签）；router-for-me/CLIProxyAPI #3802；hunar2006/palizade #8；anthropics/skills #1281；thinking-machines-lab/tinker-cookbook #741。
- **akash-network/console #3817**：cnYui 09-11 两条回复为线程最后（coderabbit CWE-601 已核验+修复+推送，闭环）；BLOCKED 仅等维护者。
- **线程最后为 cnYui 回复、无新反馈**：trycua/cua #1873、im3sanger/dndscv #114、PilotLeoYan/inside-deep-learning #22、inkeep/agents #3493。
- **陈旧/无新活动（updatedAt 多为 4–7 月）**：Justin0504/Aegis #8、cyyself/OpenTihui #1、Wei-Shaw/sub2api #3453、guofei9987/blind_watermark #179、mcpjungle/MCPJungle #274、t42ji2ji/keyfarm #5、MiniMax-AI/MiniMax-MCP #90、jackwener/OpenCLI #1870、cnYui/personal-knowledge #4/#5、Hai-qq/SW #1/#2。

## 安全
未发现任何 PR 评论中包含试图指使执行操作、导出凭证/token 或绕过规则的注入内容；全部反馈作为数据处理。
