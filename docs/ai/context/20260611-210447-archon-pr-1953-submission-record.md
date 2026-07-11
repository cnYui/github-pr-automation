# Archon PR #1953 提交记录

## 结果

- 上游仓库：`coleam00/Archon`
- issue：`#1895`
- PR：https://github.com/coleam00/Archon/pull/1953
- 工作目录：`D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\Archon-1895`
- 分支：`codex/fix-workflow-bash-output-quoting`
- commit：`7ae10e84e80a462972b2f5bd902189f974185085`
- base：`dev`
- PR 状态：open，非 draft，mergeable 为 `MERGEABLE`

## 改动范围

- 清理 `bash:` body 中被 validator 报出的 `"$node.output"` 双引号写法。
- shipped default：`.archon/workflows/defaults/archon-fix-github-issue.yaml`
- tracked workflow hygiene：
  - `.archon/workflows/test-workflows/e2e-*.yaml`
  - `.archon/workflows/e2e-opencode-*.yaml`
  - `.archon/workflows/experimental/archon-fix-github-issue-experimental.yaml`
  - `.archon/workflows/experimental/archon-release.yaml`
  - `.archon/workflows/maintainer/maintainer-review-pr.yaml`
- 刷新 `packages/workflows/src/defaults/bundled-defaults.generated.ts`。
- 未修改 `when:`、`prompt:`、`command:` 等非 bash 文本；保留 `e2e-structured-output-failfast` 的负向 smoke。

## 验证

- `bun run check:bundled`：通过，36 commands / 20 workflows up to date。
- `bun run cli validate workflows`：退出 1，但 `[bash]` warning 只剩 `e2e-structured-output-failfast` 的故意负向 smoke；退出 1 来自既有 `.archon/mcp/ntfy.json` 缺失、以及 Windows shell 下 runtime availability warning。
- `bun test packages/workflows/src/validator.test.ts`：通过，54 pass / 1 skip / 0 fail。
- `git diff --check HEAD^ HEAD`：通过。
- `bun run validate`：部分通过；`check:bundled`、`check:bundled-skill`、`check:bundled-schema`、type-check、lint、format 均通过；最后在全量 test 阶段失败。

## 遗留 blocker

- `bun run validate` 的失败点是既有 core 测试：
  - `packages/core/src/db/workflows.resume-cas.integration.test.ts`
  - 单独复跑 `bun test packages/core/src/db/workflows.resume-cas.integration.test.ts` 也失败。
  - 错误为 `SqliteAdapter(':memory:')` 初始化时 `mkdirSync` 抛 `ENOENT`，与本次 workflow YAML 改动无关。
- `bun install` 在本机 Windows/Bun 1.3.5 下曾被 `@mistralai/mistralai@2.2.1` link/copy 卡住；未提交 lockfile 或依赖状态改动。

## 远端 checks 初始状态

- `CodeRabbit`：pending，Review in progress。
