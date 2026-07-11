# GitHub PR 自动化流水线真实运行记录

## 运行结果

- Run ID：`20260711123938-745dbd`
- Lease：`2026-07-11T12:39:38.424Z-ad2c05`
- 报告快照：`public/reports/2026-07-11.json`
- 报告 SHA-256：`47a1ea90ec10a7820b20e992dda2b84d2006e5c774bf9d3bd92f96785766a620`
- 最终状态：`completed`
- 创建 PR：2 个
- `close` 后 `npm run pipeline -- status` 返回 `null`，`current.json` 与租约均已释放。

## PR 结果

### CognizenOrg/compatcanary #6

- PR：https://github.com/CognizenOrg/compatcanary/pull/6
- 分支：`cnYui:feat/list-probes`
- Commit：`6a417c0f7d255bbe236fde1a92e4f7751ba72e68`
- 改动：新增离线 `--list-probes`，复用 profile probe 选择逻辑，更新帮助、README 和测试。
- 验证：`npm run check`、20 项测试、两个真实 CLI 命令和 `git diff --check` 通过。
- 限制：`npm run evidence:check` 在干净上游 `main` 上已因陈旧 evidence 文件失败，本 PR 未修改 evidence。
- CI：仓库没有为该 Fork 分支上报 checks。

### briandconnelly/skills #52

- PR：https://github.com/briandconnelly/skills/pull/52
- 分支：`cnYui:style/agent-friendly-mcp-sentence-lines`
- Commit：`c89a9a4d0388e10be2d4a7c8c8a70d32fde33453`
- 改动：在 9 个 Markdown 文件中把 137 个一行多句位置拆成一句一行，只插入 193 个换行。
- 验证：严格候选剩余为 0，word diff 无词语增删，`git diff --check` 通过，`prek 0.3.11` 的 11 个 hook 全绿，frontmatter 与 43 个普通 JSON fence 验证通过。
- 限制：Issue 提供的 JSON 正则会误匹配 blockquote JSON fence，在干净上游 `main` 同样失败。
- CI：Actions run `29154426278` 为 `action_required` 且没有 jobs，需要维护者批准外部 Fork 工作流，记录为 pending 而非代码失败。

## 真实运行发现的问题

### 扫描器

1. `npm run scan -- --help` 不显示帮助，会执行真实扫描并覆盖当日报告。
2. CLI 静默忽略 `--limit`、`--language` 等参数，调用者无法确认参数是否生效。
3. 启发式结果会把 `n8n`、`JavaGuide` 这类没有具体低风险切口的大仓标为「值得继续」，必须依赖 live preflight 纠正。
4. 扫描器只更新 `public/reports`，不会同步 `dist/reports`，本轮需要人工同步四个报告文件。
5. 报告日期使用 UTC，同一天重复扫描会覆盖日期文件，缺少不可变扫描批次标识。
6. `starsAdded24h` 实际是任意两次快照的差值；冷启动还会把总 Star 数当成新增值，字段名与数据语义不一致。
7. GitHub API 请求缺少超时、重试、退避和 rate-limit 恢复策略。

### 流水线状态

1. Lease 没有后台 heartbeat，长时间实现只能依赖固定 240 分钟窗口，存在过期接管风险。
2. Lease 续租和状态写入之间存在 TOCTOU；跨阶段 JSON 也缺少 repository、branch、base SHA 和 commit SHA 的一致性校验。
3. `close` 在中途写入失败时可能遗留 lease，需要把释放动作设计成可恢复的幂等步骤。
4. 状态和 ledger 位于被忽略的 `data/`，适合固定本机定时任务，但如果定时任务每次使用全新 clone，恢复和跨日去重会失效。

### GitHub 与本地工具

1. `gh repo fork briandconnelly/skills --remote` 在当前版本不支持带仓库参数时配置 remote；切到仓库目录无参数执行后，Fork 创建成功，但因已有 `origin` 又未自动重命名而报错。最终需要显式执行 `git remote rename origin upstream` 和 `git remote add origin ...`。
2. `gh` 能完成认证、Fork、Issue/PR 查询、评论、PR 创建和 checks 查询，但不能替代本地文件修改、项目测试、Git 分支和 commit；完整流程仍必须组合 Codex、项目工具链、`git` 与 `gh`。
3. `uv tool install prek==0.3.11` 安装成功后，当前 PowerShell 会话不会自动更新 `PATH`；使用 `uv tool run --from prek==0.3.11 prek ...` 才能稳定执行。
4. 外部 Fork 的 GitHub Actions 可能进入 `action_required`，流水线需要区分「等待维护者批准」与真正的 CI failure。
5. 对包含旧 pnpm 断链目录的 `work/` 执行 `git status --ignored` 会产生大量目录警告；日常状态检查不应递归枚举全部 ignored worktree。

## 结论

当前主路径能够真实完成扫描结果复筛、不可变快照、live preflight、Fork、修改、验证、commit、push、PR 创建、结果记录和租约释放。它已经可用于固定本机仓库的定时任务，但在无人值守前应优先修复扫描 CLI 参数、报告覆盖、API 韧性、lease heartbeat、跨阶段一致性校验和 Fork remote 兼容性。
