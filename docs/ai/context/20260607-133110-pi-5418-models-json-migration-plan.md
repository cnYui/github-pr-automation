# pi#5418 models.json 迁移错误路径 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复 `earendil-works/pi#5418`，让迁移阶段解析 malformed `models.json` 时抛出的错误包含已解析的 `models.json` 文件路径。

**Architecture:** 复用 `ModelRegistry.loadCustomModels()` 的错误消息风格，只在 `migrateModelsJsonConfigValues()` 的 `stripJsonComments + JSON.parse` 路径外包一层 `try/catch`。非 `SyntaxError` 继续按原错误抛出，避免吞掉真实 I/O 或运行时问题。

**Tech Stack:** TypeScript、Vitest、Node `fs/path` API、`packages/coding-agent` workspace。

---

## 范围

- 工作目录：`D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\pi-5418`
- 分支：`codex/fix-models-json-migration-error-path`
- 只修改 `packages/coding-agent` 的迁移代码和相关回归测试。
- 不修改 dashboard、构建产物、依赖、lockfile、release 文件。
- 不推送、不创建 PR、不提交 commit。

## 根因

`packages/coding-agent/src/migrations.ts` 的 `migrateModelsJsonConfigValues(agentDir)` 在迁移 `models.json` 配置值时直接执行：

```ts
const parsed = JSON.parse(stripJsonComments(readFileSync(modelsPath, "utf-8"))) as unknown;
```

如果 `models.json` malformed，启动迁移阶段会直接冒出原始 `SyntaxError`，错误信息没有 `models.json` 路径。正常模型加载路径 `packages/coding-agent/src/core/model-registry.ts` 已在 `loadCustomModels()` 中捕获 `SyntaxError` 并返回：

```text
Failed to parse models.json: <message>

File: <modelsJsonPath>
```

## 文件结构

- Modify: `packages/coding-agent/test/config-value-migration.test.ts`
  - 在现有配置值迁移测试中增加最小回归：malformed `models.json` 通过 `runMigrations()` 抛出带文件路径的解析错误。
- Modify: `packages/coding-agent/src/migrations.ts`
  - 在 `migrateModelsJsonConfigValues()` 中将 `modelsPath` 改为 resolved path，并捕获 `SyntaxError` 转换为带 `File:` 的 `Error`。

## 执行步骤

### Task 1: 写 RED 回归测试

**Files:**
- Modify: `packages/coding-agent/test/config-value-migration.test.ts`

- [ ] **Step 1: Write the failing test**

在同一个 `describe("config value env var syntax migration", () => { ... })` 中追加：

```ts
	it("reports models.json parse errors with the file path during config value migration", () => {
		const agentDir = createAgentDir();
		const modelsJsonPath = path.join(agentDir, "models.json");
		fs.writeFileSync(modelsJsonPath, '{ "providers": { "custom-provider": }', "utf-8");

		expect(() => withAgentDir(agentDir, () => runMigrations(agentDir))).toThrowError(
			new RegExp(`Failed to parse models\\.json:[\\s\\S]*File: ${modelsJsonPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
		);
	});
```

- [ ] **Step 2: Run test to verify RED**

Run from `packages/coding-agent`:

```powershell
node ../../node_modules/vitest/dist/cli.js --run test/config-value-migration.test.ts -t "reports models.json parse errors with the file path during config value migration"
```

Expected: FAIL because current code throws raw `SyntaxError` and the message does not contain `Failed to parse models.json` or `File: <path>`.

### Task 2: 最小实现

**Files:**
- Modify: `packages/coding-agent/src/migrations.ts`

- [ ] **Step 1: Write minimal implementation**

将 `path` import 扩展为 `resolve`：

```ts
import { dirname, join, resolve } from "path";
```

在 `migrateModelsJsonConfigValues()` 中只包解析阶段：

```ts
	const modelsPath = resolve(agentDir, "models.json");
	if (!existsSync(modelsPath)) return [];

	let parsed: unknown;
	try {
		parsed = JSON.parse(stripJsonComments(readFileSync(modelsPath, "utf-8"))) as unknown;
	} catch (error) {
		if (error instanceof SyntaxError) {
			throw new Error(`Failed to parse models.json: ${error.message}\n\nFile: ${modelsPath}`);
		}
		throw error;
	}
```

- [ ] **Step 2: Run test to verify GREEN**

Run from `packages/coding-agent`:

```powershell
node ../../node_modules/vitest/dist/cli.js --run test/config-value-migration.test.ts -t "reports models.json parse errors with the file path during config value migration"
```

Expected: PASS.

### Task 3: 回归范围验证

**Files:**
- Verify: `packages/coding-agent/test/config-value-migration.test.ts`
- Verify: `packages/coding-agent/src/migrations.ts`

- [ ] **Step 1: Run full migration test file**

Run from `packages/coding-agent`:

```powershell
node ../../node_modules/vitest/dist/cli.js --run test/config-value-migration.test.ts
```

Expected: PASS，确认原有 `auth.json` 和有效 `models.json` 迁移行为未破坏。

- [ ] **Step 2: Run repository check if feasible**

Run from repo root:

```powershell
npm run check
```

Expected: PASS；如果本机耗时、环境或依赖阻塞，记录完整阻塞原因，不用 workaround。
