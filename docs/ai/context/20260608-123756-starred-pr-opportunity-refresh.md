# 2026-06-08 收藏仓库 PR 机会刷新

## 背景

用户要求先启动当前项目网页，再从 GitHub 最新项目或 `cnYui` 收藏仓库里筛选是否还有值得提交 PR 的机会。本次已确认当前网页由 Vite dev server 在 `http://127.0.0.1:5173/` 提供，页面读取 `public/reports/latest.json`。

## 查询口径

- 收藏仓库：`gh api -H "Accept: application/vnd.github.star+json" /users/cnYui/starred --paginate --slurp`
- open PR 去重：`gh search prs --repo <repo> "<issue/keyword>" --state open`
- open issue：按收藏时间、最近 push、Agent/MCP/Skill 相关性和可验证性优先
- 排除：已有 `cnYui` open PR 的仓库优先降级；已有重复 open PR 的 issue 直接排除；需要外部账号、真实云资源、GUI 人工验证的大功能降级

## 本轮排除项

- `op7418/guizang-social-card-skill#1`：已有 open PR #2 覆盖。
- `Lum1104/Understand-Anything#402`：已有 open PR #410 覆盖。
- `github/github-mcp-server#2202`：已有 PR #2633 覆盖。
- `earendil-works/pi`：PR #5467 被仓库门禁自动关闭，需先拿维护者 `lgtm`，不适合继续直接开同类 PR。
- `MiniMax-AI/MiniMax-MCP`、`MemTensor/MemOS`、`czlonkowski/n8n-mcp`、`GLips/Figma-Context-MCP`、`getzep/graphiti`、`jackwener/OpenCLI`：当前已有 `cnYui` open PR，暂不作为新机会优先项。
- `github/awesome-copilot`：当前活跃 issue 多数是自动 workflow、外部插件审核或提交者修复流程，不适合直接小 PR。

## 推荐候选

1. `anthropics/skills#1271`
   - 方向：修复 skill-creator 脚本在 Windows 默认 cp1252 下读取 UTF-8 SKILL.md 崩溃。
   - 证据：无重复 PR；`skills/skill-creator/scripts` 下存在多处无 encoding 的 `read_text()`/`write_text()`。
   - 风险：低。可用 UTF-8 fixture 做脚本级回归。

2. `ChatLab/ChatLab#195`
   - 方向：统一增量导入分析和执行阶段的 timestamp 归一化，处理字符串 timestamp。
   - 证据：无重复 PR；代码定位到 `packages/node-runtime/src/import/incremental-importer.ts` 的 `INVALID_TIMESTAMP` 检查。
   - 风险：低。可用 JSONL fixture 覆盖分析和执行一致性。

3. `coderamp-labs/gitingest#578`
   - 方向：修复 1024 字节抽样边界截断 UTF-8 多字节字符时误判 `[Binary file]`。
   - 证据：无重复 PR；代码定位到 `src/gitingest/schemas/filesystem.py` 的 `_decodes(chunk, "utf-8")` 判定。
   - 风险：低。仓库有 pytest 和 CI。

4. `github/github-mcp-server#2636`
   - 方向：调查 `issue_write` 关闭 issue 时 mutation 成功但 MCP 响应挂起。
   - 证据：无重复 PR；代码定位到 `pkg/github/issues.go` 的 `UpdateIssue`/`CloseIssue` mutation。
   - 风险：中。需先用 mock 复现响应路径，不能只凭 issue 描述改。

5. `modelcontextprotocol/servers#4288`
   - 方向：处理 `zod` 同时存在于 dependency 和 peerDependency 导致 pnpm strict isolation 缺包。
   - 证据：无重复 PR；仓库有 TypeScript workflow 和 CONTRIBUTING。
   - 风险：中。需确认 monorepo package 发布策略。

6. `upstash/context7#2527`
   - 方向：评估补 `prompts/list` 和 `resources/list` 空响应。
   - 证据：无重复 PR。
   - 风险：中。维护者已追问复现环境，应先复现或补 failing test。

## 已更新内容

- `public/reports/latest.json` 已刷新为 2026-06-08 的 6 个候选。
- 当前网页需要刷新浏览器页面后显示新报告。
