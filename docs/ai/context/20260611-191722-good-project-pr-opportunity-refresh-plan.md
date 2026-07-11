# GitHub 好项目 PR 机会刷新计划

## 目标

联网筛选一批当前活跃、项目质量较好、且更适合提交小范围 PR 的 GitHub 项目，并把评估结果更新到当前日报网页。

## 边界

- 只修改当前主控仓的报告数据：`public/reports/latest.json` 与 `dist/reports/latest.json`。
- 不修改扫描器代码，不修改页面组件，不在主窗口 checkout 上游仓库。
- 不自动 fork、不提交上游 PR。
- 不把“高星项目”直接等同于“适合 PR”，必须核验 issue、重复 PR 风险和改动范围。

## 方案

1. 使用 GitHub 仓库搜索发现近期活跃项目：
   - `archived:false`
   - `pushed:>2026-05-01`
   - `stars` 过滤热度
   - `good-first-issues` 或 `help-wanted-issues` 过滤贡献入口
   - `topic` 限定 AI agent、MCP、CLI、developer tooling 等当前更相关方向
2. 对候选仓库逐个查 open issue：
   - 优先 `good first issue`、`help wanted`、bug、docs、test 这类可小切片交付的问题
   - 避免已有明显重复 open PR 的问题
   - 避免需要大规模架构重写、账号权限、商业服务密钥或维护者决策的问题
3. 按当前 schema 输出：
   - `值得继续`：低风险、可复现或可文档化、能小范围提交
   - `谨慎`：项目好但 issue 不够明确、改动范围偏大或维护流程不确定
   - `跳过`：高风险、重复 PR 明显、问题不适合当前 PR 工作流
4. 验证：
   - 运行现有测试或构建，确认 JSON schema 与页面可渲染
   - 启动 Vite 本地页面并在浏览器打开

## 取舍

- Trending/OSSInsight 只作为发现层，最终判断仍回到 GitHub issue/PR。
- 本轮不追求数量，优先保证候选可行动性。
- `starsAdded24h` 若没有可靠 24h 增量来源，保守写 0，并在 evidence 说明来源口径。
