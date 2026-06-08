# Kode-CLI #166 LSP/CLI 完整测试稳定性记录

## 工作目录

- 外部仓库: `D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\Kode-CLI-166-restart`
- 分支: `codex/fix-mcp-text-result-rendering`

## 本轮问题

主线程复跑完整 `bun test` 后出现 `LSP tool (TypeScript backend) > findReferences returns formatted grouped locations + counts` 默认 5 秒超时，输出为 `551 pass / 8 skip / 1 fail`。

本轮 worker 复现时:

- `bun test tests/unit/lsp-tool.test.ts` 单独通过，但 TS backend 首个慢用例可达数秒。
- `bun test` 首次复跑没有复现 LSP，而是 `CLI E2E smoke > --print validates stream-json requirements (offline)` 在完整 suite 负载下默认 5 秒超时。

## 定位

- `cli-smoke` 已隔离 `KODE_CONFIG_DIR`，但该用例启动 TS CLI entrypoint，在完整 suite 负载下仍可超过默认 5 秒；单独跑通常 2 秒内完成。
- `LSP findReferences` 单独跑稳定通过，但主线程完整 suite 下曾跑到 23 秒后才超时；同文件已有 `goToDefinition` 和编辑回归用例设置 15 秒超时，说明 TS backend 用例本身存在启动/负载敏感性。
- 两个红灯都不是 MCP result 渲染修复引起，也不是产品逻辑失败；属于测试默认超时对 Windows/Bun/完整 suite 负载过紧。

## 处理

- `tests/e2e/cli-smoke.test.ts`
  - 保留临时 `KODE_CONFIG_DIR` 测试隔离。
  - 给 `--print validates stream-json requirements (offline)` 加 `{ timeout: 30_000 }`。
- `tests/unit/lsp-tool.test.ts`
  - 给 `findReferences returns formatted grouped locations + counts` 加 `{ timeout: 30_000 }`。

未修改 MCP 功能范围，未改模型调用、协议结构或 dashboard 文件。

## 最终验证

Commands:

```bash
bun test tests/e2e/cli-smoke.test.ts
bun test tests/unit/lsp-tool.test.ts
bun test
bun test
bun run typecheck
bun run lint
bun run format:check
```

Results:

```text
cli-smoke: 3 pass / 0 fail
lsp-tool: 7 pass / 0 fail
bun test run 1: 552 pass / 8 skip / 0 fail, 560 tests across 144 files
bun test run 2: 552 pass / 8 skip / 0 fail, 560 tests across 144 files
typecheck: tsc --noEmit exited 0
lint: eslint . --max-warnings 0 exited 0
format: All matched files use Prettier code style
```

## 提交判断

- 现在建议进入提交准备。
- 当前外部仓库仍未提交、未推送、未创建 PR。
- 变更范围包含 MCP renderer 修复、MCP 回归测试，以及两个测试稳定性修复。
