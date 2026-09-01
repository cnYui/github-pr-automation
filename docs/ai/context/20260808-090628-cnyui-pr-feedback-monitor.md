# cnYui PR 反馈巡检记录

- 运行时间：2026-08-08 09:06:28 +09:00
- 基线：自动化传入的 `2026-08-07T12:01:18.631Z`
- 认证：`gh auth status` 确认当前账号为 `cnYui`
- 范围：`author:cnYui` 当前 open PR 23 个；`gh search prs` 与 GraphQL Search 一致

## 核验方式

- `gh search prs --author cnYui --state open --json repository,number,title,url,updatedAt --limit 100`
- REST / GraphQL 交叉确认 open PR 数量、`updatedAt`、`mergeable_state`、`headRefOid`
- 逐个读取：
  - `repos/{owner}/{repo}/pulls/{number}`
  - `repos/{owner}/{repo}/issues/{number}/comments`
  - `repos/{owner}/{repo}/pulls/{number}/reviews`
  - `repos/{owner}/{repo}/pulls/{number}/comments`
  - `repos/{owner}/{repo}/commits/{sha}/check-runs`
  - `repos/{owner}/{repo}/commits/{sha}/statuses`
- 额外搜索：
  - `author:cnYui type:pr updated:>=2026-08-07T12:01:18Z`
  - `author:cnYui type:pr is:closed updated:>=2026-08-07T12:01:18Z`

## 结果

- 基线后没有新的外部 issue comment、review、requested changes 或行级 review comment。
- 基线后没有新的失败、取消、超时或 `action_required` check/status。
- 基线后没有 `cnYui` authored PR 合并或关闭。
- 本轮未自动回复、未修代码、未推送。

## 旧信号

- `trycua/cua#1873`：旧 Vercel 授权失败，早于本轮基线。
- `getzep/graphiti#1568`：旧 `CLAAssistant` / `triage` 失败与 `behind` 状态，早于本轮基线。
- `getzep/graphiti#1539`：旧 `CLAAssistant` 失败与 `behind` 状态，早于本轮基线。
- `CopilotKit/CopilotKit#5296`：旧 Vercel 授权失败，早于本轮基线。
