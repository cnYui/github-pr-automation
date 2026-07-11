# 2026-07-11 合适 PR 项目刷新记录

## 目标

- 继续寻找可后续推进的低风险 PR 机会。
- 保留 Dashboard 报告 schema，不改扫描器实现。
- 对自动扫描结果做 live 复核，避免把高热仓库和粗糙证据误判为机会。

## 前置检查

- 已按项目要求读取 `using-superpowers`，并使用 `github-daily-pr-opportunity-scan`。
- 当前仓库符合 Dashboard refresh 模式：存在 `src/scanner/cli.ts`、`src/scanner/scan-runner.ts`、`public/reports/latest.json`。
- `gh auth status` 显示当前账号为 `cnYui`，可使用 GitHub GraphQL/API 只读核对。
- 工作区已有大量历史未提交/未跟踪文件；本轮只追加记录并刷新报告，不回退历史改动。

## PR 反馈巡检

- 查询 `author:cnYui is:pr is:open`，当前 open PR 数仍为 23。
- 从 2026-07-10 02:34:53Z 后只有 `MemTensor/MemOS#1894` 有更新。
- `MemTensor/MemOS#1894` 本轮更新无新增外部评论、review 或 review comment；仍是旧的 `DIRTY` / `CONFLICTING` 状态。
- 结论：本轮无必须优先处理的新增 PR 反馈。

## 自动扫描结果复核

- 2026-07-11 自动报告中 `n8n` 和 `JavaGuide` 被标为“值得继续”，但证据主要是文件名或宽泛 issue 标题，无法支撑低风险 PR 推荐。
- 对 `obsidian-local-rest-api#282` 做 live 复核后确认维护者已将根因转到上游 `markdown-patch#15`，且上游已在 `fc2cd2b` 修复，等待 npm 发布；不应直接在消费仓提交重复 PR。
- 对 `brigade#196` 做 live 复核后确认已有 open PR #200 覆盖 security scan bound/exclude 方向；不应重复推进。
- 对 `h5i#206/#215/#279` 做 open PR 查重后确认分别已有同向 PR 覆盖；保留未覆盖的 `h5i#204`。

## 本轮推荐

### 值得继续

1. `alfredoperez/speckit-companion#419`
   - 切口：归一化 custom workflow step command 的前导 slash，避免 `//to-spec`。
   - 证据：issue 有复现、acceptance criteria、代码路径；仓库无 open PR。
   - 验证：新增带 slash / 不带 slash 的命令解析测试，跑相关 Jest/Vitest。

2. `PerpetualSoftware/pad#902`
   - 切口：让 `pad item comment` 的 not-found 错误也带 ref 和 workspace。
   - 证据：issue 指向 `wrapItemNotFound` 和 `CreateComment`；open PR 无同向修复。
   - 验证：扩展 `internal/cli/item_notfound_test.go`，跑目标 Go 测试。

3. `h5i-dev/h5i#204`
   - 切口：新增 `phpunit` output filter 和 inline golden tests。
   - 证据：issue 有完整 acceptance criteria；open PR 只覆盖 bun、vibe tests、env log 等方向。
   - 验证：`cargo test builtin_golden_tests_pass` 与 `cargo test --test filter_quality`。

4. `Justin0504/Aegis#2`
   - 切口：gateway-mcp 初始化时补建 `agent_profiles` 表，避免 `ProfileManager` 启动即崩。
   - 证据：issue 给出 root cause 和目标表结构；open PR #3/#5 不覆盖该表。
   - 验证：新增数据库初始化回归测试，跑 `packages/gateway-mcp` 目标测试。

### 谨慎

- `bgreenwell/xleak#55`：TUI 水平滚动跳转问题明确，但维护者非常活跃，需先同步 main 确认未被快速修掉。
- `microsoft/mcp#2978/#2982`：文档缺口明确，但仓库大、CI 重、issue 带 `copilot` 标签，可能被内部自动化接管。
- `lerd-env/lerd#842`：根因清楚，但 PHP/FPM/composer 平台扩展名验证较重。
- `PagerDuty/pagerduty-mcp-server#115`：价值高但范围容易膨胀，首 PR 只能考虑 footprint 测量或单点 schema 精简。

### 跳过

- `coddingtonbear/obsidian-local-rest-api#282`：根因在上游 `markdown-patch`，且上游已修复。
- `escoffier-labs/brigade#196`：已有 open PR #200 覆盖。

## 写入内容

- 刷新 `public/reports/2026-07-11.json`。
- 刷新 `public/reports/latest.json`。
- 后续通过 build 生成 `dist/` 静态报告产物。
- 向 `AGENTS.md` 追加本轮项目记忆。

## 边界

- 本轮只做发现、核验和报告刷新。
- 未 fork、未 clone 外部仓库、未创建分支、未提交代码、未打开 PR。
