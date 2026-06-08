# 2026-06-07 GitHub PR 机会刷新记录

## 目标

继续从 `cnYui` starred repositories 和相关 Agent/MCP 项目里找值得提交 PR 的小切口，并刷新当前项目的只读报告数据。

本轮不自动 fork、不自动提交外部 PR。只做候选筛选、查重、风险判断和报告更新。

## 本轮设计与计划

必须满足的条件：

- 候选 issue 仍 open；
- 未发现直接覆盖该 issue 的 open PR；
- 切口能落在文档缺口、示例补全、测试补充、小 bug、CI/类型错误之一；
- 能用现有测试、最小复现脚本或本地验证闭环；
- Star 新增不作为硬门槛，`starsAdded24h` 统一保守记为 `0`。

执行计划：

1. 复核上一轮强候选 issue 当前状态。
2. 用 GitHub PR search 查 `issue number in:title,body is:open`，排除直接重复 PR。
3. 用 `gh repo view` 和 repository tree 检查语言、Star、license、CI、测试和 CONTRIBUTING。
4. 主榜只保留唯一仓库；同一仓库多个 issue 时选更小、更可控的切口。
5. 更新 `public/reports/latest.json`，再通过构建同步 `dist/reports/latest.json`。
6. 运行 schema 解析、构建和测试。

## GitHub 复核结果

### 入选主榜

| 排名 | 仓库 | Issue | 建议 | 关键判断 |
|---:|---|---|---|---|
| 1 | `earendil-works/pi` | [#5418](https://github.com/earendil-works/pi/issues/5418) | 值得继续 | invalid `models.json` 迁移解析错误缺文件路径，open PR 查重 0，CI/测试/CONTRIBUTING 完整 |
| 2 | `MiniMax-AI/MiniMax-MCP` | [#88](https://github.com/MiniMax-AI/MiniMax-MCP/issues/88) | 值得继续 | `text_to_audio` 校验在 try/except 外，#87 是 coverage PR 未修行为，测试目录存在 |
| 3 | `shareAI-lab/Kode-CLI` | [#166](https://github.com/shareAI-lab/Kode-CLI/issues/166) | 值得继续 | MCP 文本结果触发 Ink `<Text>` 约束，open PR 查重 0，CI/测试/CONTRIBUTING 完整 |
| 4 | `asheshgoplani/agent-deck` | [#1297](https://github.com/asheshgoplani/agent-deck/issues/1297) | 值得继续 | 全局 `default_path` fallback 范围小；同仓库 #1288 更大，本轮不作为主推 |
| 5 | `xpzouying/xiaohongshu-mcp` | [#710](https://github.com/xpzouying/xiaohongshu-mcp/issues/710) | 谨慎 | 无 session HTTP MCP 请求返回裸 400；需先验证协议行为，未发现测试目录 |
| 6 | `luckyPipewrench/pipelock` | [#683](https://github.com/luckyPipewrench/pipelock/issues/683) | 谨慎 | capture evidence 增加 `rpc_id` 价值高；涉及 schema 版本，且 issue 已有 assignee |
| 7 | `svnscha/mcp-windbg` | [#47](https://github.com/svnscha/mcp-windbg/issues/47) | 谨慎 | pipe 连接串 escape 问题明确；需要 Windows + WinDbg + pipe 环境验证 |

### 作为备选但不进主榜

- `asheshgoplani/agent-deck#1288`：OpenCode session 支持 `mcp attach/detach`，价值高，但范围明显大于 #1297；要处理 local/global config merge，且 `opencode.json` 不能覆盖其他字段。作为后续中等范围任务记录，不放进主榜重复占位。
- 上轮已降级的候选继续不主推：`HKUDS/nanobot`、`upstash/context7`、`max-sixty/worktrunk`、`Kaelio/ktx`、`farion1231/cc-switch` 等方向此前已发现开放 PR 覆盖或范围过大。本轮没有重新逐项写入报告。

## 报告更新取舍

- `candidateCount` 设为 7：主榜保留 7 个唯一仓库，不强行补满 10。
- `actionableCount` 设为 4：只统计 `推荐=值得继续` 的候选。
- `MiniMax-MCP` 报告为 `hasCi=false`、`hasContributing=false`：repository tree 未发现 `.github/workflows` 和 `CONTRIBUTING.md`。
- `xiaohongshu-mcp` 报告为 `hasTests=false`：repository tree 未发现明显测试目录或测试文件。
- `mcp-windbg` 报告为 `hasContributing=false`：repository tree 未发现 `CONTRIBUTING.md`。

## 后续推进顺序

1. 优先推进 `earendil-works/pi#5418`：最小 bug，错误信息改善，测试闭环清楚。
2. 其次推进 `MiniMax-MCP#88`：改动小，但缺 CI，需要本地 pytest 记录。
3. 再看 `Kode-CLI#166`：价值明确，需先定位 Ink 渲染路径。
4. `agent-deck#1297` 可作为 Go 小功能候选；不要先做 #1288。
5. `xiaohongshu-mcp#710`、`pipelock#683`、`mcp-windbg#47` 先克隆验证，不直接开改。

## 验证记录

```powershell
npx tsx -e "import { readFileSync } from 'node:fs'; import { parseReport } from './src/shared/report-schema.ts'; const report = parseReport(JSON.parse(readFileSync('public/reports/latest.json','utf8'))); console.log(report.items.length)"
npm run build
npx vitest run src
```

实际结果：

- `public/reports/latest.json` 通过 `parseReport`，输出 `7` 和 `4`。
- `dist/reports/latest.json` 通过 `parseReport`，输出 `7` 和 `4`。
- `npm run build` exit 0，Vite 构建成功。
- `npx vitest run src` 会扫入 `work/CopilotKit`、`work/OpenCLI` 等外部候选仓库，失败不代表当前项目报告数据失败。
- 显式运行当前项目 7 个测试文件通过：`7 passed`、`14 passed`。
- `git diff --quiet -- src index.html package.json package-lock.json` 输出 `no source/package/html diff`，本轮没有改源码、入口 HTML 或依赖清单。
