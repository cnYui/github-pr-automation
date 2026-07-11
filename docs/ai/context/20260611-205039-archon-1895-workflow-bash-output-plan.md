# Archon #1895 workflow bash 输出引用清理计划

## 背景

- 上游仓库：`coleam00/Archon`
- issue：`#1895`，当前 live 状态为 open。
- 精确查重：开放 PR 中未命中 `#1895`、`archon-fix-github-issue.yaml` + `$extract-issue-number.output`、或 `double-quote footgun`。
- 本地工作目录：`D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\Archon-1895`
- 工作分支：`codex/fix-workflow-bash-output-quoting`
- 上游默认工作分支：`dev`

## 必须解决的问题

`bash:` 节点中的 `$node.output` 会由 Archon 预先 shell-quote。默认 workflow 里仍存在 `"$extract-issue-number.output"`，并用 `tr -d` 兜底剥离引号。这个写法会触发 validator 的 `[bash]` double-quote warning，也把错误 idiom 继续作为 shipped default 分发。

## 设计

采用最小 YAML 修复，不改 validator：

- 只修改 `.archon/workflows/defaults/archon-fix-github-issue.yaml` 中 `fetch-issue` 的 bash body。
- 把 `ISSUE_NUM=$(echo "$extract-issue-number.output" | tr -d ... | grep ...)` 改为 `ISSUE_NUM=$(echo $extract-issue-number.output | grep -oE '[0-9]+' | head -1)`。
- 不触碰 `when:`、`prompt:`、`command:` 等非 bash 文本。
- 修改默认 workflow 后运行 `bun run generate:bundled`，刷新 `packages/workflows/src/defaults/bundled-defaults.generated.ts`。

## 取舍

- 不改 validator：当前 validator 已覆盖 bash 双引号 warning，本 issue 是清理 shipped workflow，不是 lint 规则缺陷。
- 范围从 shipped default 扩到 validator 报出的 tracked bash bodies：RED 输出显示 test-workflows、experimental、maintainer 中也有同类 `[bash]` warning。为贴合 issue acceptance，清理这些 bash body；保留 `e2e-structured-output-failfast` 的负向 smoke。
- 不把 install 环境问题写入上游改动：`bun install` 在 Windows/Bun 1.3.5 下被 `@mistralai/mistralai@2.2.1` link/copy 卡住，属于本机依赖安装状态，不是 PR 内容。

## TDD / validator-first 步骤

1. 在未修改前运行 `bun run cli validate workflows`，确认目标 workflow 触发 `[bash]` double-quote warning。
2. 如 CLI 无法直接运行，则退到现有 `packages/workflows/src/validator.test.ts` 的 warning 测试和目标 YAML 解析路径，先证明当前文件会触发 warning。
3. 修改目标 YAML 的 `fetch-issue` bash body。
4. 运行 `bun run cli validate workflows`，确认目标 warning 消失；若还有非目标 tracked warnings，按 issue 边界判断是否属于本次修复范围。
5. 运行 `bun run generate:bundled`，再运行 `bun run check:bundled` 或 diff 检查确认生成产物同步。
6. 运行 `git diff --check`；能跑则运行 `bun run validate`，外部环境失败要单独归因。

## 执行记录

- RED：`bun run cli validate workflows` 在未修改时显示 `archon-fix-github-issue` 的 `fetch-issue` 触发 `[bash]` double-quote warning，并列出多个 tracked workflow 同类 warning。
- GREEN：修改后 `bun run cli validate workflows` 中 `[bash]` warning 只剩 `e2e-structured-output-failfast` 的 `bad-ref` 负向 smoke；命令仍因既有 `.archon/mcp/ntfy.json` 缺失和 runtime PATH warning 退出 1。
- bundled：`bun run generate:bundled` 已刷新 `packages/workflows/src/defaults/bundled-defaults.generated.ts`，`bun run check:bundled` 通过。
- 目标单测：`bun test packages/workflows/src/validator.test.ts` 通过，结果为 54 pass / 1 skip / 0 fail。
- whitespace：`git diff --check` 通过。
- full validate：`bun run validate` 通过 bundled、type-check、lint、format，最后在 `bun run test` 的 `packages/core/src/db/workflows.resume-cas.integration.test.ts` 失败；单独复跑同一测试也失败。失败点是 `new SqliteAdapter(':memory:')` 在 Windows 路径语义下触发 `mkdirSync` ENOENT，与本次 workflow YAML 改动无关。

## PR 收尾计划

- 自查 `git status --short`、`git diff --stat`、`git diff`。
- 只 stage 目标 YAML 和生成文件。
- commit message：`fix: clean bundled workflow bash output quoting`
- 推送到 `cnYui` fork。
- 创建到上游 `dev` 的 PR，按 `.github/PULL_REQUEST_TEMPLATE.md` 填满摘要、验证、风险、回滚和 issue 链接。
- 创建后读取 PR URL、head SHA、初始 checks 状态。
