# Kode-CLI #166 完整测试绿灯记录

## 工作目录

- 外部仓库: `D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\Kode-CLI-166-restart`
- 分支: `codex/fix-mcp-text-result-rendering`

## 本轮阻塞

- `bun test` 初始失败: `550 pass / 8 skip / 2 fail`。
- 失败项 1: `CLI E2E smoke > --print validates stream-json requirements (offline)` 5s 超时。
- 失败项 2: `LSP tool (TypeScript backend) > goToDefinition returns formatted location + counts` 15s 超时。

## 根因与处理

- `cli-smoke` 的 `run()` 继承当前环境，未隔离 `KODE_CONFIG_DIR`。
- `runCli()` 会在 `runPrintMode()` 的参数校验前先执行 setup、tool/MCP 初始化等逻辑，因此本机用户配置或 MCP 配置会让这个离线参数校验测试卡住。
- 用临时 `KODE_CONFIG_DIR` 直接运行同一命令可在 3 秒内返回预期错误，证明这是测试隔离问题。
- 最小修复: `tests/e2e/cli-smoke.test.ts` 为每次 spawn 创建临时 `KODE_CONFIG_DIR` 并在结束后删除。
- LSP 超时在单独跑 `tests/unit/lsp-tool.test.ts` 时通过；测试隔离修复后完整 `bun test` 也通过，判断为完整 suite 负载/时序连带超时，不需要修改 LSP。

## 最终验证

Commands:

```bash
bun test tests/e2e/cli-smoke.test.ts
bun test
bun run typecheck
bun run lint
bun run format:check
```

Results:

```text
cli-smoke: 3 pass / 0 fail
bun test: 552 pass / 8 skip / 0 fail, 560 tests across 144 files
typecheck: tsc --noEmit exited 0
lint: eslint . --max-warnings 0 exited 0
format: All matched files use Prettier code style
```

## 提交判断

- 建议进入提交准备。
- 当前变更范围包含 MCP renderer 修复、新增 MCP 渲染回归测试，以及一个小的 CLI smoke 测试隔离修复。
- 未提交、未推送、未创建 PR。
