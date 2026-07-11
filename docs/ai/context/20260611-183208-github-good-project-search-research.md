# GitHub 好项目搜索入口调研

## 背景

用户询问是否存在专门用于搜索 GitHub 好项目的入口，并要求联网查询。

## 结论

GitHub 没有一个官方的“好项目评分搜索”，但有足够的官方搜索能力可以组合出稳定入口：

- 仓库搜索：用 `stars`、`forks`、`pushed`、`language`、`topic`、`archived:false`、`good-first-issues`、`help-wanted-issues` 组合筛选。
- Issue 搜索：在仓库候选出来后，再查 `is:issue is:open label:"good first issue"`、`label:"help wanted"`、`no:assignee`、`-linked:pr` 等信号。
- CLI/API 自动化：`gh search repos` 支持 `--good-first-issues`、`--help-wanted-issues`、`--sort stars|forks|help-wanted-issues|updated`，适合接入当前扫描器。
- 趋势入口：GitHub Explore / Trending、OSSInsight、Trendshift 更适合发现“正在升温”的项目，但不等于 PR 机会，需要二次核验 issue、重复 PR、测试可行性。

## 推荐入口

1. GitHub Repository Search / Advanced Search
   - 官方文档确认仓库搜索支持 stars、forks、pushed、language、topic、license、archived、good-first-issues、help-wanted-issues 等 qualifier。
   - 适合作为当前日报的主入口。

2. GitHub CLI `gh search repos`
   - 支持同一套 GitHub search syntax，也支持参数化 flags。
   - 比 HTML Trending 稳定，适合脚本化输出 JSON。

3. GitHub Issues / PR 搜索
   - 用于候选项目二次核验，确认 issue 是否 open、是否已有 linked PR、是否过度拥挤。

4. OSSInsight
   - 跟踪 GitHub 事件、stars、commits、PR、issues、contributors、community health。
   - 适合发现趋势，但结果要回到 GitHub 做 PR 可行性判断。

5. Trendshift
   - 提供 daily / weekly / monthly / yearly 趋势仓库。
   - 适合作为 Trending 补充信号。

6. GitHub Topics
   - `good-first-issue` topic 页能发现带相关 topic 的仓库。
   - 注意 topic 不是 issue label，只能作为粗筛。

## 可直接使用的查询模板

Web 仓库搜索：

```text
topic:ai-agent archived:false stars:>500 pushed:>2026-05-01 good-first-issues:>0
```

CLI 仓库搜索：

```bash
gh search repos "topic:ai-agent archived:false stars:>500 pushed:>2026-05-01 good-first-issues:>0" \
  --sort stars \
  --limit 50 \
  --json fullName,description,stargazersCount,forksCount,openIssuesCount,updatedAt,url
```

Issue 二次核验：

```text
repo:OWNER/REPO is:issue is:open label:"good first issue" no:assignee -linked:pr comments:<6 updated:>2026-05-01
```

更适合 PR 机会日报的仓库查询：

```text
archived:false pushed:>2026-05-01 stars:100..20000 forks:10..5000 good-first-issues:>0
```

## 本轮快速实测

用 GitHub 仓库搜索条件：

```text
topic:ai-agent archived:false stars:>500 pushed:>2026-05-01 good-first-issues:>0
```

返回 27 个仓库，说明该类查询能工作。但高星和 `good-first-issues` 只说明项目有热度和贡献入口，不代表 issue 可直接提 PR；仍要逐仓查重 open PR、issue 复现路径、测试成本和维护者响应。

## 对当前项目的取舍

- 主入口建议改为 GitHub Search/API 或 `gh search repos`，不要依赖解析 Trending HTML。
- Trending、OSSInsight、Trendshift 只作为候选发现层。
- 最终推荐仍沿用当前项目记忆中的筛选轴：`open issue + no duplicate open PR + minimal-scope diff + testable regression`。

## 来源

- GitHub Docs: Searching for repositories
  - https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories
- GitHub CLI: gh search repos
  - https://cli.github.com/manual/gh_search_repos
- GitHub Docs: Filtering and searching issues and pull requests
  - https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/filtering-and-searching-issues-and-pull-requests
- GitHub Explore
  - https://github.com/explore
- GitHub Trending
  - https://github.com/trending
- GitHub Topics: good-first-issue
  - https://github.com/topics/good-first-issue
- OSSInsight
  - https://ossinsight.io/
- OSSInsight AI Trending
  - https://ossinsight.io/trending/ai
- Trendshift
  - https://trendshift.io/
