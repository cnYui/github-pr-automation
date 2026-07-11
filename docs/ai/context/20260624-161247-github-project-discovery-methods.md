# GitHub 好项目发现方法调研

## 背景

用户要求联网搜索是否有更好的 GitHub 项目发现方法。当前目标不是提交 PR，也不是修改日报扫描器，而是补充可用于后续筛选项目的方法。

## 结论

更稳的项目发现不应只依赖 GitHub Trending 或 Star 数。推荐采用三层漏斗：

1. 热度入口：GitHub Trending、OSSInsight Trending、GitHub Search。
2. 数据校验：GitHub REST/GraphQL、GH Archive、ecosyste.ms。
3. PR 可行性判断：维护活跃度、issue/PR 去重、CI 可跑性、贡献规则、是否有明确小切口。

## 可用来源

- GitHub Search 支持 `stars:`、`forks:`、`pushed:`、`created:`、`language:`、`topic:`、`archived:false`、`good-first-issues:`、`help-wanted-issues:` 等限定符，适合做初筛。
- GitHub Trending 适合找当天社区关注项目，但容易被短期营销、README 项目和不可贡献项目污染。
- OSSInsight Trending 按社区活动排序，并提供 today/week/month/3 months 视角，适合做 Trending 的替代或补充。
- GH Archive 提供 GitHub 公开事件小时级归档，可用来计算 24h/7d star、fork、issue、PR、push 增量。
- ecosyste.ms 提供 repository、dependency、license、issue/PR、timeline 等开放数据，适合做供应链、依赖和维护健康度校验。

## 推荐评分

初筛分：

- 近期热度：24h / 7d star 增量、fork 增量、社区讨论。
- 维护健康：最近 push、最近 release、issue 响应、PR merge 频率、maintainer 是否回复外部贡献者。
- 可贡献性：存在文档缺口、测试缺口、小 bug、CI/type/lint 失败、示例缺口。
- 风险控制：有无 CLA、DCO、贡献者门禁、需要先开 issue、CI 是否对 fork 开放。
- 去重：同 issue 是否已有 open PR，main 是否已修复，是否已有 maintainer 明确方向。

## 后续可执行方案

下一步如果要落到扫描器，建议新增一个 `discovery_sources` 层：

- `github_search`: 多组 topic/query 搜索，按 `stars`、`updated`、`help-wanted-issues` 拉候选。
- `trending`: GitHub Trending 与 OSSInsight Trending 合并去重。
- `event_delta`: 用 GH Archive 或 OSSInsight 数据计算近 24h/7d 活动增量。
- `ecosystem_health`: 用 ecosyste.ms 补 license、dependency、issue/PR、timeline 数据。

最终仍然保留人工或 agent 深筛步骤，因为“好项目”不是热度问题，而是“值得花时间且能提交低风险 PR”的问题。
