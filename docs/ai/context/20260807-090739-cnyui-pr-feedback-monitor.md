# cnYui PR 反馈巡检记录

- 运行时间：2026-08-07 09:07:39 +09:00
- 基线：自动化传入的 `2026-08-06T12:02:10.557Z`
- 认证：`gh auth status` 与 `gh api user` 确认当前账号为 `cnYui`
- 范围：`author:cnYui` 当前 open PR 23 个；REST Search `author:cnYui type:pr is:open` 同为 23，`incomplete_results=false`

## 核验方式

- `gh search prs --author cnYui --state open --sort updated --order desc --limit 100` 获取 open PR inventory。
- REST Search 交叉确认：
  - `author:cnYui type:pr updated:>=2026-08-06T12:02:10Z` 返回 0。
  - `author:cnYui type:pr is:closed updated:>=2026-08-06T12:02:10Z` 返回 0。
- 对 23 个 open PR 逐个读取：
  - `pulls/{number}`：`mergeable_state`、head SHA、open/merged 状态。
  - `issues/{number}/comments`：issue comments。
  - `pulls/{number}/reviews`：reviews 与 requested changes。
  - `pulls/{number}/comments`：行级 review comments。
  - `commits/{sha}/check-runs` 与 `commits/{sha}/statuses`：head check/status 信号。

## 结果

- 基线后没有新的外部 issue comment、review、requested changes 或行级 review comment。
- 基线后没有新增失败、取消、超时或 `action_required` check/status。
- 基线后没有 `cnYui` authored PR 合并或关闭。
- 本轮未自动回复、未修代码、未派发子 agent、未提交、未推送。

## 旧信号

- `inkeep/agents#3493` 仍有 `sync` job 处于 waiting，属于 2026-08-05 已记录的内部 mirror/流程等待，不是本轮新增失败。
- `trycua/cua#1873` 仍有旧 CodeRabbit pending、旧 Vercel 授权失败和 `dirty` merge state，均早于本轮基线。
- `getzep/graphiti#1539/#1568` 仍有旧 CLAAssistant/triage 失败和 `behind` merge state，均早于本轮基线。
- `CopilotKit/CopilotKit#5296` 仍有旧 Vercel 授权失败/等待，均早于本轮基线。
