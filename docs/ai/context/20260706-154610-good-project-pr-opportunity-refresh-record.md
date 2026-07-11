# 2026-07-06 最近 PR 机会刷新记录

## 背景

- 用户要求用 `github-daily-pr-opportunity-scan` 再看最近有没有适合继续推进的项目。
- 已按项目约束先读取 `using-superpowers`，再读取 `github-daily-pr-opportunity-scan`。
- 当前仓满足 dashboard refresh mode：存在 `src/scanner/cli.ts`、`src/scanner/scan-runner.ts`、`public/reports/latest.json`。

## 已执行动作

- 用 `gh auth token` 注入 `GITHUB_TOKEN` 后运行 `npm run scan`。
- 自动报告已刷新到：
  - `public/reports/2026-07-06.json`
  - `public/reports/latest.json`
  - `data/snapshots/2026-07-06.json`
  - `data/snapshots/latest.json`
- 自动报告候选中只有 `Snailclimb/JavaGuide` 被标为 `值得继续`；其余多为超大仓、同向 PR 已打开或验证成本偏高。
- 追加 live GitHub 搜索：
  - `MCP` / `agent` / `CLI` / `documentation` + `good first issue`
  - `topic:mcp` / `topic:agent` / `topic:cli` / `topic:developer-tools`
  - 抽查 `agent-of-empires`、`osaurus`、`wecode-ai/Wegent`、`SapienXai/AgentOS`、`leynier/alera`
- 对候选做了 open PR 去重、issue body 检查、repo 元数据检查和源码树验证。

## 推荐排序

### 1. KrakenNet/fathom#114

- 地址：https://github.com/KrakenNet/fathom/issues/114
- 结论：值得继续。
- 切口：只改 `tests/test_cli.py` 模块 docstring 和 `scripts/generate_cli_docs.py` 注释，修正 CLI 命令数量从 6 到 9 的过期说明。
- 证据：
  - issue 给出精确文件、行号和 acceptance criteria。
  - open PR 中未发现同向修复；当前 open PR 是 `docs: include ssvc...` 和依赖更新。
  - 仓库有 `pyproject.toml`、`uv.lock`、目标测试 `tests/test_cli.py` 与 `tests/test_scripts/test_cli_docs_real.py`。
- 风险：仓库星标低，但 issue 质量高、范围极小。
- 本地验证：`uv run pytest tests/test_cli.py tests/test_scripts/test_cli_docs_real.py`，再跑 `git diff --check`。

### 2. TenantScale/sdk#21

- 地址：https://github.com/TenantScale/sdk/issues/21
- 结论：值得继续。
- 切口：为 `@tenantscale/mcp` 新增 Vitest 配置和测试，覆盖 4 个 MCP tool handler。
- 证据：
  - issue 明确列出文件 `packages/mcp/src/index.ts`、`packages/mcp/package.json` 和边界用例。
  - 当前没有 open PR。
  - 仓库已有 workspace `vitest.workspace.ts`，其他 package 已有 `vitest.config.ts`，`packages/mcp` 目前没有 test script。
- 风险：需要读 MCP handler 逻辑，改动比文档类稍大。
- 本地验证：先跑新增 MCP package 测试，再跑 workspace 相关 `pnpm test` 或目标 Vitest。

### 3. hunar2006/palizade#2

- 地址：https://github.com/hunar2006/palizade/issues/2
- 结论：值得继续。
- 切口：新增 coding-agent filesystem policy preset，并补 policy tests。
- 证据：
  - issue 范围明确：新增 `policies/*.yaml`、覆盖 tainted write、shell、network egress。
  - open PR 只有 `Add research read-only policy preset`，未覆盖 coding-agent preset。
  - 仓库有 `policies/`、`docs/policy.md`、`packages/core/src/arguments.ts` 和多组 Vitest。
- 风险：安全策略语义需要谨慎，不能只写 YAML 不验证。
- 本地验证：`pnpm test` 或目标 policy/core Vitest，再跑 `git diff --check`。

### 4. MonikaDvorackova/govai-core#144 或 #139

