# 四项目 PR 提交记录

## 候选复核修正

用户要求推进 2026-07-11 日报中的四个项目。进入实现前检查上游 `main` 后发现：

- `alfredoperez/speckit-companion#419` 已由上游提交 `55145b1` 直接修复，代码、测试和设置说明均已存在。
- `Justin0504/Aegis#2` 已由上游提交 `cfdde2f2` 直接修复，当前数据库初始化器已创建 `agent_profiles`。

这两个 issue 仍为 open，且没有同向开放 PR，但已经不具备原报告所述实现空间。为保持“四个项目”目标且不制造重复 PR，本轮改为同仓库的有证据跟进：

- speckit-companion：修复 #420 代码落地后遗漏的 README 安装命令文档漂移。
- Aegis：补主数据库初始化器到 `ProfileManager` 的启动契约测试，防止 #2 回归。

后续候选扫描必须同时检查 issue、开放 PR 和默认分支实现状态；仅凭 issue open + 无重复 PR 不足以判定可实施。

## 已创建 PR

### alfredoperez/speckit-companion #427

- PR：https://github.com/alfredoperez/speckit-companion/pull/427
- 分支：`codex/docs-install-command-no-force`
- 提交：`a8eaaf4 docs(readme): align companion install command with CLI`
- 改动：只更新根 `README.md`，从 `specify extension add` 手动安装/更新说明中移除旧 CLI 不支持的 `--force`；保留 `uv tool install ... --force`。
- 验证：安装命令 Jest 9/9、docs consistency 6/6、`npm run compile`、无效命令搜索、`git diff --check` 通过。
- 全量基线：Windows Jest 94/99 suites、1248/1266 tests 通过；剩余 5 suites 是既有路径分隔符/mtime 假设，与 README-only diff 无关。
- 即时远端：open、ready、base `main`、mergeable；GitGuardian Security Checks 通过。

### PerpetualSoftware/pad #910

- PR：https://github.com/PerpetualSoftware/pad/pull/910
- issue 认领评论：https://github.com/PerpetualSoftware/pad/issues/902#issuecomment-4941899082
- 分支：`codex/fix-comment-not-found-context`
- 提交：`591a464 fix(cli): wrap comment not-found errors`
- 改动：`CreateComment` 复用现有 `wrapItemNotFound`，并在既有 not-found 测试中增加 comment 路径断言。
- 验证：目标 Go 测试、`go vet ./internal/cli`、gofmt、`git diff --check` 通过。
- 本机基线：更广测试在 Windows 受缺少生成的 `web/build` embed 产物及 HOME/credentials 假设影响；PR 已如实说明，未把其标记为全绿。
- 即时远端：open、ready、base `main`、mergeable；尚无 checks。

### h5i-dev/h5i #315

- PR：https://github.com/h5i-dev/h5i/pull/315
- 分支：`codex/feat-phpunit-output-filter`
- 提交：`107cd47 feat(filters): add PHPUnit output filter`
- 改动：新增 declarative `phpunit.toml`，删除空行和带计数的 progress 行，保留 failure/error/diff/stack/summary；支持直接命令和 `php -d/-c/-n ... phpunit` 路由，并用负例避免误匹配普通 PHP 脚本。
- 测试：3 个 inline golden、命令路由正负例、filter-quality 13/13、clippy `-D warnings`、all-target build、`git diff --check` 通过。
- 样本：all-pass 来自 PHPUnit 12.2 文档；failure fixture 改编自 rtk 已合并 PHPUnit filter，归属由 `assets/filters/NOTICE` 覆盖。
- 全量基线：WSL `/mnt/d` 下 unit、CLI integration、noun workflow 通过；7 个既有 env integration 因 process-tier worktree 路径无法 stat 失败，与 filter 无关。
- 即时远端：open、ready、base `main`、mergeable；尚无 checks。

### Justin0504/Aegis #8

- PR：https://github.com/Justin0504/Aegis/pull/8
- 分支：`codex/test-agent-profiles-startup`
- 提交：`c09566c test(gateway): cover agent profile startup on fresh database`
- 改动：在 API smoke tests 中用主初始化器创建全新数据库，再启动 `ProfileManager`，断言空 profile 集合，并在 `finally` 中关闭刷新 interval。
- 验证（Node 20.20.2）：目标 1 suite/5 tests、gateway build、全量 97 suites/1242 tests、`git diff --check` 全部通过。
- PR 表述为 #2 的 regression coverage，不使用 `Fixes #2`，因为生产修复已在 `main`。
- 即时远端：open、ready、base `main`、mergeable；尚无 checks。

## 最终状态

- 四个外部工作区均 clean，分支已推送并跟踪各自 fork remote。
- 四个 PR 均为 ready、目标 `main`、即时状态 mergeable。
- 本轮未自动合并，也未修改无关生产代码。
