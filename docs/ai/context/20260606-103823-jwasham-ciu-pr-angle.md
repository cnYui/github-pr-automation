# jwasham/coding-interview-university PR 切入角度

## 结论

推荐切入点：修复 `README.md` 中两个已被自动 link checker 标出的坏链，并替换为同一作者/官方站点的新地址。

- `How To Write A Bloom Filter App`
  - 旧链接：`http://blog.michaelschmatz.com/2016/04/11/how-to-write-a-bloom-filter-cpp/`
  - 新链接：`https://michaelschmatz.com/posts/how-to-write-a-bloom-filter-cpp/`
  - 证据：旧链接 `curl` 返回 `000`，新链接返回 `200`。
- `MIT Lecture Notes`
  - 旧链接：`https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-046j-design-and-analysis-of-algorithms-spring-2012/lecture-notes/MIT6_046JS12_lec15.pdf`
  - 新链接：`https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2012/resources/mit6_046js12_lec15/`
  - 证据：旧链接重定向后返回 `404`，新链接返回 `200`。

## 为什么选这个

- 目标仓库有自动 issue `#1965 Link checker report`，当前仍开放，报告中包含这两个坏链。
- 已有开放 PR `#2104` 只修 NPTEL 链接，不覆盖这两个链接。
- GitHub 搜索未发现 `michaelschmatz`、`Bloom filter`、`MIT Lecture Notes`、`ocw.mit` 相关开放 PR 或 issue，撞车风险低。
- 两个替换都是“原资源迁移后的官方/原作者地址”，不是新增资源、不是主观推荐，审查成本低。
- 改动范围预计只有 `README.md` 两行，适合在这个维护节奏偏慢、开放 PR 较多的仓库中提交。

## 不推荐的方向

- 不建议做翻译：已有多个翻译 issue/PR 长期开放，工作量大且容易悬挂。
- 不建议新增刷题站、课程或工具：已有同类开放 PR，价值判断主观，合并概率不稳定。
- 不建议改 GitHub Actions/lychee 版本：已有 dependabot 和 workflow hardening 相关开放 PR。
- 不建议一次性修全部 link checker 错误：报告里不少是 Topcoder、LeetCode、Quora、X/Twitter、Uber 等站点的 bot/network 拦截，容易把确定性修复和噪声混在一起。

## 后续执行设计

1. 在目标仓库创建小分支，例如 `fix/readme-broken-official-links`。
2. 只改 `README.md` 两处 URL，不改链接标题和章节结构。
3. 用 `curl -L` 验证旧/新链接状态，并把结果写进 PR 描述。
4. PR 标题建议：`Fix two broken README resource links`
5. PR 描述关联 `#1965`，说明只处理其中两个有官方替代地址的坏链。

## 风险

- 流程风险为中：该仓库开放 PR 很多，维护者响应可能慢。
- 技术风险为低：纯 Markdown 链接修复，可独立验证。
