# 全网 PR 机会刷新记录

## 本轮范围

- 时间：2026-06-09
- 入口：GitHub Search API、GitHub issue/PR metadata、GitHub Trending 页面尝试、Reddit / Hacker News / 社区搜索线索。
- 页面落地：已刷新 `public/reports/latest.json` 与 `dist/reports/latest.json`。
- 代码边界：未修改 `src/`、`index.html`、样式或扫描器代码。

## 数据取舍

- GitHub Trending daily HTML 在本轮抓取时噪声过大，未稳定抽取出 `stars today`。
- 本轮候选主要来自 GitHub Search API 的高 star、近期活跃 AI agent / MCP / CLI / computer-use 项目，再回到具体 open issue 核验。
- 因没有可靠 24 小时 star 增量来源，`starsAdded24h` 保守置为 `0`，不伪造热度数字。
- Reddit / HN / 社区搜索只作为“需求方向”入口，不作为直接入选依据；最终入选必须能落到 GitHub open issue。

## 入选候选

1. `googleworkspace/cli#839`
   - 方向：修复 `gws <service> <resource> --help` Usage 缺少 service 层级。
   - 证据：issue 仍 open，复现清楚，明确说明错误 Usage 会误导 agent。
   - 查重：未发现 open PR；同仓 `#789` 已有 PR `#805`，因此排除 `#789`。
   - 建议：值得继续。

2. `trycua/cua#1868`
   - 方向：为 PyPI distributions 和 `libs/` 独立包补 license metadata / LICENSE 文件。
   - 证据：issue 仍 open，用户明确说明企业 JFrog Artifactory 因缺少 license metadata 阻止安装。
   - 查重：未发现 open PR。
   - 建议：值得继续。

3. `upstash/context7#300`
   - 方向：补充 Docker MCP Toolkit / stdio 配置说明，尤其是 `MCP_TRANSPORT=stdio`。
   - 证据：多名用户反馈 Docker MCP Toolkit 初始化失败；评论中 workaround 获高反应，维护者明确欢迎 README update。
   - 查重：未发现 open PR。
   - 建议：值得继续；范围只限 README/配置示例，不碰 Dockerfile 默认 transport。

4. `ChromeDevTools/chrome-devtools-mcp#2181`
   - 方向：修复外部 headless Chrome attach 模式下 `list_console_messages({ types: ["issue"] })` 返回空。
   - 证据：issue 仍 open，复现、版本、MCP 配置和自动化断言都完整。
   - 查重：未发现 open PR。
   - 建议：谨慎；依赖 Chrome/headless/Windows 环境，先复现再改。

5. `aaif-goose/goose#9582`
   - 方向：定位 Windows ACP stdio 子进程模式下 shell tool 丢失 stdout/stderr。
   - 证据：issue 仍 open，复现命令和实际/期望输出清楚。
   - 查重：未发现 open PR。
   - 建议：谨慎；根因还未确认，Windows + ACP + Rust async pipe 复现成本较高。

6. `open-webui/open-webui#25830`
   - 方向：修复 OpenAI-compatible connection 配置 Prefix ID 后 eject/unload 请求仍带内部前缀导致 404。
   - 证据：issue 仍 open，复现路径和截图齐全；related-issues bot 的相似项被提交者点踩。
   - 查重：未发现 open PR。
   - 建议：谨慎；仓库大且相似 model-id 历史问题较多，先定位调用路径和回归测试。

## 排除项

- `googleworkspace/cli#789`：已有 open PR `#805` 覆盖，不重复推进。
- `ChromeDevTools/chrome-devtools-mcp#2156`：已有 open PR `#2166` 和 `#2175` 覆盖，不重复推进。
- `open-webui/open-webui#25817`：bot 指向同类旧 issue `#3259`，重复风险高，未纳入。
- Reddit / HN 搜索中的泛化需求：未能稳定落到具体 open issue 的线索不进入页面。

## 后续建议

- 优先开工顺序：`googleworkspace/cli#839`、`trycua/cua#1868`、`upstash/context7#300`。
- 如果需要代码 PR，建议三个方向分开独立 worktree 或子 agent，不要在日报主控仓里直接改上游代码。

## 验证记录

- `npx tsx -e "...parseReport(...)"`：`public/reports/latest.json` 与 `dist/reports/latest.json` 均通过现有 Zod schema。
- `npx vitest run src/web/report-view.test.ts src/scanner/star-snapshots.test.ts src/scanner/scan-runner.test.ts src/scanner/repository-signals.test.ts src/scanner/report-builder.test.ts src/scanner/candidates.test.ts src/shared/report-schema.test.ts`：7 个文件、14 个测试通过。
- `git diff --check`：通过，仅提示现有 Windows 换行警告。
- `npm test`：不作为本轮通过依据；当前 Vitest 配置没有排除 `work/**`，会扫描上游仓库副本并在 `work/MemOS/.../onnxruntime-node` / 缺少 API key 等外部测试处失败。
