# 每日 GitHub PR 机会流水线运行记录（2026-09-06）

- 实际运行模型：Opus 4.8（claude-opus-4-8）。
- Run id：`20260905211454-532aca`
- Lease id：`2026-09-05T21:14:54.043Z-d950c6`
- 当天日期报告：`public/reports/2026-09-06.json`（已同步 `public/reports/latest.json`、`dist/reports/2026-09-06.json`、`dist/reports/latest.json`）

## 启动与恢复

- `npm run pipeline -- status` 返回 `null`，无未完成运行 / 活动租约，按新运行处理。
- `npm run scan` 因 UTC 落前一日仍写入 `public/reports/2026-09-05.json`（已知扫描器 UTC off-by-one 问题）。10 个候选启发式仅 `Snailclimb/JavaGuide` 标「值得继续」，其余均为超大仓「跳过」。
- 依 scan Skill 对启发式结果做 live 复筛：`JavaGuide` 下调为「跳过」（账本已就 #2890/#2768/#2752 去重，无新增可处理切口）。
- 由本运行当天日期构建 `public/reports/2026-09-06.json`（11 项、actionable=1），并追加 live 命中候选后用具体日期报告启动流水线。

## live 复筛与候选甄别

用 `gh search issues` 定向复核多类客观低风险切口，逐一排除：

- `andrei-drexler/ironwail#581`、`apache/dolphinscheduler#18617`：已有开放 PR（#18615 覆盖 README 修复），重复。
- `onionshare/onionshare#2100`：README `/2.6/` 文档链接实际 200，`/latest/` 反而 404，维护者仍在讨论版本无关 URL，正确替换不客观。
- `nextcloud/documentation#15498`：`master` 源已使用正确的 `explore.transifex.com`，仅 EOL 的 server/16 受影响 —— 默认分支已修复。
- `smallstep/certificates#2788`、`PhonePe/...#14`、`MoiraeSoftware/Myriad#297`：均无可客观确定的替换 URL（重定向到首页 / 域名整体失效 / 无归档）。
- `STARIONGROUP/uml4net#229`：typo 在 wiki，无法用仓库 PR 修复。
- `TechTank/AlwaysActiveHours#16`：属批处理脚本逻辑改动（`18` vs `8`），非客观 typo，可能改变行为。
- `traPtitech/traQ_S-UI` typos、`oracle`/`canonical`/`mapbox` 系列：标识符重命名或 CLA/OCA 门禁。

命中并选定 **`im3sanger/dndscv#113`**（240★、R 生信包、活跃）。

## 选定候选：im3sanger/dndscv#113

- 客观缺陷：README 第 48、60 行两个教程链接使用 `http://htmlpreview.github.io/?http://github.com/...`。htmlpreview 页面走 https，其客户端 `fetch` 内层 `http://` GitHub 资源被严格浏览器按混合内容拦截（Safari 报 `TypeError: Load failed`），导致 vignette 无法渲染。
- 修复：两处均改为 `https://htmlpreview.github.io/?https://github.com/...`。

### live preflight（逐项通过）

- 默认分支 `master` SHA `43c5e2f1beaaf3ac26df9c046b281ceb0edbfff7`，README 仍含 2 处旧 http 模式，未在默认分支修复。
- issue #113 open、无 assignee。
- open PR #89（R/sitednds.R）、#65（vignettes/dNdScv.Rmd）、#58（NAMESPACE/R）均不触碰 README.md，无重复 PR。
- 无 CONTRIBUTING/CLA 门禁；`vignettes/dNdScv.html` 与 `vignettes/buildref.html` 均返回 200。

### 实施与验证

- Fork `cnYui/dndscv`，克隆到 `work/opportunity-pipeline/im3sanger__dndscv`，分支 `fix/readme-tutorial-https-links`（基线 SHA 同上）。
- 实际执行并观察到的本地验证：
  - grep：修复前 `http://` 模式 2 次 → 修复后 0 次；`https://` 模式 2 次。
  - `git diff --check` 无空白错误；`git diff --stat` = README.md +2/-2、单文件。
  - `vignettes/dNdScv.html`、`vignettes/buildref.html` 均 HTTP 200。
  - 浏览器（应用内 Browser）验证：`https` htmlpreview 变体正常渲染 vignette 正文；`http` 变体在本 Chromium 中被自动升级后可渲染，符合「问题为 Safari 等严格浏览器的混合内容拦截」的判断。
- commit `ad398d92e884b912413c96ec6122a6c4a8d9bbeb`，推送到 `cnYui/dndscv`。

### 发布对账与 PR

- 发布前按 head `cnYui:fix/readme-tutorial-https-links` 查询上游，无已有 PR。
- 创建 ready PR **#114**：https://github.com/im3sanger/dndscv/pull/114
- 状态：OPEN、非 draft、MERGEABLE、base `master`；仓库对 PR 无 CI checks（ciStatus=not_available）。

## 收尾

- `close` 释放租约，run 状态 `completed`，`prsOpened=1`。
- `clean`：removed 2 / kept 42（保留 3 天，含本轮新克隆）。
- 剩余队列：0。

## 本轮结论

- 处理候选：1（`im3sanger/dndscv`）。
- 创建 PR：1（#114，commit `ad398d9`）。
- 阻塞/跳过：见上「live 复筛」逐项中文原因；本轮无 blocked 候选。
