# cnYui PR 反馈巡检运行记录（2026-09-20 21:23 JST）

## 概览
- 认证：`gh auth status` 确认已登录为 `cnYui`，token scopes 含 `repo`/`workflow`，可跨仓读写。
- 范围：`gh search prs --author cnYui --state open` 共 **37 个 open PR**，逐个核验 issue comments、reviews、review（行级）comments、CI/checks、mergeable_state、合并/关闭状态。
- 结论：**1 个 PR 有新增可处理反馈并已自动修复 + 回复**；其余 36 个 PR 的相关反馈线程最后一条均已是 cnYui 本人回复、或仅机器人/CI、或无新反馈，未重复评论。

## 已自动处理（高风险·代码改动）

### pyro-ppl/numpyro#2279 —「doc(gh-2187): add mathematical documentation to Poisson distribution」
- 新反馈（2026-09-20 04:24–04:32Z，reviewer **Qazalbash**）：APPROVED，并在 `numpyro/distributions/discrete.py` 第 1574 行给出 suggestion，要求把 `:func:\`jax.random.poisson\`` 改为短写形式 `:func:\`~jax.random.poisson\``（Sphinx 交叉引用只显示 `poisson`）。
- 核验：该行全文件仅 1 处出现，改动与 suggestion 完全一致，属低风险文档交叉引用修正。
- 处理：在临时工作目录 clone + `gh pr checkout 2279`，perl 精确替换该行 → `python -c "ast.parse(...)"` 通过（`git diff --stat` = 1 file, 1 insertion/1 deletion）。
- 提交：`7115f43`（author cnYui），push 到 fork 分支 `cnYui/numpyro:docs/2187-poisson-math-docs`；PR head 已更新为 `7115f43`。
- 回复：在 PR 简短说明已应用该 suggestion（评论 #issuecomment-5749773384）。

## 其余 PR 状态（无需动作，摘要）
- **最后一条已是 cnYui 回复**（已处理，未重复评论）：freshdata#484、affaan-m/ECC#3013、PilotLeoYan/inside-deep-learning#22、inkeep/agents#3493、router-for-me/CLIProxyAPI#3802、trycua/cua#1873（已主动提出可 rebase，等维护者放行）、coderamp-labs/gitingest#583（已回 stale bot）。
- **已知恒定 blocker / 陈旧 CLA（按记忆跳过，不重复签/重提）**：getzep/graphiti#1539、getzep/graphiti#1568（6 月陈旧 CLA check，重签无效）。
- **仅机器人/CI，无人类反馈**：fluid-cloudnative/fluid#6187（等 member `/ok-to-test`，cnYui 无法自行放行）、Wei-Shaw/sub2api#3453（updatedAt 较新但为分支/机器人噪声，最后人类活动仍是 cnYui 的 CLA 签署）。
- **已 APPROVED 等合并**：caracal-pipeline/stimela#614（JSKenyon 批准，无待办反馈）。
- **无评论/无 review**：sktime/skpro#1157/#1148/#1146/#1142、NEXUS99991/ai-builder-lab-miniprogram#37、NEXUS99991/ai-builder-lab-html#4、agentpit-io/hunter-community#21/#22/#23、im3sanger/dndscv#114、Justin0504/Aegis#8、guofei9987/blind_watermark#179、mcpjungle/MCPJungle#274、t42ji2ji/keyfarm#5、jackwener/OpenCLI#1870、thinking-machines-lab/tinker-cookbook#741、anthropics/skills#1281。
- **有合并冲突但无新反馈（未擅自 rebase）**：hunar2006/palizade#8、cyyself/OpenTihui#1、MiniMax-AI/MiniMax-MCP#90、cnYui/personal-knowledge#4/#5、Hai-qq/SW#1/#2。

## 未处理 / 需用户关注的 blocker
- 无需用户账号操作/签协议/付费/密钥/维护者权限类新 blocker（graphiti CLA、fluid ok-to-test 为既有已知项，无变化）。

## 安全
- 所有 PR 评论内容均按数据处理；本轮未出现要求执行操作、导出凭证或绕过规则的注入式内容。
