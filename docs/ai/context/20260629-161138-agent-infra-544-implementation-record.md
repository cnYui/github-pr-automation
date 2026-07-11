# agent-infra#544 status 枚举实现记录

日期：2026-06-29

## 目标

基于 `docs/ai/context/20260629-153921-agent-infra-544-status-enum-plan.md`，在 `fitlab-ai/agent-infra#544` 范围内实现首 PR 小切片：只统一 `task.md` frontmatter 模板与 Quickstart 示例中的 `status` 枚举。

## 工作目录

- 上游实现目录：`D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\agent-infra-544-status-enum`
- 分支：`agent-infra-fix-task-status-template-enum`
- 上游仓库：`https://github.com/fitlab-ai/agent-infra`

## 实现内容

- 新增模板契约测试：
  - `tests/unit/templates/templates.test.ts`
  - 覆盖 `.agents/templates/task.md` 与 `templates/.agents/templates/task.{en,zh-CN}.md`
  - 覆盖 `.agents/QUICKSTART.md` 与 `templates/.agents/QUICKSTART.{en,zh-CN}.md`
- 将 3 个 task 模板的默认状态从 `status: open # open | in-progress | review | blocked | completed` 改为 `status: active # active | blocked | completed`。
- 将 3 个 Quickstart 示例同步改为 `status: active # active | blocked | completed`。
- 未修改 `.agents/scripts/validate-artifact.js`，因为校验器当前已经只接受 `active | blocked | completed`。
- 未处理 `created_by`、`blocked_reason`、`short_id`、`parent_issue`、`parent_task`、`depends_on`、`milestone`、`severity`、`rule_id`、`tool`、`status_label` 等字段清理。

## TDD 记录

RED：

```powershell
$env:PATH = 'D:\Git\usr\bin;' + $env:PATH
node --experimental-strip-types --no-warnings --test tests/unit/templates/templates.test.ts
```

结果：新增 2 个测试按预期失败，失败原因分别指向 `.agents/templates/task.md` 和 `.agents/QUICKSTART.md` 仍使用旧 `status: open` 枚举。

GREEN：

```powershell
$env:PATH = 'D:\Git\usr\bin;' + $env:PATH
node --experimental-strip-types --no-warnings --test tests/unit/templates/templates.test.ts
```

结果：`16/16` 通过。

## 验证

通过：

```powershell
rg -n "status: open|open \| in-progress \| review" .agents/QUICKSTART.md templates/.agents/QUICKSTART.en.md templates/.agents/QUICKSTART.zh-CN.md .agents/templates/task.md templates/.agents/templates/task.en.md templates/.agents/templates/task.zh-CN.md
```

结果：无命中，`rg` exit code 1。

通过：

```powershell
$env:PATH = 'D:\Git\usr\bin;' + $env:PATH
node --experimental-strip-types --no-warnings --test tests/e2e/core/validate-artifact.test.ts
```

结果：`27/27` 通过。

通过：

```powershell
npm run typecheck
```

结果：exit code 0。

通过：

```powershell
git diff --check
```

结果：无输出。

部分失败：

```powershell
$env:PATH = 'D:\Git\usr\bin;' + $env:PATH
npm run test:core
```

结果：`1021` 个测试中 `1005` 通过、`13` skipped、`3` 失败。失败均在 sandbox CLI 相关测试，不在本次改动路径：

- `tests/integration/cli/sandbox-ls.test.ts`：`ai sandbox ls shows only the Containers section (no worktree/state sections)`
- `tests/integration/cli/sandbox-ls.test.ts`：`ai sandbox ls reports an empty state with no extra sections`
- `tests/integration/cli/sandbox-tools.test.ts`：`sandbox create resolves to configured engine`

补充：模板基线测试最初在 Windows PowerShell 下因 PATH 缺少 `sh` 失败；加入 `D:\Git\usr\bin` 后原始模板测试通过。未修改上游配置。

## 远端复查

- `gh issue view 544 --repo fitlab-ai/agent-infra --json state,title,labels,updatedAt,url`：issue 仍为 `OPEN`。
- 宽搜索曾返回不相关 PR `#550 feat(cli): 完善人工裁决查看与提示`。
- 精确搜索 `'"status: open" OR "status: active" OR "task status" OR frontmatter'` 返回 `[]`，未发现同向 open PR。

## 提交状态

未自动提交。原因：上游 `.agents/rules/commit-and-pr.md` 明确禁止自动 `git add` / `git commit`，除非用户明确发起提交命令。

建议提交信息：

```text
fix(meta): align task status template enum
```
