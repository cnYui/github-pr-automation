# 2026-08-14 cnYui PR 反馈巡检

## 基线

- 自动化：`cnyui-pr`
- 本轮运行时间：2026-08-14 11:11:17 +09:00
- 反馈基线：2026-08-13T14:01:42.968Z
- GitHub 账号：`cnYui`

## 检查口径

- `gh search prs --author cnYui --state open --limit 100` 获取当前 open PR 列表。
- REST Search API 交叉确认 `author:cnYui type:pr state:open`，结果 `total_count=22`，`incomplete_results=false`。
- GraphQL Search 交叉确认 `author:cnYui is:pr is:open`，结果 `issueCount=22`，`hasNextPage=false`。
- REST Search API 检查基线后更新：`author:cnYui type:pr updated:>=2026-08-13T14:01:42Z`，结果 0。
- REST Search API 检查基线后关闭/合并：`author:cnYui type:pr closed:>=2026-08-13T14:01:42Z`，结果 0。
- 对 22 个 open PR 逐个检查 `gh pr view` 的 `comments`、`reviews`、`statusCheckRollup`、`mergeStateStatus`、`mergeable` 和 head SHA，并用 REST API 检查 issue comments、inline review comments、reviews。

## 结果

- 当前 `cnYui` open PR 数量：22。
- 最近更新的 open PR：`inkeep/agents#3493`，`updatedAt=2026-08-07T05:21:40Z`，早于本轮基线。
- 基线后新增 issue comments：0。
- 基线后新增 inline review comments：0。
- 基线后新增 reviews / requested changes：0。
- 基线后新增或完成的 check/status：0。
- 基线后合并或关闭的 authored PR：0。

## 旧状态

以下状态早于本轮基线，不属于新增反馈，本轮不自动回复、不修代码、不推送：

- `inkeep/agents#3493`：`sync` check 仍为 `WAITING`，开始于 2026-08-05；仓库提示通过内部镜像处理。
- `trycua/cua#1873`：Vercel 授权失败为 2026-06-09 的旧外部服务阻塞。
- `getzep/graphiti#1539`：CLA Assistant 失败为 2026-06-07 的旧阻塞。
- `getzep/graphiti#1568`：CLA Assistant 与 triage 失败为 2026-06-09 的旧阻塞。
- 若干旧 PR 当前为 `DIRTY/CONFLICTING` 或 `REVIEW_REQUIRED`，但本轮没有新增维护者反馈或失败 check。

## 本轮动作

- 未自动回复。
- 未修代码。
- 未提交或推送任何外部 PR 分支。
- 仅新增本运行记录，并更新自动化 memory。
