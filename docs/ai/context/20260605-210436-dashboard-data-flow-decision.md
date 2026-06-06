# 展示页数据流决策

## 已确认决策

每日任务分为 5 步：

1. 拉取候选池：用 GitHub Search 找近期高 star、近期活跃、非 archived 的 JS/TS/Python 仓库。
2. 计算热度：保存每日 star 快照，用今天和昨天的差值计算 24 小时新增 Star；首次运行没有昨天数据时，用 Search 结果做冷启动。
3. 筛选健康度：检查 license、默认分支更新时间、README、CONTRIBUTING、issue 活跃度、CI/test 配置。
4. 分析 PR 切入口：只找文档缺口、示例缺口、测试补充、小 bug、类型/CI 问题。
5. 生成报告数据：产出 JSON 文件，页面只读取 JSON 并渲染表格。

## 设计影响

- 页面和分析任务解耦。
- 定时任务负责生成数据，页面只负责展示。
- 页面不接触 GitHub Token。
- 页面不会触发 fork、提交或 PR 创建。
