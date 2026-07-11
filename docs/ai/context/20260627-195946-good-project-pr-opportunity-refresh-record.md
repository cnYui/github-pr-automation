# 2026-06-27 好项目 PR 机会刷新记录

## 扫描方式

- 已按 `github-daily-pr-opportunity-scan` 检测当前仓库为 dashboard 模式。
- 先运行 `npm run scan` 刷新 `public/reports/latest.json` 和 `data/snapshots/latest.json`。
- 自动扫描结果偏向超大仓，随后使用 GitHub Search/API 补充 `stars:100..20000`、近 180 天活跃、Agent/MCP/CLI/developer-tools 相关仓库。
- 对候选逐仓查看 open issue、open PR、根目录、workflow 和测试入口，排除重复 PR 或本地验证过重的方向。

## 今日推荐

1. `holon-run/holon`
   - 推荐：`值得继续`
   - 主切口：#2002，修复 `apply_patch` diff header 中 `a//absolute/path` 的兼容处理。
   - 备选：#2028，把 unknown model fallback prompt budget 从 64000 调整为 128000。
   - 证据：仓库有 Rust、CI、`tests/`、`Makefile`；#2002 当前没有 open PR 覆盖。

2. `Muvon/octocode`
   - 推荐：`值得继续`
   - 切口：#50，为 C++20 module 扩展名 `.cppm`、`.ixx`、`.mxx`、`.ccm`、`.cxxm` 补语言识别。
   - 证据：仓库已有 `src/indexer/languages/*_test.rs`，可做小范围回归测试；当前 open PR 不覆盖该方向。

3. `alexei-led/ccgram`
   - 推荐：`值得继续`
   - 切口：#107，`tmux rename-window` 后不应重放完整历史 transcript。
   - 证据：issue 有明确复现步骤；仓库有 `tests/ccgram/test_session_monitor.py`、`test_monitor_state.py`、`test_multiplexer_tmux.py`；当前无 open PR。

## 谨慎候选

- `fujibee/agmsg#230`：长消息 warning / opt-in cap 方向可测，但 issue 明确要求先决定策略，不能直接实现硬限制。
- `tomasz-tomczyk/crit#537`：help wanted UI 方向清晰，但需要理解 stack UI 和 e2e/快照验证，切口比纯 bug 大。

## 排除项

- `rvben/rumdl#655`：维护者确认需要等待 `shuck check` 支持 stdin，上游未完成前 rumdl 侧 PR 不可运行。
- `0xMassi/webclaw#73`：Linux glibc release binary 问题已有 PR #74 覆盖。
- `max-sixty/worktrunk#3269`：picker auto-refresh flake 已有 #3265、#3270、#3271 等相近 PR 处理，重复风险高。

## 输出更新

- 已把人工去重后的候选写入 `public/reports/latest.json` 和 `public/reports/2026-06-27.json`。
- 已运行 `npm run build`，同步生成 `dist/reports/latest.json` 和 `dist/reports/2026-06-27.json`。

## 验证

- `npm run scan`：通过。
- `npm run build`：通过。
- `npx vitest run src/shared/report-schema.test.ts src/web/report-view.test.ts src/scanner/report-builder.test.ts src/scanner/scan-runner.test.ts`：4 个测试文件、8 个测试通过。
- 当前报告 schema 解析：`public/reports/latest.json`、`public/reports/2026-06-27.json`、`dist/reports/latest.json`、`dist/reports/2026-06-27.json` 全部通过。
- `npm test` 全量未通过，原因是 Vitest 扫入 `work/n8n/...` 外部仓后在 Windows 触发 `EMFILE: too many open files`，与本轮报告内容无关。
