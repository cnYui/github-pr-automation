# cnYui PR 反馈巡检记录

- 运行时间：2026-07-18 21:08:09 +09:00
- 自动化：`cnyui-pr`
- 基线：`2026-07-18T00:02:10.616Z`
- 账号：`cnYui`

## 检查范围

- 当前 open PR：24 个。
- 枚举方式：`gh search prs --author cnYui --state open --sort updated --order desc --limit 100`。
- 交叉确认：`gh api -X GET search/issues -f q='author:cnYui is:pr is:open' -f per_page=1` 返回 `total_count=24`、`incomplete_results=false`。
- 关闭/合并补查：`gh search prs --author cnYui --state closed --updated '>=2026-07-18T00:02:10Z'` 返回空数组。
- 自动化 memory 末尾尚未包含 2026-07-18 早间巡检，本轮额外读取 `docs/ai/context/20260718-090956-cnyui-pr-feedback-monitor.md` 避免重复处理。

## 核验内容

- 每个 open PR 均用 `gh pr view` 回读 PR 状态、`mergeStateStatus`、`mergeable`、`reviewDecision`、head SHA 和 `statusCheckRollup`。
- 每个 open PR 均回读 issue comments、reviews 和 pull review comments。
- 对 `statusCheckRollup` 中的失败项按时间过滤，只把晚于基线的失败或 `ACTION_REQUIRED` 视为本轮可动作信号。

## 结论

- 基线后没有新的外部 issue comment、review、requested changes 或行级 review comment。
- 基线后没有新增失败 check/status 或 `ACTION_REQUIRED` check。
- 基线后没有 `cnYui` authored PR 合并或关闭。
- 本轮未自动回复、未修代码、未提交、未推送。

## 新增 open PR

- `zarazhangrui/lark-coding-agent-bridge#199`：`updatedAt=2026-07-18T09:25:11Z`，head `d71852f553dad1609e5476c7c0653064fd02e5a7`，当前无评论、无 review、无行级评论、无远端 checks；`mergeable=MERGEABLE`，`mergeStateStatus=UNSTABLE` 仅表示缺少状态检查信号。

## 旧阻塞

- `trycua/cua#1873`：旧 Vercel 授权 failure，时间仍为 `2026-06-09T04:09:12Z`。
- `getzep/graphiti#1539`：旧 `CLAAssistant` failure，时间仍为 `2026-06-07T01:08:59Z`。
- `getzep/graphiti#1568`：旧 `CLAAssistant` 和 `triage` failure，时间仍为 `2026-06-09T01:19:00Z` / `2026-06-09T01:19:10Z`。
- `CopilotKit/CopilotKit#5296`：旧 Vercel 授权 failures，时间仍为 `2026-06-06T10:10:10Z`。

这些阻塞均早于本轮基线，且没有伴随新的维护者反馈或新增失败 CI，本轮不重复回复或空推送。

## 已检查 open PR

- `zarazhangrui/lark-coding-agent-bridge#199`
- `router-for-me/CLIProxyAPI#3802`
- `trycua/cua#1873`
- `Justin0504/Aegis#8`
- `MemTensor/MemOS#1894`
- `hunar2006/palizade#8`
- `cyyself/OpenTihui#1`
- `Wei-Shaw/sub2api#3453`
- `guofei9987/blind_watermark#179`
- `getzep/graphiti#1539`
- `coleam00/Archon#1953`
- `mcpjungle/MCPJungle#274`
- `t42ji2ji/keyfarm#5`
- `getzep/graphiti#1568`
- `MiniMax-AI/MiniMax-MCP#90`
- `coderamp-labs/gitingest#583`
- `anthropics/skills#1281`
- `CopilotKit/CopilotKit#5296`
- `jackwener/OpenCLI#1870`
- `thinking-machines-lab/tinker-cookbook#741`
- `cnYui/personal-knowledge#5`
- `cnYui/personal-knowledge#4`
- `Hai-qq/SW#2`
- `Hai-qq/SW#1`
