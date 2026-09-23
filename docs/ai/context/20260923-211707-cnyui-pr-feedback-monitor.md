# cnYui PR 反馈巡检运行记录

- 运行时间：2026-09-23 21:17（本地）
- 认证：gh 已认证为 cnYui，token scopes 含 repo/workflow，具备跨仓写权限。
- 范围：`gh search prs --author cnYui --state open` 共 **41** 个 open PR，全部核验最新反馈 / review / CI / mergeable 状态。

## 本轮处理（1 个 · 高风险自动修复已完成）

### pyro-ppl/numpyro#2284 — Gompertz 分布数学文档
- 链接：https://github.com/pyro-ppl/numpyro/pull/2284
- 反馈：维护者 **@Qazalbash** 于 2026-09-23 提交 CHANGES_REQUESTED review，附 5 条 GitHub suggestion（inline），内容为把数学公式中的分隔符 `\mid` 统一改为 `;`（PDF / CDF / log-pdf / inverse-CDF 共 5 处）。
- 处理：在临时 work 目录 `gh pr checkout` 检出分支 `doc/gh-2187-gompertz`，用 Python 精确替换 5 处 ` \mid \eta, b)` → ` ; \eta, b)`，与 5 条 suggestion 逐字一致。
- 验证：
  - `git diff --numstat` = `5 5`（仅这 5 行改动，无多余空白/行尾噪声）。
  - `python -c "import ast; ast.parse(...)"` → AST OK。
  - 推送后 `gh api .../commits/fc13e49`：`verified=true`、`reason=valid`、`author=cnYui`（SSH 签名有效）。
- 提交：`fc13e49`（signed），push 到 cnYui fork 分支 `doc/gh-2187-gompertz`。
- 回复：已在 PR 留言告知已应用全部 5 条 suggestion（issuecomment-5794639195）。

## 已核验但无需动作

- **APPROVED 待合并**：caracal-pipeline/stimela#614（已 APPROVED；CI build 全失败但根因是仓库 test 文件既有 ruff lint 错误 UP006/B006/RUF100/PLW1510，与本 docs PR 无关，非本 PR 引入，不属修复范围）。
- **等待维护者 review（REVIEW_REQUIRED/BLOCKED，无新反馈）**：sktime/sktime#11246、sktime/skpro#1158/#1157/#1148/#1146/#1142、govindup63/skillpick#1。
- **本人自有仓 PR（无外部 reviewer/无新评论）**：cnYui/yui.web#62/#63/#64/#65、cnYui/bili-station#1、cnYui/personal-knowledge#4/#5。
- **恒定 blocker / 已签 CLA / 陈旧（无新反馈）**：Wei-Shaw/sub2api#3453（CLA 已签，最后一条为 cnYui 签署）、getzep/graphiti#1539/#1568（6 月陈旧 CLA check，重签无效）、以及其余更早未变动的跨仓 PR（fluid#6187、gitingest#583、cua#1873、CLIProxyAPI#3802、ECC#3013、dndscv#114、inside-deep-learning#22、inkeep#3493 等，updatedAt 均早于上轮巡检，无新增反馈线程）。

## Blocker（需用户关注）

无。本轮唯一新反馈（numpyro#2284）已自动修复并回复。

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
