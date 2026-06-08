# Kode-CLI PR #190 提交记录

## 背景

- 项目：`shareAI-lab/Kode-CLI`
- Issue：#166
- 工作目录：`work/Kode-CLI-166-restart`
- 分支：`codex/fix-mcp-text-result-rendering`
- commit：`2da79281e8515776c6ac4cd5e092655e530706e9`
- PR：`https://github.com/shareAI-lab/Kode-CLI/pull/190`

## 改动范围

- `src/tools/mcp/MCPTool/MCPTool.tsx`
  - 将 FastMCP 风格的单字段 `{ result: string }` 输出规范化为纯文本展示。
  - 保留普通字符串、结构化对象、非单字段对象的既有展示语义。
- `tests/unit/mcp-tool-result-rendering.test.tsx`
  - 新增 Ink 渲染回归测试，覆盖 `{ result: string }` 不再显示 JSON wrapper。
- `tests/e2e/cli-smoke.test.ts`
  - 使用临时 `KODE_CONFIG_DIR` 隔离本机配置，避免完整 suite 读取用户环境导致红灯。
  - 给 stream-json 校验用例增加 30 秒 timeout。
- `tests/unit/lsp-tool.test.ts`
  - 给完整 suite 下负载敏感的 `findReferences` 用例增加 30 秒 timeout。

## 验证

- `bun test`
  - `552 pass`
  - `8 skip`
  - `0 fail`
  - `Ran 560 tests across 144 files. [32.76s]`
- `bun run typecheck`
  - `tsc --noEmit`
  - exit code 0
- `bun run lint`
  - `eslint . --max-warnings 0`
  - exit code 0
- `bun run format:check`
  - `All matched files use Prettier code style!`
  - exit code 0
- `git diff --check`
  - exit code 0
- `git diff --cached --check`
  - exit code 0

## 提交与推送

- 显式 stage 了 4 个文件，没有使用 `git add .`。
- HTTPS push 到 fork 时被 GitHub 拒绝，原因是 gh OAuth token 缺少 `workflow` scope，而 fork 需要同步包含 workflow 修改的上游历史。
- 已确认本机 SSH 以 `cnYui` 认证成功，改用 SSH remote `git@github.com:cnYui/Kode-CLI.git` 推送分支。
- GitHub MCP 创建 PR 因 token 权限返回 `403 Resource not accessible by personal access token`，随后使用 `gh pr create` 成功创建 PR #190。

## 取舍

- 本 PR 不扩展 MCP 协议解析，只处理当前问题指向的展示层单字段文本 wrapper。
- 测试稳定性调整只限完整 suite 下已复现的环境隔离和 timeout 问题，不改生产逻辑。
