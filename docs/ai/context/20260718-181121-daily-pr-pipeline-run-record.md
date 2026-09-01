# 2026-07-18 每日 GitHub PR 机会流水线运行记录

## 基本信息

- 自动化：每日 GitHub PR 机会流水线（`github-pr`）
- 本地项目：`D:\CodeWorkSpace\github-pr-automation`
- 日期报告：`public/reports/2026-07-18.json`
- Run ID：`20260718090717-149cd9`
- Lease：`2026-07-18T09:07:17.485Z-077614`
- 状态：已 completed 并 close，`npm run pipeline -- status` 返回 `null`

## 扫描与报告

- 因扫描器 CLI 仍使用 UTC `toISOString()` 截取日期，本轮继续直接调用仓库 `runScan()`，传入东京日期 `2026-07-18`，避免日期报告写错。
- 报告共 10 个候选，`actionableCount` 为 1。
- `public/reports/2026-07-18.json`、`public/reports/latest.json`、`dist/reports/2026-07-18.json` 与 `dist/reports/latest.json` 均为同一生成时间 `2026-07-18T09:06:29.997Z`，候选数 10，可处理数 1。

## 处理结果

- 本轮处理候选 1 个：`Snailclimb/JavaGuide`
- 创建 PR：0 个
- 剩余队列：0

## Live Preflight 结论

`Snailclimb/JavaGuide` 未归档，默认分支为 `main`，HEAD 为 `92695bead0d8cba436c56f64920304eeb04bf023`。当前账号 `cnYui` 的 `gh auth status` 正常，具备读取和创建 PR 所需 token 权限。

跳过原因：

- `#2768` 仍为 open，但带有“已完成”标签；维护者已评论确认沉浸式阅读上线。
- GitHub code search 在默认分支 HEAD 下找到 `docs/.vuepress/components/LayoutToggle.vue` 与 `docs/.vuepress/styles/index.scss`，说明隐藏/沉浸式阅读方向已经实现。
- `#2752` 仍为 open，但维护者说明尚未决定如何同时维护中英文版本，属于产品/维护策略决策，不适合自动化 PR。
- 仓库根目录没有 `CONTRIBUTING.md`，`.github` 目录仅包含 `workflows`，未找到通用 PR 模板；但 `#2752` 本身仍需要维护者方向决策。
- 开放 PR `#2882`、`#2883`、`#2884` 与本候选证据无直接重复，不改变跳过结论。

## 实际命令

- `npm run pipeline -- status`
- 调用 `runScan()` 生成 `public/reports/2026-07-18.json`
- `npm run pipeline -- start --report public/reports/2026-07-18.json`
- `npm run pipeline -- next --lease "2026-07-18T09:07:17.485Z-077614"`
- `npm run pipeline -- preflight --lease "2026-07-18T09:07:17.485Z-077614" --candidate 1eb3a502880150a7 --file data/pipeline/input/1eb3a502880150a7-preflight.json`
- `npm run pipeline -- transition --lease "2026-07-18T09:07:17.485Z-077614" --candidate 1eb3a502880150a7 --to skipped --message "..."`
- `npm run pipeline -- next --lease "2026-07-18T09:07:17.485Z-077614"`
- `npm run pipeline -- close --lease "2026-07-18T09:07:17.485Z-077614"`
- `npm run build`
- `npm run typecheck`
- 报告 schema 与 public/dist 一致性校验
- `git diff --check`：退出码 0，仅提示 Windows 工作区 LF/CRLF 转换 warning

## 后续注意

- 扫描器 UTC 日期覆盖问题仍未从代码层修复；本轮继续通过直接调用 `runScan()` 并传入东京日期规避。
- 本轮没有 clone、修改上游仓库、提交、推送或创建 PR。