- 地址：
  - https://github.com/MonikaDvorackova/govai-core/issues/144
  - https://github.com/MonikaDvorackova/govai-core/issues/139
- 结论：谨慎。
- 切口：优先 #144 shell completion 文档；备选 #139 audit export CLI examples。
- 证据：
  - #136 已被 open PR #154 覆盖，所以不选。
  - #144 / #139 暂未发现同向 open PR。
  - 仓库文档和测试很多，适合 doc-only 或 examples-only 的小切口。
- 风险：仓库很大，文档体系复杂，容易误放位置或和现有页面重复。
- 本地验证：文档搜索校验、相关 CLI 帮助命令、`git diff --check`。

### 5. jon-the-dev/mcp_config_sync#23 或 #24

- 地址：
  - https://github.com/jon-the-dev/mcp_config_sync/issues/23
  - https://github.com/jon-the-dev/mcp_config_sync/issues/24
- 结论：谨慎。
- 切口：新增 Continue 或 Zed MCP client adapter，配 fixtures 与 round-trip tests。
- 证据：
  - #21 Cursor 已被 open PR #28 覆盖，所以不选。
  - 仓库有 `mcp_config_sync/apps.py`、`tests/test_apps.py`、`tests/test_sync.py` 和 pytest/mypy 配置。
- 风险：仓库最近 push 停在 2026-04-04，维护活跃度不如 issue 时间新。
- 本地验证：`pytest`、必要时 `mypy` / `flake8`，再跑 `git diff --check`。

### 6. agent-of-empires/agent-of-empires#1002

- 地址：https://github.com/agent-of-empires/agent-of-empires/issues/1002
- 结论：谨慎。
- 切口：新增 Tailscale remote access guide，并同步 docs navigation。
- 证据：
  - repo 近期活跃，约 2756 star。
  - issue 给出目标文档结构和现有 docs 位置。
  - open PR 中未看到直接覆盖 Tailscale guide 的同向 PR。
- 风险：仓库很活跃、open PR 多，且文档同步规则要严格遵守。
- 本地验证：文档构建或 docs sync 脚本、链接/导航搜索、`git diff --check`。

### 7. Snailclimb/JavaGuide 自动报告项

- 地址：https://github.com/Snailclimb/JavaGuide
- 结论：谨慎。
- 切口：自动报告看到两个文档勘误 issue：SSE 协议描述和大模型上下文窗口描述。
- 证据：`public/reports/latest.json` 将它标为唯一 `值得继续` 自动候选。
- 风险：非 Agent/MCP 方向，且大文档仓贡献噪声较高；只适合非常精确的 doc-only 修正。
- 本地验证：文档搜索、链接/格式检查、`git diff --check`。

## 已排除候选

- `waqarulwahab/llm-cost-estimator#5`：已有 open PR #9 覆盖 MCP prompt examples。
- `MattyMailers/smartmoving-mcp#5`：已有评论认领并有 open PR #11。
- `dcl632/phi-guard-mcp#3`：已有 open PR #9 覆盖 MCP client setup examples。
- `soroban-tools-hq/soroban-deploy-cli#76`：repo 当前 tree 只看到 `README.md`，issue 提到的 `src/index.ts` 不存在，先跳过。
- `andrewcb22/leaklens#2`：repo tree 只有 `README.md` 与 `package.json`，实现面不清楚，先跳过。
- `osaurus-ai/osaurus#232`：issue 评论显示疑似 duplicate / fixed by #1214，且本地验证依赖 macOS/模型下载路径，跳过。
- 自动报告中的 `cc-switch`、`ECC`、`yt-dlp`、`open-webui`、`n8n`、`dify`、`gemini-cli`、`puppeteer`、`ohmyzsh`：多为超大仓、同向 PR 已打开或默认验证成本过高。

## 建议

- 首选 `KrakenNet/fathom#114`：最小、最稳、验证轻。
- 第二选择 `TenantScale/sdk#21`：测试补充价值更高，但实现量比文档修正大。
- 如果想做 Agent/MCP 安全方向，选 `palizade#2`；但必须先读现有 policy tests，避免只改配置。
