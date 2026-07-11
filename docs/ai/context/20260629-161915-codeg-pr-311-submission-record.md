# codeg PR #311 提交记录

日期：2026-06-29

## 目标

推进 `xintaofei/codeg#273`，修复会话详情里 agent 运行时长在 parser 未提供 `total_duration_ms` 时显示不准或缺失的问题。

## PR

- PR：`https://github.com/xintaofei/codeg/pull/311`
- 标题：`fix: compute completed session runtime from timestamps`
- 分支：`cnYui:codex/fix-agent-runtime-duration`
- commit：`b41a498de7d9a0b6e8f04021991ad807a765caec`
- 当前状态：open，`mergeable=MERGEABLE`
- 远端 checks：创建后即时回读 `statusCheckRollup=[]`，暂无 checks 返回。

## 改动范围

- `src/components/conversations/session-details-dialog.tsx`
  - 新增 `resolveSessionDurationMs()`。
  - 优先使用正数 `stats.total_duration_ms`。
  - 仅当会话状态为 `completed` 且 stats duration 为 0 时，用 `summary.updated_at - summary.created_at` 兜底。
  - 对运行中会话不从 timestamp 推导 duration，避免刷新时间或当前时间导致漂移。
- `src/components/conversations/session-details-dialog.test.tsx`
  - 新增 completed 会话 timestamp 兜底测试。
  - 新增 in-progress 会话不从 timestamp 推导 duration 的回归测试。

## 本地验证

实际通过 `corepack pnpm` 调用项目要求的 `pnpm@11.9.0`，因为本机全局 `pnpm.CMD` 的 tools shim 缺少 11.9.0 `bin` 目录。

- RED：`corepack pnpm test src/components/conversations/session-details-dialog.test.tsx`
  - 预期失败：新增 completed 兜底用例找不到 `2.5m`。
- GREEN：`corepack pnpm test src/components/conversations/session-details-dialog.test.tsx`
  - 14 tests passed。
- `corepack pnpm test src/components/conversations/active-session-details.test.ts`
  - 13 tests passed。
- `corepack pnpm test src/lib/format-elapsed.test.ts`
  - 5 tests passed。
- `corepack pnpm eslint src/components/conversations/session-details-dialog.tsx src/components/conversations/session-details-dialog.test.tsx`
  - passed。
- `git diff --check`
  - passed；只有 Git for Windows 的 LF/CRLF 提示，无空白错误。

## 未覆盖项

- 未跑完整 `pnpm test`。
- 未跑 `pnpm build`。
- 未跑 Rust/Tauri 测试；本 PR 只改前端详情弹窗展示和测试。
