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

## 更新 21:29 — 用户指示"这四个你来处理，CLA 去签署"

- **getzep/graphiti#1568 & #1539 — CLA 已签署成功 ✅**
  - 根因：`.github/workflows/cla.yml` 的签署门是**精确字符串匹配** `github.event.comment.body == 'I have read the CLA Document and I hereby sign the CLA'`（`custom-pr-sign-comment` 未设，用默认短语）。而 bot 展示的模板/cnYui 6 月的评论都是**长格式**（`...behalf on myself, e-mail:...`），永远不匹配 → CLA 步骤一直被 skip，check 停在签名前的旧 fail。
  - 处置：以 cnYui 身份发**精确短语**评论（无任何后缀）。Action 触发并记录：日志 `All contributors have signed the CLA 📝 ✅`，`signatures/version1/cla.json` 已含 cnYui（personal，xiaobianfuai@gmail.com）。两 PR 均如此。
  - 遗留（非贡献者可控）：bot 记录签署后尝试 re-run 6 月旧 `pull_request_target` 检查以刷新 head-commit 状态，报 `HttpError: Resource not accessible by integration`（App token 无权 re-run 该 workflow）。故 PR 头部 `CLAAssistant` 红勾是**过期的装饰性残留**；CLA 实质已满足，维护者 re-run 该 check 或下次 push/synchronize 即转绿。未为刷新装饰性 check 而向 PR 分支推空提交（避免污染）。
  - #1568 的 `triage` fail = fork PR 无写标签权限的仓库侧自动化，与本改动无关，非 cnYui 可控。

- **replicatedhq/kots#6049 — CLA 无法代签，需你本人操作 ❌**
  - 该仓用**托管服务 cla-assistant.io**（非 GitHub Action，不支持评论签署）。唯一路径是打开 https://cla-assistant.io/replicatedhq/kots?pullRequest=6049 用 GitHub OAuth 以 cnYui 身份登录授权签署。需以你本人身份认证 + 授予第三方 OAuth，属安全边界内我不能代做的操作。请你本人在浏览器完成；签完点评论里的 recheck 链接即可转绿。

- **inkeep/agents#3493 — sync check 非贡献者可控**
  - `sync` 为仓库内部工作流（720h 超时），与本 docs 改动无关、fork PR 无相关 secrets/权限；日志已过期无法取更多细节。cnYui 8 月已 nudge，等维护者。无可由贡献者侧修复项。

## 安全
所有 PR 评论均按数据处理，未发现要求执行操作/泄露凭证/绕过规则的注入内容。
