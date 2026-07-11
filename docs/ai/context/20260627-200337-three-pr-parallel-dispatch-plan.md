# 2026-06-27 三项目并行 PR 分发计划

## 目标

使用三个 `gpt-5.5` worker 并行推进三个互不相关的上游 PR：

1. `holon-run/holon#2002`
2. `Muvon/octocode#50`
3. `alexei-led/ccgram#107`

主线程只做协调、验收和记录；不在三个上游仓之间共享改动。

## 目录隔离

- `work/holon-2002`
- `work/octocode-50`
- `work/ccgram-107`

`work/` 已被当前日报仓 git ignore。每个 worker 只允许在自己的目录中修改上游仓代码。

## 通用约束

- 先读目标仓根目录中的 `AGENTS.md`、`CLAUDE.md`、`CONTRIBUTING.md`、`README.md` 等规则文件；存在冲突时遵循目标仓规则。
- 采用 TDD：先写最小失败测试并记录 RED，再写最小实现并记录 GREEN。
- 只做 issue 对应的最小修复，不做顺手重构。
- 提交前运行目标测试、必要的 lint/build/typecheck，以及 `git diff --check`。
- 成功后推送到 `cnYui` fork，并创建 PR 指向上游默认分支。
- PR 描述必须包含问题、修复、验证命令和关联 issue。

## Worker 1：holon

- 上游：`holon-run/holon`
- issue：#2002
- 工作目录：`work/holon-2002`
- 分支：`codex/fix-apply-patch-double-slash-absolute-path`
- 切口：修复 `src/tool/apply_patch.rs` 中 `strip_diff_prefix` 对 `a//absolute/path` / `b//absolute/path` 的兼容处理。
- 禁止：不要试图把普通 `a/home/...` 还原为绝对路径，因为无法区分真实相对路径。
- 验证重点：新增/更新 Rust 单测证明 `a//home/...` 会保留为 `/home/...`，普通 `a/src/...` 仍为 `src/...`。

## Worker 2：octocode

- 上游：`Muvon/octocode`
- issue：#50
- 工作目录：`work/octocode-50`
- 分支：`codex/add-cpp-module-extension-detection`
- 切口：让 C++20 module 扩展名 `.cppm`、`.ixx`、`.mxx`、`.ccm`、`.cxxm` 被识别为 C++。
- 验证重点：复用或新增 `src/indexer/languages/*_test.rs` 风格测试，先证明当前缺失，再最小更新扩展名映射。

## Worker 3：ccgram

- 上游：`alexei-led/ccgram`
- issue：#107
- 工作目录：`work/ccgram-107`
- 分支：`codex/fix-tmux-rename-transcript-replay`
- 切口：`tmux rename-window` 不应导致 Telegram 侧重放完整历史 transcript。
- 验证重点：优先在 session/monitor state 层写单测复现内存状态在 window rename 后错误重置的问题；不依赖真实 Telegram。

## Worker 返回格式

每个 worker 完成后必须返回：

- 状态：`DONE` / `DONE_WITH_CONCERNS` / `BLOCKED`
- PR URL
- 分支名
- commit SHA
- 修改文件列表
- RED/GREEN 证据
- 验证命令和结果
- 未解决风险
