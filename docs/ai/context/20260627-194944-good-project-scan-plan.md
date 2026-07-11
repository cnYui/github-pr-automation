# 2026-06-27 好项目候选扫描计划

## 目标

重新查看最近值得推进低风险 PR 的 GitHub 项目，并刷新本仓日报报告。

## 范围

- 使用 `github-daily-pr-opportunity-scan` 的 Agent / MCP / CLI / developer-tools 搜索口径。
- 当前仓库符合 dashboard 模式，优先复用 `npm run scan` 生成 `public/reports/latest.json` 和快照。
- 对候选补充只读去重：查看 open issue、open PR、贡献门槛和本地验证成本。
- 只输出候选建议，不 fork、不提交、不创建 PR。

## 取舍

- 大型项目只保留文档、示例、坏链、配置说明这类本地可验证切口。
- 若已有开放 PR 覆盖相同方向，直接降级为跳过或不推荐。
- 报告 schema 只使用现有分类：文档缺口、示例补全、测试补充、小 bug、CI/类型错误。

## 验证

- 使用 GitHub CLI/API 获取实时仓库、issue 和 PR 证据。
- 刷新报告后运行 schema 解析或相关测试，确认 `latest.json` 可被前端读取。
