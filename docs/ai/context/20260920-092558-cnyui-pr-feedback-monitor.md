# cnYui PR 反馈巡检运行记录（20260920-092558）

## 结论
本轮巡检 **36 个 open PR**，全部核验完毕：**无新增可处理的反馈**。所有相关反馈线程的最后一条均已是 cnYui 本人回复，或 PR 正处于等待维护者 review（BLOCKED / REVIEW_REQUIRED，CI 全绿），或属 cnYui 自有仓库无外部反馈。本轮**未评论、未改代码、未推送任何 PR 分支**。

## 核验方法
- `gh auth status` 确认为 cnYui，token scopes 含 `repo`/`workflow`，具跨仓写权限。
- `gh search prs --author cnYui --state open --limit 100` 拉取全部 open PR。
- 逐个核验 issue comments / review comments / reviews 的最后作者与时间、`reviewDecision`、`mergeStateStatus`、`gh pr checks`。
- 全量 `reviewDecision` 扫描：**无任何 PR 处于 `CHANGES_REQUESTED`**。

## 状态分布
- **APPROVED（等待合并）**：caracal-pipeline/stimela#614（维护者 JSKenyon 已批准；CI 红为无关 ruff 升级 lint，已知，无需动作）。
- **REVIEW_REQUIRED（等待维护者 review，CI 通过）**：sktime/skpro #1142/#1146/#1148/#1157、fluid-cloudnative/fluid#6187（全 check 通过，tide 待 lgtm 标签）、getzep/graphiti #1539/#1568（CLA 为 6 月陈旧 check，重签无效，已知）、router-for-me/CLIProxyAPI#3802、coderamp-labs/gitingest#583、anthropics/skills#1281、thinking-machines-lab/tinker-cookbook#741、hunar2006/palizade#8。
- **最后一条为 cnYui 回复（已处理）**：FreshCode-Org/freshdata#484、affaan-m/ECC#3013、PilotLeoYan/inside-deep-learning#22、inkeep/agents#3493、trycua/cua#1873（人类 PreetamMatta 06-10 评论，cnYui 09-07 已回）。
- **无任何评论/反馈**：Hai-qq/SW #1/#2、Justin0504/Aegis#8、MiniMax-AI/MiniMax-MCP#90、NEXUS99991/ai-builder-lab-html#4、guofei9987/blind_watermark#179、mcpjungle/MCPJungle#274、im3sanger/dndscv#114、cyyself/OpenTihui#1、jackwener/OpenCLI#1870、t42ji2ji/keyfarm#5。
- **cnYui 自有仓库 PR（自管，无外部反馈）**：NEXUS99991/ai-builder-lab-miniprogram#37（CI 全绿）、agentpit-io/hunter-community #21/#22/#23（自有 org，UNSTABLE 但无评论/无 required check 失败）、cnYui/personal-knowledge #4/#5。

## 需用户关注（非反馈回复，只上报）
- **Wei-Shaw/sub2api#3453**：`mergeStateStatus=DIRTY`（与 base 存在合并冲突），32 commits、100+ 文件，混入大量 cnYui 私有部署文档（docs/ai/context/*、backend 内部改动），标题却是「[codex] update usage guide for 99 yuan plan」。自 6 月起停滞，无维护者互动。该 PR 范围明显不适合上游合并，属**产品/方向决策 + 大范围**，按自动修复边界只上报不自动处理。**建议 cnYui 直接 close 此 PR**（其内容为下游私有工作，误提到上游仓）。

## 安全
本轮所有 PR 评论/反馈内容均按数据处理，未发现要求执行操作、导出凭证或绕过规则的注入内容。
