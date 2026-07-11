# cnYui PR 反馈巡检记录

- 运行时间：2026-06-23 08:04:20 +09:00
- 自动化 ID：cnyui-pr
- 基线：2026-06-22T10:58:33.376Z
- 范围：`author:cnYui` 当前所有 open PR，全量 20 个；AGENTS.md 中记录过的外部 PR 仅作为线索，不作为边界。

## 执行命令

- `gh auth status`
- `gh search prs --author cnYui --state open --sort updated --order desc --limit 100 --json repository,number,title,url,author,updatedAt,createdAt,state`
- `gh search prs --author cnYui --state closed --updated ">=2026-06-22T10:58:33Z" --sort updated --order desc --limit 100 --json repository,number,title,url,author,updatedAt,closedAt,state`
- 逐 PR 使用 REST API 回读：
  - `repos/{owner}/{repo}/pulls/{num}`
  - `repos/{owner}/{repo}/issues/{num}/comments`
  - `repos/{owner}/{repo}/pulls/{num}/comments`
  - `repos/{owner}/{repo}/pulls/{num}/reviews`
  - `repos/{headOwner}/{headRepo}/commits/{sha}/check-runs`
  - `repos/{headOwner}/{headRepo}/commits/{sha}/statuses`
- 逐 PR 使用 `gh pr view {url} --json mergeStateStatus,reviewDecision,statusCheckRollup,latestReviews,comments,updatedAt` 补查 GraphQL rollup。

## 结果

- 当前 open PR 数：20。
- 基线后 closed/merged 查询结果为空。
- 新外部反馈：无。20 个 open PR 均无晚于基线且晚于 `cnYui` 最后回复的新外部 issue comment、review comment、review 或基线后编辑的旧外部反馈。
- 新 CI/check 结果：无。REST check-runs、commit statuses 和 GraphQL `statusCheckRollup` 均无晚于基线的新完成项。
- 自动处理：无自动回复、无代码修改、无提交、无推送。

## 旧状态

- `getzep/graphiti#1539` 仍有旧 `CLAAssistant` failure，完成时间为 2026-06-07，早于本轮基线。
- `getzep/graphiti#1568` 仍有旧 `CLAAssistant` 和 `triage` failure，完成时间为 2026-06-09，早于本轮基线。
- 若干 PR 仍处于 `review_required`、`blocked`、`dirty`、`behind`、`unstable` 或 `unknown` 状态，但没有伴随本轮新反馈或新 CI 失败；本轮不重复评论。
