# 最新 PR 问题核对记录

时间：2026-06-09 20:21 JST

## 核对口径

- `gh search prs --author cnYui --state open --sort updated --order desc --limit 10`
- `gh search prs --author cnYui --sort created --order desc --limit 10`
- 对目标 PR 使用 `gh pr view ... --json statusCheckRollup,mergeStateStatus,mergeable,reviewDecision,latestReviews,comments,commits,files`
- 对 review inline comment 使用 `gh api repos/{owner}/{repo}/pulls/{number}/comments --paginate`

## 最新创建的外部 open PR：router-for-me/CLIProxyAPI#3781

PR：https://github.com/router-for-me/CLIProxyAPI/pull/3781

- 状态：open，base 已由仓库 action 自动从 `main` 改为 `dev`
- head：`c6cd991fffce598a2a79320fcc10b79ee1984309`
- mergeable：`MERGEABLE`
- merge state：`BLOCKED`
- review decision：`REVIEW_REQUIRED`
- 远端 checks：全部成功
  - `agents-md-guard / close-when-agents-md-changed`
  - `auto-retarget-main-pr-to-dev / retarget`
  - `pr-test-build / build`
  - `translator-path-guard / ensure-no-translator-changes`

需要处理的问题：

1. `internal/usage/event_sync.go` 的 sync 复用传入 `ctx` 发请求。由于 usage manager 是后台队列，传入的请求 context 可能在 HTTP 响应结束后被取消，导致 Shop 同步请求被 `context canceled` 跳过。这是实际可靠性问题，建议改为保留 event 构造使用请求上下文，但 outbound sync 使用独立 timeout context。
2. `internal/usage/event_sync.go` 默认使用 `http.DefaultClient`，没有明确 timeout，也可能受全局默认 client 修改影响。建议使用专用 `http.Client{Timeout: ...}`。
3. `internal/usage/event_writer.go` 每次写事件后都执行 `cleanupExpiredLedgers()`，会在热路径里反复 `ReadDir` 和 stat 文件。由于 usage manager 单 worker 串行处理，高并发下会放大磁盘 I/O 并阻塞队列。建议给 writer 增加 `lastCleanup`，按时间窗口限频。
4. `event_writer.go` 每次写都 `os.Chmod` 目录和文件。`MkdirAll(..., 0700)` 与 `OpenFile(..., 0600)` 已覆盖新建权限；热路径重复 chmod 价值低，可以移除或至少收窄。
5. 其他 Gemini 建议包括简化 file close、用 `entry.Info()` 替换 `os.Lstat`、用字符串前 7 位解析月份。这些是优化项，不如前三项紧急；月份解析建议需谨慎，因为当前 `time.Parse` 能兜底非法格式。

结论：`#3781` 没有 CI 失败，当前阻塞是需要 review。自动 review 中第 1 和第 3 项值得优先修；第 2、4 项可顺手做；第 5 项只取安全子集。

## 最近更新的 open PR：czlonkowski/n8n-mcp#836

PR：https://github.com/czlonkowski/n8n-mcp/pull/836

- 状态：open
- head：`0a009b30b9a361f69a832ed0874f4d3044e6af3f`
- mergeable：`MERGEABLE`
- merge state：`BLOCKED`
- review decision：`REVIEW_REQUIRED`
- 失败 checks：
  - `Test Suite / test`
  - `Build and Publish n8n Docker Image / build-and-push`
  - `Build and Push Docker Images / Build Docker Image`

失败原因：

- Docker 两个失败都是仓库 workflow 登录 registry 时缺少用户名密码：`Username and password required`，属于仓库 secret / fork 权限问题，不是本次代码直接失败。
- Test Suite 失败集中在 integration tests，错误是 `No response from n8n server`，例如 `tests/integration/n8n-api/workflows/*` 多个测试无法访问 n8n 服务。需要进一步确认这是仓库 CI 环境服务未启动还是 PR 改动触发；从错误形态看不像新增 normalizer 的直接单测回归。
- Codecov patch 是 success，但评论提示 `src/utils/mcp-input-normalizer.ts` 有 6 行未覆盖。
- Copilot inline review 有 2 个可处理代码点：
  - `normalizeMcpWorkflowNode` 会在输入没有 `credentials` 时也输出 `credentials: undefined`，这是可观察 shape change，建议只在输入存在该字段时输出。
  - `isDenseIndexRecord` 接受 `"00"` 这类非 canonical 数字键，会在重建数组时丢值，建议只允许 `"0"` 或无前导零的数字。

结论：`#836` 现在确实有新问题。代码侧优先处理 Copilot 两条评论；CI 失败需单独核对 upstream workflow 环境，不应直接归因到本 PR。

## 刚处理过但又有新维护者反馈：upstash/context7#2734

PR：https://github.com/upstash/context7/pull/2734

- 状态：open
- head：`4c9822798b32c94b65058e4c3e52b2723d228f8d`
- review decision：`CHANGES_REQUESTED`
- 远端 checks：无
- 已按上一条 maintainer 要求把内容从根 README 移到 `packages/mcp/README.md` 和 `docs/resources/all-clients.mdx`
- 新评论：maintainer 追问现有 Docker examples 是否也有错误，点名 Cline 示例，要求检查 Docker examples 是否有效

结论：`#2734` 仍需要响应维护者。下一步应逐个核对 docs 中 Docker/Cline/Roo/VS Code/Claude Desktop 示例，确认哪些需要 `MCP_TRANSPORT=stdio` 或 `--transport stdio`，再更新或回复。
