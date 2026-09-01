# 2026-07-22 每日 GitHub PR 机会流水线二次运行记录

## 启动与恢复

- 自动化：每日 GitHub PR 机会流水线，Automation ID `github-pr`。
- 工作目录：`D:\CodeWorkSpace\github-pr-automation`。
- 已先读取项目 `AGENTS.md`、自动化记忆、`github-run-pr-opportunity-pipeline`、`github-daily-pr-opportunity-scan`、`github-implement-pr-opportunity`。
- `using-superpowers` 未找到可读 Skill 文件，只在历史记录中命中说明；本轮按其要求先查找并读取适用 Skill 后再执行。
- `npm run pipeline -- status` 初始返回 `null`，无未完成运行。

## 报告

- 使用仓内 `runScan()` 显式传入东京日期 `2026-07-22`，避免扫描 CLI 的 UTC 日期落前一日问题。
- 日期报告：`public/reports/2026-07-22.json`。
- 生成时间：`2026-07-22T11:30:44.025Z`。
- 报告候选：10 个，`值得继续` 2 个：`n8n-io/n8n`、`Snailclimb/JavaGuide`。
- `npm run build` 后确认 `public/reports/2026-07-22.json`、`dist/reports/2026-07-22.json`、`public/reports/latest.json`、`dist/reports/latest.json` 内容一致。

## Pipeline Run

- Run ID：`20260722113219-2a4756`。
- Lease：`2026-07-22T11:32:19.374Z-573ff6`。
- Source report SHA256：`2230a1c36097469096c16b2642fa46bf76d3d78c78f3fd93f5b86238aa73b32d`。
- 最终状态：`completed`，已运行 `close` 并释放租约。
- 剩余队列：0。
- 创建 PR：0。

## 候选处理

### n8n-io/n8n

- 候选 ID：`42938d52624d0cf8`。
- 默认分支：`master`，HEAD `7a0ca859ae47bc7ef8e5ecdc7b5af5c32c5a6aff`。
- live preflight 结果：`skipped`。
- 原因：
  - issue `#34708` 和 `#34704` 均带 `status:in-linear`，维护者 bot 已创建内部 Linear ticket。
  - Formula filter 方向已有开放 PR `#27451` 覆盖相近 Notion formula filter 类型映射。
  - AI assistant stuck after crash 发生在 cloud/enterprise 场景，缺少可本地复现的最小公开用例。
- 未 clone、未 fork、未修改上游代码。

### Snailclimb/JavaGuide

- 候选 ID：`1eb3a502880150a7`。
- 默认分支：`main`，HEAD `74d6cef1443b7f276eefdf8d367824761e2a1ec5`。
- live preflight 结果：`skipped`。
- 原因：
  - issue `#2768` 带“已完成”标签，维护者已评论“沉浸式阅读已上线”。
  - 默认分支已包含 `docs/.vuepress/components/LayoutToggle.vue`、`DeferredLayoutToggle.vue` 和相关样式。
  - issue `#2752` 是英文版与中文版如何长期共同维护的产品/维护策略决策，需要维护者先定方向。
- 未 clone、未 fork、未修改上游代码。

## 验证

- `npm run pipeline -- status`：关闭后返回 `null`。
- `npm run build`：通过。
- `npm run typecheck`：通过。
- 报告一致性检查：`public`/`dist` 日期报告与 `latest.json` 一致。
- `git diff --check`：退出码 0，仅 Windows CRLF warning。

## 后续注意

- 扫描 CLI 的 UTC 日期问题仍应单独修复；本轮继续通过显式日期调用 `runScan()` 规避。
- 本轮刷新发生在同一个东京日期的第二次流水线运行，原因是自动化再次触发且初始状态无未完成运行。
