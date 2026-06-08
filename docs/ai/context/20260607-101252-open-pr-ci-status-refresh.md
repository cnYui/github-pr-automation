# 2026-06-07 open PR CI 状态刷新

## 范围

- 核对账号：`cnYui`
- 检索口径：GitHub PR search `author:cnYui state:open`
- 当前 open PR 数量：13
- 核对时间：2026-06-07 10:12 JST
- 核对方式：读取每个 PR 的 check runs 与 classic commit statuses；对 `graphiti#1539` 额外读取 PR 评论。

## 当前仍有失败信号的 PR

| PR | 当前失败项 | 判断 |
| --- | --- | --- |
| `getzep/graphiti#1539` | `CLAAssistant` failure | 不是代码测试失败。`ruff`、`check-fork`、`triage` 已成功，`review` skipped；triage 评论给出 `merge-ready`，但 CLA 未签仍阻塞合并。 |
| `CopilotKit/CopilotKit#5296` | 4 个 Vercel classic statuses failure：`form-filling`、`research-canvas`、`chat-with-your-data`、`travel` | 不是代码测试失败。失败描述均为 `Authorization required to deploy.`；`Vercel – docs` 已 success。 |
| `cclank/cell-architecture-studio#8` | classic status `Vercel` failure | 不是代码测试失败。失败描述为 `Account is blocked.`；PR 仍是 draft。 |

## 当前没有失败但远端信号不足的 PR

| PR | 远端信号 | 判断 |
| --- | --- | --- |
| `GLips/Figma-Context-MCP#384` | check runs 0，classic statuses 0 | 没有远端 CI 信号。 |
| `MemTensor/MemOS#1894` | check runs 0，classic statuses 0 | 没有远端 CI 信号。 |
| `czlonkowski/n8n-mcp#836` | check runs 0，classic statuses 0 | 没有远端 CI 信号。 |
| `jackwener/OpenCLI#1870` | check runs 0，classic statuses 0 | 没有远端 CI 信号。 |
| `chopratejas/headroom#649` | `GitGuardian Security Checks` success；classic statuses 0 | 只有安全扫描成功，不等于项目 CI。PR 仍是 draft。 |
| `cnYui/personal-knowledge#5` | check runs 0，classic statuses 0 | 没有远端 CI 信号。 |
| `cnYui/personal-knowledge#4` | check runs 0，classic statuses 0 | 没有远端 CI 信号。 |
| `Hai-qq/SW#2` | check runs 0，classic statuses 0 | 没有远端 CI 信号。 |
| `Hai-qq/SW#1` | check runs 0，classic statuses 0 | 没有远端 CI 信号。 |

## 当前远端 checks 全绿的 open PR

| PR | 远端 checks | 判断 |
| --- | --- | --- |
| `thinking-machines-lab/tinker-cookbook#741` | `test` success、`downstream-compat` success、`type-check` success、`pre-commit` success | 当前没有失败项。 |

## 和 2026-06-06 核对相比的变化

- `graphiti#1539` 状态改善：`triage` 已从失败/运行中变为 success，`ruff` 也成功；剩余阻塞集中在 CLA。
- 新纳入 5 个旧 open PR：`tinker-cookbook#741`、`personal-knowledge#4/#5`、`Hai-qq/SW#1/#2`。
- `tinker-cookbook#741` 当前远端 checks 全部成功。
- `CopilotKit#5296`、`cell-architecture-studio#8` 的 Vercel 失败原因没有变化。
- `Figma-Context-MCP#384`、`MemOS#1894`、`n8n-mcp#836`、`OpenCLI#1870`、`headroom#649` 仍没有项目 CI 结果。

## 处理建议

1. 先处理 `graphiti#1539`：按 CLA bot 评论格式签署 CLA，这是当前最明确、最可操作的失败项。
2. `CopilotKit#5296` 和 `cell-architecture-studio#8` 不建议改代码来绕过 Vercel；需要团队授权或 Vercel 账号恢复。
3. 对没有 CI 信号的外部 PR，优先在 PR 评论里补充本地验证结果并请求维护者批准或重跑 Actions。
4. `headroom#649`、`cell-architecture-studio#8` 如果要推进维护者评审，先转出 draft。
