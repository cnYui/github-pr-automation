# GitHub Trending 报告刷新摘要

## 已完成

- 将报告 schema 的 `primaryLanguage` 从 TypeScript/JavaScript/Python 枚举放宽为任意非空字符串。
- 将扫描器默认语言范围放宽为不限语言。
- 从 GitHub Trending daily 当前页面拉取热门项目。
- 按 `stars today` 排序生成 10 条报告数据。
- 用 GitHub 仓库 API 补充总 Star、license、更新时间、根目录信号和 workflow 信号。
- 更新 `public/reports/latest.json`。
- 更新 `AGENTS.md` 项目记忆。

## 当前报告

- 日期：2026-06-06。
- 候选项目：10 个。
- 可推进项目：9 个。
- 语言包含：Python、JavaScript、TypeScript、Jupyter Notebook、C#、未标注。

## 验证

- `npm test`：7 个测试文件，14 个测试通过。
- `npx tsc --noEmit`：通过。
- `npm run build`：通过。
- HTTP `/reports/latest.json`：返回 10 个项目。
- 应用内浏览器新标签页：表格行数 10，按钮数 0。

## 数据来源

- GitHub Trending daily：`https://github.com/trending?since=daily`
