# cnYui PR 反馈巡检记录

- 运行时间：2026-07-24T09:06:37+09:00
- 自动化：`cnyui-pr`
- 基线：2026-07-23T12:01:30.375Z
- 账号：`cnYui`
- 结论：当前 23 个 open PR；基线后没有新的外部 issue comment、review、review comment、requested changes、失败 check/status，也没有 authored PR 被合并或关闭。

## 核验方法

- `gh auth status` 确认当前以 `cnYui` 登录。
- `gh search prs --author cnYui --state open --limit 200` 获取 open PR 列表。
- REST Search：`is:pr author:cnYui is:open` 返回 `total_count=23`，`incomplete_results=false`。
- GraphQL Search：`is:pr author:cnYui is:open` 返回 `issueCount=23`，`hasNextPage=false`。
- 对每个 open PR 拉取：
  - `gh pr view`：merge state、review decision、head sha、status rollup。
  - `issues/{number}/comments`：issue comments。
  - `pulls/{number}/reviews`：reviews / requested changes。
  - `pulls/{number}/comments`：inline review comments。
  - `issues/{number}/events`：closed、reopened、review request、label 等事件。
  - `commits/{sha}/check-runs` 与 `commits/{sha}/status`：head commit checks/status。
- 关闭/合并交叉检查：
  - `is:pr author:cnYui closed:>=2026-07-23` 返回 0。
  - `is:pr author:cnYui merged:>=2026-07-23` 返回 0。

## 当前 open PR

- https://github.com/zarazhangrui/lark-coding-agent-bridge/pull/199
- https://github.com/Justin0504/Aegis/pull/8
- https://github.com/hunar2006/palizade/pull/8
- https://github.com/cyyself/OpenTihui/pull/1
- https://github.com/Wei-Shaw/sub2api/pull/3453
- https://github.com/guofei9987/blind_watermark/pull/179
- https://github.com/mcpjungle/MCPJungle/pull/274
- https://github.com/router-for-me/CLIProxyAPI/pull/3802
- https://github.com/t42ji2ji/keyfarm/pull/5
- https://github.com/trycua/cua/pull/1873
- https://github.com/getzep/graphiti/pull/1568
- https://github.com/coderamp-labs/gitingest/pull/583
- https://github.com/anthropics/skills/pull/1281
- https://github.com/MiniMax-AI/MiniMax-MCP/pull/90
- https://github.com/getzep/graphiti/pull/1539
- https://github.com/CopilotKit/CopilotKit/pull/5296
- https://github.com/MemTensor/MemOS/pull/1894
- https://github.com/jackwener/OpenCLI/pull/1870
- https://github.com/thinking-machines-lab/tinker-cookbook/pull/741
- https://github.com/cnYui/personal-knowledge/pull/5
- https://github.com/cnYui/personal-knowledge/pull/4
- https://github.com/Hai-qq/SW/pull/2
- https://github.com/Hai-qq/SW/pull/1

## 旧阻塞

以下失败信号都早于本轮基线，不重复评论、不空推送：

- https://github.com/trycua/cua/pull/1873：Vercel 仍为授权失败，更新时间 2026-06-09T04:09:12Z。
- https://github.com/getzep/graphiti/pull/1568：`triage` 与 `CLAAssistant` 仍失败，完成时间 2026-06-09T01:19Z 左右。
- https://github.com/getzep/graphiti/pull/1539：`CLAAssistant` 仍失败，完成时间 2026-06-07T01:08:59Z。
- https://github.com/CopilotKit/CopilotKit/pull/5296：多个 Vercel preview 仍为授权失败，更新时间 2026-06-06T10:10:10Z。

## 本轮处理

- 新反馈：0。
- 新 requested changes：0。
- 新失败 CI / status：0。
- 新合并或关闭：0。
- 自动回复：无。
- 自动修复：无。
- 提交 / 推送：无。
