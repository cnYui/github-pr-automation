# MiMo-Code PR #505 Submission Record

## 结论

- 上游仓库：`XiaomiMiMo/MiMo-Code`
- Issue：`#475`，`BUG Plan mode allows filesystem modifications via Bash tool`
- PR：`#505`，https://github.com/XiaomiMiMo/MiMo-Code/pull/505
- 分支：`cnYui:codex/fix-plan-mode-bash-permissions`
- 提交：`1cfbff4d8f5615180ed6a2b7a02bca27f8080270`
- 本地目录：`work/MiMo-Code-triage`

## 改动范围

- `packages/opencode/src/agent/agent.ts`
  - 给内建 `plan` agent 增加 `bash` 权限规则：默认 `deny`，仅允许常见只读探索命令。
- `packages/opencode/test/agent/agent.test.ts`
  - 增加 plan agent bash 权限回归测试，覆盖 `mkdir`、`touch`、redirect 写入被拒绝，以及 `ls`、`git status`、`rg`、`Get-ChildItem` 被允许。

## 本地验证

已通过：

- `bun test test/agent/agent.test.ts -t "plan agent" --timeout 30000`
  - 结果：2 pass，0 fail。
- `bun test test/tool/bash.test.ts -t "matches redirects in permission pattern" --timeout 30000`
  - 结果：4 pass，0 fail。
- `bun test test/tool/bash.test.ts -t "always pattern has space before wildcard" --timeout 30000`
  - 结果：4 pass，0 fail。
- `git diff --check`
  - 结果：exit 0，仅有 Windows 换行提示。

未全量通过或未作为通过项声明：

- `bun typecheck`
  - 失败：`src/storage/db.node.ts(1,30): error TS2307: Cannot find module 'node:sqlite' or its corresponding type declarations.`
  - 判断：本地 Node/类型环境问题，未触及本次改动文件。

## 远端状态

- PR 创建后 `gh pr view` 显示：
  - `state=OPEN`
  - `baseRefName=main`
  - `headRefName=codex/fix-plan-mode-bash-permissions`
  - `headRefOid=1cfbff4d8f5615180ed6a2b7a02bca27f8080270`
  - `mergeable=MERGEABLE`
- `gh pr checks` 当前返回：`no checks reported on the 'codex/fix-plan-mode-bash-permissions' branch`。

## 后续注意

- PR 正文已按仓库模板填写，并明确列出 `bun typecheck` 的本地失败边界。
- 若维护者要求扩大只读命令白名单，优先继续保持默认拒绝，再按具体命令补测试。
