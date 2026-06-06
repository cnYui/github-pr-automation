# GitHub 每日 PR 机会扫描 Skill 方向确认

## 已确认决策

用户确认将每日扫描流程沉淀为 Codex Skill。

## Skill 草案

- 名称：`github-daily-pr-opportunity-scan`
- 触发场景：需要扫描当天 GitHub 新增 Star 热门项目，并生成 PR 机会报告时使用。
- 输入：GitHub Token、扫描日期、语言范围 JS/TS/Python、候选数量。
- 输出：报告 JSON，供单页表格读取。

## 核心流程

1. 建立候选池。
2. 计算或估算 24 小时新增 Star。
3. 过滤仓库健康度。
4. 分析低风险 PR 切入口。
5. 评估风险。
6. 生成表格数据。

## 禁止项

- 不自动 fork。
- 不自动提交。
- 不自动打开 PR。
- 不把每日目标解释成机械提交数量。
