# 2026-07-17 每日 GitHub PR 机会流水线运行记录

## 基本信息

- 自动化：每日 GitHub PR 机会流水线（`github-pr`）
- 本地项目：`D:\CodeWorkSpace\github-pr-automation`
- 日期报告：`public/reports/2026-07-17.json`
- Run ID：`20260716210305-f9fb50`
- Lease：`2026-07-16T21:03:05.866Z-f20fcc`
- 状态：已完成并 close，`npm run pipeline -- status` 返回 `null`

## 扫描与报告

- 因当前机器为东京时间 `2026-07-17T06:02+09:00`，而 Node UTC 日期仍为 `2026-07-16`，本轮没有直接使用扫描 CLI 的默认日期；改为调用仓库扫描 API 写入 `2026-07-17` 日期报告。
- 报告共 10 个候选，`actionableCount` 为 1。
- `public/reports/latest.json` 已同步为同一份 `2026-07-17` 报告。

## 处理结果

- 本轮处理候选 1 个：`Snailclimb/JavaGuide`
- 创建 PR：0 个
- 剩余队列：0

## Live Preflight 结论

`Snailclimb/JavaGuide` 未归档，默认分支为 `main`，复核时 HEAD 为 `92695bead0d8cba436c56f64920304eeb04bf023`。`gh auth status` 确认当前账号 `cnYui` 可读取并具备推送/Fork 所需 token 权限。

跳过原因：

- 扫描器证据 `#2768` 已由维护者评论确认“沉浸式阅读已上线”，并带有“已完成”标签；默认分支已经包含该方向修复。
- 扫描器证据 `#2752` 是整站英文版维护策略问题，维护者说明尚未决定如何同时维护双语版本，属于产品/维护策略决策，不适合自动化 PR。
- 额外复核同仓库 `doc-bug` / `perfect content` / `待处理` 方向时，`#1947` 和 `#1087` 均已有维护者修正评论或需要重绘复杂图，不构成低风险明确切口。
- 唯一开放 PR `#2882` 修改 `docs/java/basis/java-basic-questions-01.md`，与本候选证据无直接重复，但不改变上述跳过结论。

## 实际命令

- `npm run pipeline -- status`
- 调用 `runScan()` 生成 `public/reports/2026-07-17.json`
- `npm run pipeline -- start --report public/reports/2026-07-17.json`
- `npm run pipeline -- next --lease "2026-07-16T21:03:05.866Z-f20fcc"`
- `npm run pipeline -- preflight --lease "2026-07-16T21:03:05.866Z-f20fcc" --candidate 1eb3a502880150a7 --file data/pipeline/input/1eb3a502880150a7-preflight.json`
- `npm run pipeline -- transition --lease "2026-07-16T21:03:05.866Z-f20fcc" --candidate 1eb3a502880150a7 --to skipped --message "..."`
- `npm run pipeline -- next --lease "2026-07-16T21:03:05.866Z-f20fcc"`
- `npm run pipeline -- close --lease "2026-07-16T21:03:05.866Z-f20fcc"`
- `npm run pipeline -- status`

## 后续注意

- 扫描器 UTC 日期覆盖问题仍未从代码层修复；本轮用 API 参数绕过，后续主控仓维护应修复 CLI 日期入参或时区策略。
- 本轮没有 clone、修改上游仓库、提交、推送或创建 PR。
