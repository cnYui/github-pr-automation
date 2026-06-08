# pi#5418 实施记录

## 目标

在 `earendil-works/pi` 修复 issue #5418：当 `~/.pi/agent/models.json` 是 invalid JSON 时，启动迁移阶段不再抛裸 `JSON.parse` `SyntaxError`，错误信息需要包含 `models.json` 文件路径。

## 工作目录与分支

- 工作目录：`D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\pi-5418`
- 分支：`codex/fix-models-json-migration-error-path`
- 远端操作：未推送，未创建 PR，未提交 commit

## 实现

- `packages/coding-agent/src/migrations.ts`
  - `migrateModelsJsonConfigValues()` 使用 `resolve(agentDir, "models.json")` 生成报错路径。
  - 只捕获解析阶段的 `SyntaxError`，转换为 `Failed to parse models.json: ...\n\nFile: <path>`。
  - 非 `SyntaxError` 继续原样抛出，避免吞掉 I/O 或其他运行时错误。

- `packages/coding-agent/test/config-value-migration.test.ts`
  - 新增回归测试 `reports models.json parse errors with the file path during config value migration`。
  - 测试写入 malformed `models.json`，通过 `runMigrations()` 触发真实配置值迁移路径。
  - 断言错误消息包含 `Failed to parse models.json:` 和 `File: <modelsJsonPath>`。
  - mock `migrateKeybindingsConfig`，原因是该测试文件只验证配置值迁移；避免为了无关 keybindings 迁移依赖 `@earendil-works/pi-tui` dist。

## RED 证据

命令：

```powershell
node ../../node_modules/vitest/dist/cli.js --run test/config-value-migration.test.ts -t "reports models.json parse errors with the file path during config value migration"
```

结果：失败，符合预期。

关键失败信息：

```text
expected 'Unexpected token '}', ..."rovider":…' to contain 'Failed to parse models.json:'
Received: "Unexpected token '}', ..."rovider": }" is not valid JSON"
```

说明当前代码直接暴露原始 JSON parse 错误，没有 `models.json` 路径。

## GREEN 证据

目标用例：

```powershell
node ../../node_modules/vitest/dist/cli.js --run test/config-value-migration.test.ts -t "reports models.json parse errors with the file path during config value migration"
```

结果：

```text
Test Files  1 passed (1)
Tests       1 passed | 2 skipped (3)
```

完整迁移测试文件：

```powershell
node ../../node_modules/vitest/dist/cli.js --run test/config-value-migration.test.ts
```

结果：

```text
Test Files  1 passed (1)
Tests       3 passed (3)
```

仓库检查：

```powershell
npm run check
```

结果：通过。`biome` 未应用修复，`check:pinned-deps`、`check:ts-imports`、`check:shrinkwrap`、`tsgo --noEmit`、`check:browser-smoke` 均通过。npm 仍输出既有 `min-release-age` unknown config 警告。

## 剩余风险

- 本轮没有运行全量 `npm test`，遵循外部仓库 `AGENTS.md` 规则避免直接跑全量 Vitest/e2e。
- `npm install --ignore-scripts` 报告 2 个 critical audit 项和若干弃用警告；这是现有依赖状态，不属于本 issue 修复范围。
- 未做真实 CLI 启动烟测；当前覆盖停留在迁移单元回归和仓库静态检查。
