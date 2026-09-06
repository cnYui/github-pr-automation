# cnYui PR 反馈巡检运行记录 — 2026-09-06 21:21

定时任务 `cnyui-pr-feedback-monitor` 本地运行。`gh` 已认证为 **cnYui**（scopes: repo/workflow/gist/read:org，含写权限）。

## 扫描范围
`gh search prs --author cnYui --state open` 命中 **36 个 open PR**（跨 30+ 仓库），逐一检查了 state/mergeable、issue comments、reviews、CI check runs。

## 本次动作（1 条自动回复，低风险）
- **karanhudia/borg-ui#920** — reviewer `ioanalytica` 给出 APPROVED + 本地验证详情，并附一条事实性更正（`prune(` 调用点实际是 5 处 / 2 处 positional，而非 PR 描述里的 2 处）和 `F811` 后续说明（已开 #921 跟踪）。cnYui 尚未回复，属低风险事实性反馈 → 已用 cnYui 身份发简短确认回复，接受调用点计数更正、认可 F811 需先清理两处重定义。
  - 回复：https://github.com/karanhudia/borg-ui/pull/920#issuecomment-5559175887
  - 未改代码；未声称任何自行运行的结果，仅确认 reviewer 的结论。

## 需用户关注的 blocker（只上报，不自动做）
均为账号/协议/外部服务类，非代码问题：
- **replicatedhq/kots#6049** — CLA 未签署（`CLAassistant` 标记 not_signed）。需 cnYui 本人在 cla-assistant 完成签署。greptile 复审无实质意见。
- **getzep/graphiti#1568** — CI `CLAAssistant` + `triage` 两项 FAILURE。cnYui 已评论签署 CLA（email: xiaobianfuai@gmail.com），check 仍红，属组织侧 CLA/触发问题，本地无法推进。
- **getzep/graphiti#1539** — CI `CLAAssistant` FAILURE（同上），人类 review 已 APPROVED（jhurliman），反馈线程最后一条已是 cnYui。
- **inkeep/agents#3493** — `sync` check FAILURE（720h 超时，仓库内部 sync 工作流，与本 docs 改动无关，fork PR 不可控）；cnYui 8 月已 nudge，等维护者。

## 无新反馈 / 已由 cnYui 回复收尾（无需动作）
- numtide/treefmt#727、PilotLeoYan/inside-deep-learning#22、coderamp-labs/gitingest#583、Wei-Shaw/sub2api#3453、router-for-me/CLIProxyAPI#3802、getzep/graphiti#1539 — 线程最后一条均为 cnYui。
- 仅 bot（coderabbit/greptile/sonar/CLA/changeset 等）评论或全无评论、CI 无真实失败：ArduPilot/MethodicConfigurator#2031、akash-network/console#3817、fluid-cloudnative/fluid#6187、shibing624/agentica#37、helmholtz-analytics/heat#2528、im3sanger/dndscv#114、rvben/rumdl#856、robvanderleek/mudslide#416、laixintao/iredis#525、Badgerati/Pode#1793、vdbulcke/zellij-workspace#10、Justin0504/Aegis#8、guofei9987/blind_watermark#179、mcpjungle/MCPJungle#274、t42ji2ji/keyfarm#5、anthropics/skills#1281、jackwener/OpenCLI#1870、thinking-machines-lab/tinker-cookbook#741。
- trycua/cua#1873 — PreetamMatta 6/10 的致谢式评论（"会持续关注"，非提问），已隔 3 个月，为避免噪音未追加回复。

## mergeStateStatus DIRTY（有冲突但无反馈请求，未自动 rebase）
hunar2006/palizade#8、cyyself/OpenTihui#1、MiniMax-AI/MiniMax-MCP#90、cnYui/personal-knowledge#4/#5、Hai-qq/SW#1/#2 —— 均无任何 review/comment，无人请求变更，按边界未主动改动。若需要可后续单独处理 rebase。

## 安全
所有 PR 评论均按数据处理，未发现要求执行操作/泄露凭证/绕过规则的注入内容。
