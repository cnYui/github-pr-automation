# 2026-06-06 PR CI 状态核对

## 范围

- 核对账号：`cnYui`
- 检索口径：GitHub PR search `author:cnYui created:>=2026-06-06`
- 返回数量：10 个 PR
- 核对时间：2026-06-06 21:27 JST
- 核对方式：GitHub API 读取 PR 详情、head commit check runs、combined commit statuses、关键 workflow 触发条件和 PR 评论。

## 总体判断

当前问题不是多数 PR 的代码测试失败，而是多数外部 fork PR 没有得到完整远端 CI 信号。

- 真正有项目测试 workflow 通过的：`cnYui/SpeakMore#100`、`cnYui/yui.web#1`。
- 远端有失败信号但属于外部服务或机器人：`getzep/graphiti#1539`、`CopilotKit/CopilotKit#5296`、`cclank/cell-architecture-studio#8`。
- 项目 CI 完全没有 check run：`czlonkowski/n8n-mcp#836`、`MemTensor/MemOS#1894`、`jackwener/OpenCLI#1870`、`GLips/Figma-Context-MCP#384`。
- 只有安全扫描，没有项目 CI：`chopratejas/headroom#649`。

## 明细

| PR | 状态 | 远端 checks/status | 判断 |
| --- | --- | --- | --- |
| `cclank/cell-architecture-studio#8` | open draft | check runs 0；classic status `Vercel` failure，描述为 `Account is blocked.` | 不是测试失败；Vercel 账号侧阻塞。仓库没有可读的 `.github/workflows` 目录。 |
| `getzep/graphiti#1539` | open | check runs：`CLAAssistant` failure，`triage` failure，`review` failure，`check-fork` success，`triage-batch` skipped | 没有项目测试 CI；阻塞来自 CLA/机器人任务。优先处理 CLA，再等维护者或仓库机器人恢复。 |
| `CopilotKit/CopilotKit#5296` | open | check runs：`Vercel Preview Comments` success，`auto-merge` skipped；classic statuses：docs preview success，4 个 Vercel preview failure，描述为 `Authorization required to deploy.` | docs 预览成功；其他 Vercel 项目需要 CopilotKit 团队授权。没有看到常规 unit/static test check。 |
| `czlonkowski/n8n-mcp#836` | open | check runs 0；classic statuses 0 | 上游有 `.github/workflows/test.yml`，并监听 `pull_request` 到 `main`，但本 PR 没有触发 run。更像 fork PR Actions 需要维护者批准或仓库策略阻止自动运行。 |
| `MemTensor/MemOS#1894` | open | check runs 0；classic statuses 0 | `python-tests.yml` 监听 `pull_request`，但本 PR 没有 run；真正相关的 `openclaw-plugin-publish.yml` 只支持 `workflow_dispatch`，不是 PR gate。 |
| `jackwener/OpenCLI#1870` | open | check runs 0；classic statuses 0 | 上游 `ci.yml` 监听 `pull_request` 到 `main/dev`，但本 PR 没有触发 run。更像 fork PR Actions 需要维护者批准或仓库策略阻止自动运行。 |
| `GLips/Figma-Context-MCP#384` | open | check runs 0；classic statuses 0 | 上游 `ci.yml` 监听 `pull_request` 到 `main`，但本 PR 没有触发 run。更像 fork PR Actions 需要维护者批准或仓库策略阻止自动运行。 |
| `chopratejas/headroom#649` | open draft | check runs：`GitGuardian Security Checks` success；classic statuses 0 | 上游 `ci.yml` 和 `rust.yml` 都监听 `pull_request`，且本 PR 命中代码路径，但项目 CI 没有出现。当前只有安全扫描，不等于 CI 通过。 |
| `cnYui/SpeakMore#100` | merged | check runs：`Test and build` success | 已有项目 workflow 成功后合并。 |
| `cnYui/yui.web#1` | merged | check runs：`validate` success，`deploy` skipped | validate 已通过；deploy 因条件跳过，不是失败。 |

## 根因分组

### 需要维护者或仓库权限动作

- `n8n-mcp#836`
- `OpenCLI#1870`
- `Figma-Context-MCP#384`
- `headroom#649`

这些仓库的 workflow 文件存在并监听 `pull_request`，但 PR head commit 没有项目 CI check run。可操作动作不是改代码，而是等维护者批准 Actions，或在 PR 评论里明确请求维护者运行 CI。

### 外部服务阻塞

- `cell-architecture-studio#8`：Vercel 账号被 blocked。
- `CopilotKit#5296`：Vercel 部分 preview 需要团队授权；docs preview 已成功。

这类失败不代表测试失败，也不适合用代码 workaround。

### 机器人/合规阻塞

- `graphiti#1539`：`CLAAssistant` failure 需要优先处理；`triage` 和 `review` failure 看起来是仓库机器人任务，不是项目测试。

## 建议顺序

1. 先处理 `graphiti#1539` 的 CLA。CLA failure 会直接影响合并资格。
2. 对 `n8n-mcp#836`、`OpenCLI#1870`、`Figma-Context-MCP#384`、`headroom#649` 留一条简短评论，请维护者批准或重新运行 GitHub Actions，并附本地验证命令。
3. `headroom#649` 和 `cell-architecture-studio#8` 仍是 draft；如果已准备好让维护者跑 CI，应先转为 ready for review。
4. `CopilotKit#5296` 不需要为 Vercel 授权失败改代码；可说明 docs preview 已 ready，其余 preview 需要团队授权。
5. 本地验证不足的 PR 后续按仓库逐个补齐，不要把“远端没跑”当成“代码已验证完整”。

## 当前本地记录已覆盖的验证

- `headroom#649`：本地 ruff、mypy、SSE 回归、`make ci-precheck-python`、`make ci-precheck-rust` 已通过；Docker e2e 未跑。
- `Figma-Context-MCP#384`：相关 Vitest、type-check、lint 已跑；完整 `pnpm test` 因 Windows 上游既有 `spawn tsx ENOENT` 未作为最终通过项。
- `OpenCLI#1870`：相关 Vitest 和 `npx tsc --noEmit` 已跑；未跑完整 `npm test`。
- `MemOS#1894`：相关 Vitest 和 `npm run build` 已跑。
- `n8n-mcp#836`：相关 Vitest、`npm run typecheck`、`npm run build` 已跑；`npm ci` 因上游 lockfile 不一致未用作本地安装方式。
- `graphiti#1539`：目标测试、driver 测试、ruff format/check、pyright 已跑。
- `CopilotKit#5296`：坏链搜索、新链接搜索和 `git diff --check` 已跑；没有远端常规测试信号。
