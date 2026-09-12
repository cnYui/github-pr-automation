# cnYui PR 反馈巡检 — 20260912-094500

`gh` 认证为 **cnYui**（keyring，scopes 含 `repo`/`workflow`），具备跨仓读写权限。

## 概况
`gh search prs --author cnYui --state open` 共 **30** 个 open PR，全部检查完毕。**无需本任务介入的新反馈**：唯一一条 24h 内未被 cnYui 回复的反馈在他**本人正在开发的公司 PR（#1665）** 上，按边界只上报不自动改。其余活跃线程最后一条均为 cnYui 本人回复且 CI 通过或在等维护者。

## 需用户关注

### 1. aimagexyz/aimage-monorepo#1665（本人公司 PR，今日活跃）— 仅上报
- 分支 `feat/script-ingestion-v5`，head `e06032b2`，所有 CI 通过，mergeStateStatus CLEAN。
- 今日（09-12）自动化 `claude` review bot 新增 3 条 **P2** 内联发现（cnYui 尚未回复）：
  1. `script_text_layer.py` — `image` 与 `smask` 相加重复计同一放置区域，`image_coverage` 可达真实值 2×。
  2. `script_text_review.py:1016` — layer-2 verifier 游标停在 match **起点**，某窗口内同一句打印两次时永远无法通过。
  3. `script_text.py:247` — 页面回填后游标停在 match 上，一个 batch 内同句打印两次会解析成一页。
- **未自动修复的原因**：这是 cnYui 本人日间在职工作的 in-progress PR（今日 09:48 仍在更新），非我方代维的开源贡献。自动 push 会与其本人实时改动冲突，属步骤 7「不踩用户活跃工作」边界。发现已内联可见，留给本人处理。

## 已确认闭环（最后一条为 cnYui 回复 / CI 通过 / 等维护者，无新反馈）
- **akash-network/console#3817** — 所有 check pass；cnYui 09-11 12:33 已回复并修复 coderabbit 报的开放重定向（CWE-601）；12:33 之后无任何新评论。BLOCKED=等维护者放行。
- **affaan-m/ECC#3013** — 三项 check（CodeRabbit/GitGuardian/Greptile）现全 pass（此前 UNSTABLE 已恢复）；cnYui 09-08 已回复 Greptile P2。
- **coderamp-labs/gitingest#583** — cnYui 09-09 已回复 stale bot 保持开放。
- **PilotLeoYan/inside-deep-learning#22** — cnYui 09-06 已回复维护者（对方在重写章节）。
- **trycua/cua#1873** — cnYui 09-07 已回复维护者（对方将跟进）。
- **getzep/graphiti#1539 / #1568** — CLA check 为 6 月陈旧 check-run，重签无效（见记忆），已停止重复签；无新维护者反馈。
- **fluid-cloudnative/fluid#6187** — 仅 bot 评论；等 fluid-cloudnative member 的 ok-to-test / 审批，cnYui 无可操作项。
- **router-for-me/CLIProxyAPI#3802** — cnYui 06-11 已回复并修复，等审。
- **sktime/skpro#1142 / #1139** — 无评论/review，等审。
- 其余 dormant PR（Aegis#8、palizade#8、OpenTihui#1、sub2api#3453、blind_watermark#179、MCPJungle#274、keyfarm#5、anthropics/skills#1281、MiniMax-MCP#90、OpenCLI#1870、tinker-cookbook#741、Hai-qq/SW#1/#2）— 无新反馈，等维护者审。

## 本次操作
- 未做任何自动回复或自动修复（无符合条件的低风险问询；唯一高风险候选为本人活跃工作，按边界不动）。
- 未执行破坏性操作；未触碰用户任何未提交改动。
