# GitHub API 与平台规则调研

## 调研来源

- GitHub REST API Starring 文档：`https://docs.github.com/v3/activity/starring`
- GitHub REST API Search 文档：`https://docs.github.com/en/rest/search/search`
- GitHub GraphQL API 文档：`https://docs.github.com/en/graphql`
- GitHub Disrupting the Experience of Other Users 政策：`https://docs.github.com/en/site-policy/acceptable-use-policies/github-disrupting-the-experience-of-other-users`

## 关键结论

- GitHub stargazers 接口在指定媒体类型时可返回 `starred_at`，可用于校验仓库最近新增 Star。
- GitHub Search API 可用于建立初始候选池，但不是直接的“最近 24 小时新增 Star 排行榜”接口。
- 更稳妥的首版方案是：每日保存仓库 Star 快照，用快照差分计算 24 小时新增 Star；必要时用 stargazers `starred_at` 对候选仓库做抽样或精确校验。
- GitHub 平台规则不接受空洞、无意义、批量打扰维护者的 PR。系统必须以质量门槛、人工确认和维护者体验为核心约束。

## 设计影响

- 排行榜模块要支持“快照差分”而不是假设 GitHub 有现成的新增 Star 排名 API。
- 首次运行没有完整 24 小时差分时，需要使用 GitHub Search、近期活跃度和可选第三方公开趋势源作为冷启动候选池。
- PR 提交模块必须默认只生成候选，不自动提交。
- 候选 PR 必须过滤掉无实质价值、无验证证据、贡献规范不匹配、维护者明确不接受的变更。
