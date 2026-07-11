# MiMo-Code PR 角度筛选与设计

## 背景

- 目标仓库：`XiaomiMiMo/MiMo-Code`
- 本轮范围：只做 PR 角度筛选和设计记录，不在上游工作区改代码。
- 本地只读克隆：`work/MiMo-Code-triage`
- 上游状态核对时间：2026-06-13

## 推荐角度

推荐推进 issue #475：`BUG Plan mode allows filesystem modifications via Bash tool`。

原因：

- 问题清晰：README 明确写 `plan` 是 read-only analysis mode，但当前 plan agent 仍允许 bash 执行 `mkdir`、`touch`、重定向写文件等命令。
- 查重干净：GitHub open PR 搜索 `plan mode bash filesystem` 和 `Plan mode bash` 未发现覆盖 #475 的开放 PR。
- 修复面小：主要落点在 `packages/opencode/src/agent/agent.ts` 的 plan agent 权限配置，测试落点在 `packages/opencode/test/agent/agent.test.ts`。
- 可测试：无需真实模型和 TUI 交互，可直接用 `Permission.evaluate("bash", pattern, plan.permission)` 验证默认权限。

## 已确认代码事实

- `packages/opencode/src/agent/agent.ts` 中默认权限包含 `"*": "allow"`。
- `plan` agent 只对 `edit` 做了 deny，并允许 `.mimocode/plans/*.md` 与 global plans 路径写入。
- `Permission.disabled()` 中 `edit` deny 会覆盖 `edit/write/apply_patch/multiedit`，但不会覆盖 `bash`。
- `packages/opencode/src/tool/bash.ts` 会把 shell 命令归类为 `permission: "bash"`，并生成具体 `patterns` 与 prefix 型 `always` 规则，例如 `ls *`、`git status *`、`echo test > output.txt`。
- 因此不需要先改 bash tool 解析器，就可以通过 plan agent 权限限制默认可执行 bash 命令。

## 建议设计

在 `plan` agent 的权限块里增加 bash 默认拒绝，并白名单只读探索命令：

- 先设 `bash: { "*": "deny" }`。
- 再允许常见只读命令前缀，例如 `pwd *`、`ls *`、`cat *`、`grep *`、`rg *`、`find *`、`git status *`、`git diff *`、`git log *`、`git show *`、`Get-ChildItem *`、`Get-Content *`。
- 不做写命令 denylist，因为 shell 写入形态太多，重定向、管道、子 shell、PowerShell alias 都容易绕过。
- 先保持当前用户配置覆盖顺序不变，避免本 PR 顺手改变全局 permission override 语义；本 PR 目标是修默认 plan mode 行为。

## 测试计划

优先补 agent 权限测试：

- 默认 plan agent 对 `mkdir test`、`touch file`、`echo test > output.txt` 返回 `deny`。
- 默认 plan agent 对 `ls -la`、`git status --short`、`Get-ChildItem .` 返回 `allow`。
- 现有 plan 文件写入例外仍保持：`.mimocode/plans/foo.md` 可编辑。

建议验证命令：

```powershell
cd work/MiMo-Code-triage\packages\opencode
bun test test/agent/agent.test.ts --timeout 30000
bun test test/tool/bash.test.ts --timeout 30000
bun typecheck
git diff --check
```

## 备选与排除

- #479：Codex 全局 `AGENTS.md` 串台。值得继续观察，但根因不够收敛；当前代码里 `.codex` 相关更多出现在 skill discovery 和 distill prompt，而 issue 描述的是全局 `.codex/AGENTS.md` 被当作主指令读入。另有 #193 等开放 PR 已在修 MiMo/Codex asset path 方向，重复风险中等。
- 日志爆炸方向（#478/#489 等）：问题价值高，但已有 #248、#270、#318、#481、#274、#426 等多条开放 PR 覆盖，重复风险高。
- #494 `mimo stats` 统计导入 Claude 会话：已被 open PR #492 覆盖。
- #467 WorkflowRuntime `runs` Map 泄漏：已被 open PR #468 覆盖。
- #462 OAuth 授权界面缺少粘贴 code 输入框：已被 open PR #463 覆盖。
- #470 PowerShell 中文乱码：已有 open PR #336 覆盖。

## 结论

当前最适合提交 PR 的角度是 #475。它具备明确用户影响、无明显重复 PR、实现范围小、测试可本地化四个条件。下一步如果确认推进，应先写 RED 测试，再改 `plan` agent 权限配置，最后做 package 级测试和 typecheck。
