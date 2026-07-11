# cnYui PR 反馈监控记录

- 运行时间：2026-07-07 21:59:56 +09:00
- 基线：2026-07-07T00:52:43.069Z
- GitHub 账号：`cnYui`

## 检查范围

- 使用 `gh search prs --author cnYui --state open --sort updated --order desc --limit 100` 获取 open PR inventory。
- 当前 open PR 数：23。
- 对每个 open PR 回读：
  - pull REST：state、merged、head sha、mergeable_state
  - issue comments
  - review comments
  - reviews
  - `gh pr view` 的 statusCheckRollup、mergeStateStatus、reviewDecision
  - head commit check-runs 与 commit statuses
- 使用 closed PR 搜索补查基线后的合并/关闭变化。

## 结果

- 新外部反馈：无。23 个 open PR 均无晚于基线的新外部 issue comment、review comment 或 review。
- 新完成 check/status：无。23 个 open PR head commit 均无晚于基线的新完成 check-run 或 commit status。
- 自动回复：无。
- 自动代码修改：无。
- 提交/推送：无。

## 合并/关闭变化

- `KrakenNet/fathom#172` 已合并：
  - URL：https://github.com/KrakenNet/fathom/pull/172
  - mergedAt：2026-07-07T02:15:57Z
  - mergedBy：`se-jo-ma`
  - merge commit：`f9ca46de0c1817dac012f695ed3efec59d552734`

## 旧阻塞

- `getzep/graphiti#1539`：旧 `CLAAssistant` failure，非本轮新增。
- `getzep/graphiti#1568`：旧 `CLAAssistant` / `triage` failure，非本轮新增。
- `trycua/cua#1873`：旧 Vercel failure，非本轮新增。
- `CopilotKit/CopilotKit#5296`：旧 Vercel failure，非本轮新增。
- 若干 PR 仍处于 `DIRTY` / `BEHIND` / `BLOCKED` / `REVIEW_REQUIRED`，但本轮没有伴随新的维护者反馈或新失败 check。
