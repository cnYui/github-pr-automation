# lark-coding-agent-bridge PR #199 提交记录

## 结果

- 仓库：`zarazhangrui/lark-coding-agent-bridge`
- Issue：`#194`
- PR：https://github.com/zarazhangrui/lark-coding-agent-bridge/pull/199
- 状态：ready/open
- base：`main`
- head：`cnYui:codex/persist-profile-team-mode`
- 本地目录：`D:\CodeWorkSpace\github-pr-automation\work\opportunity-pipeline\lark-coding-agent-bridge-20260718-181324`
- 分支：`codex/persist-profile-team-mode`
- commit：`d71852f553dad1609e5476c7c0653064fd02e5a7`

## 改动

- `src/config/profile-store.ts`：在 root profile config 序列化白名单和实际输出中加入 `mode`。
- `tests/integration/commands/profile-config-command.test.ts`：让 `/config submit` 回归测试覆盖 `deploy_mode: "team"`，断言落盘 profile 保留 `mode: "team"`。

## 验证

- RED：`pnpm exec vitest run --config vitest.local.config.ts tests/integration/commands/profile-config-command.test.ts`
  - 结果：失败于 `expected undefined to be 'team'`，证明当前序列化漏掉 `mode`。
- GREEN：`pnpm exec vitest run --config vitest.local.config.ts tests/integration/commands/profile-config-command.test.ts tests/unit/config/profile-store.test.ts tests/unit/config/profile-schema.test.ts`
  - 结果：3 个文件、41 项测试通过。
- `pnpm typecheck`
  - 结果：通过。
- `pnpm build`
  - 结果：通过。
- `git diff --check`
  - 结果：通过，仅有 Windows 工作区 LF/CRLF 提示。

## 全量测试说明

执行 `pnpm exec vitest run --config vitest.local.config.ts` 时，结果为 553 passed / 3 failed。失败均在 `tests/integration/cli/start-codex-legacy-config.test.ts`，错误为 Windows 下临时 Codex shim 调用 `sh` 失败：

```text
'sh' is not recognized as an internal or external command
```

该失败不在本次改动路径，且上游已有 open PR `#197`（`tests: fix integration mocks and codex shim for Windows`）专门覆盖此 Windows 测试基线问题。

## 远端状态

- `gh pr view 199`：PR ready/open、mergeable、base `main`，文件仅两项。
- `gh pr checks 199`：创建后即时查询显示该 head 暂无 checks reported。

## 后续

- 等待上游 CI 或维护者反馈。
- 如 #197 先合并导致 CI 基线恢复，可按需 rebase/merge main 后复跑测试。
