# agent-infra task status frontmatter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `fitlab-ai/agent-infra#544` 提交一个小 PR，只修复 `task.md` frontmatter 模板里的 `status` 枚举与校验器不一致问题。

**Architecture:** 以现有校验器 `.agents/scripts/validate-artifact.js` 的 `active | blocked | completed` 为事实契约，不改校验器枚举。同步更新本地 `.agents/` 文件和发布模板 `templates/.agents/` 的中英文镜像，并用结构性测试锁住模板默认值和 Quickstart 示例。

**Tech Stack:** TypeScript, Node.js >= 22, node:test, Markdown templates, GitHub CLI。

---

## 背景核验

- issue：`fitlab-ai/agent-infra#544`，当前 `OPEN`，标题为 `refactor(meta): 清理 task.md frontmatter 冗余字段并修复 status 枚举不一致`。
- open PR 查重：`gh pr list --repo fitlab-ai/agent-infra --state open --search "544 OR task.md OR frontmatter OR status enum OR created_by"` 返回 `[]`。
- 仓库状态：默认分支 `main`，未归档，主语言 TypeScript，最近推送 `2026-06-28T09:43:43Z`。
- 上游约束：根目录 `AGENTS.md` 要求外科手术式修改、先定义可验证成功标准、Markdown 双语模板同步、Node.js 内置测试。

## 首 PR 边界

本 PR 只处理 `status` 默认值和注释枚举。

不处理这些字段：`created_by`、`blocked_reason`、`short_id`、`parent_issue`、`parent_task`、`depends_on`、`milestone`、`severity`、`rule_id`、`tool`、`status_label`。

不修改 `.agents/scripts/validate-artifact.js` 的枚举，因为它已经是 issue 中要求采用的契约：

```js
const TASK_ENUMS = {
  type: ["feature", "bugfix", "refactor", "docs", "chore"],
  workflow: ["feature-development", "bug-fix", "refactoring"],
  status: ["active", "blocked", "completed"]
};
```

## 文件结构

- Modify: `.agents/templates/task.md`
  - 将 frontmatter 默认 `status: open` 改为 `status: active`，注释枚举改为 `active | blocked | completed`。
- Modify: `templates/.agents/templates/task.en.md`
  - 同步英文发布模板。
- Modify: `templates/.agents/templates/task.zh-CN.md`
  - 同步中文发布模板。
- Modify: `.agents/QUICKSTART.md`
  - 将示例任务状态改为校验器可接受的 `active`。
- Modify: `templates/.agents/QUICKSTART.en.md`
  - 同步英文 Quickstart 模板。
- Modify: `templates/.agents/QUICKSTART.zh-CN.md`
  - 同步中文 Quickstart 模板。
- Modify: `tests/unit/templates/templates.test.ts`
  - 新增结构性测试，锁住 task 模板和 Quickstart 示例的 `status` 契约。
- Test reference: `tests/e2e/core/validate-artifact.test.ts`
  - 不需要强制改；当前 validator 已拒绝 `open`，本 PR 重点是模板不再生成无效值。

## Task 1: 写失败的模板契约测试

**Files:**
- Modify: `tests/unit/templates/templates.test.ts`

- [ ] **Step 1: 在模板测试里新增 status 枚举契约测试**

在 `test("task templates include agent-infra version metadata", ...)` 后面追加：

```ts
test("task templates use validator-compatible status frontmatter", () => {
  for (const relativePath of [
    ".agents/templates/task.md",
    "templates/.agents/templates/task.en.md",
    "templates/.agents/templates/task.zh-CN.md"
  ]) {
    const content = read(relativePath);
    assert.match(
      content,
      /^status: active\s+# active \| blocked \| completed$/m,
      `${relativePath} should use the validator-compatible task status enum`
    );
  }
});

test("quickstart task examples use validator-compatible status frontmatter", () => {
  for (const relativePath of [
    ".agents/QUICKSTART.md",
    "templates/.agents/QUICKSTART.en.md",
    "templates/.agents/QUICKSTART.zh-CN.md"
  ]) {
    const content = read(relativePath);
    assert.match(
      content,
      /^status: active\s+# active \| blocked \| completed$/m,
      `${relativePath} should not document legacy task status values`
    );
  }
});
```

- [ ] **Step 2: 运行目标测试，确认 RED**

Run:

```bash
node --experimental-strip-types --no-warnings --test tests/unit/templates/templates.test.ts
```

Expected:

```text
not ok ... task templates use validator-compatible status frontmatter
not ok ... quickstart task examples use validator-compatible status frontmatter
```

失败原因应指向当前文件仍含：

```yaml
status: open                   # open | in-progress | review | blocked | completed
```

或：

```yaml
status: open           # open | in-progress | review | blocked | completed
```

## Task 2: 更新 task 模板默认 status

**Files:**
- Modify: `.agents/templates/task.md`
- Modify: `templates/.agents/templates/task.en.md`
- Modify: `templates/.agents/templates/task.zh-CN.md`

- [ ] **Step 1: 修改三个 task 模板的 status 行**

将三个文件里的这一行：

```yaml
status: open                   # open | in-progress | review | blocked | completed
```

替换为：

```yaml
status: active                 # active | blocked | completed
```

- [ ] **Step 2: 检查旧枚举是否仍残留在 task 模板**

Run:

```bash
rg -n "status: open|open \| in-progress \| review" .agents/templates/task.md templates/.agents/templates/task.en.md templates/.agents/templates/task.zh-CN.md
```

Expected:

```text
no matches
```

- [ ] **Step 3: 运行目标测试，确认 task 模板测试已通过或只剩 Quickstart 测试失败**

Run:

```bash
node --experimental-strip-types --no-warnings --test tests/unit/templates/templates.test.ts
```

Expected:

```text
not ok ... quickstart task examples use validator-compatible status frontmatter
```

如果 task 模板测试仍失败，先修正 spacing 或同步遗漏的模板文件。

## Task 3: 更新 Quickstart 示例 status

**Files:**
- Modify: `.agents/QUICKSTART.md`
- Modify: `templates/.agents/QUICKSTART.en.md`
- Modify: `templates/.agents/QUICKSTART.zh-CN.md`

- [ ] **Step 1: 修改三个 Quickstart 示例的 status 行**

将三个文件里的这一行：

```yaml
status: open           # open | in-progress | review | blocked | completed
```

替换为：

```yaml
status: active         # active | blocked | completed
```

- [ ] **Step 2: 检查旧枚举是否仍残留在本 PR 范围**

Run:

```bash
rg -n "status: open|open \| in-progress \| review" .agents/QUICKSTART.md templates/.agents/QUICKSTART.en.md templates/.agents/QUICKSTART.zh-CN.md .agents/templates/task.md templates/.agents/templates/task.en.md templates/.agents/templates/task.zh-CN.md
```

Expected:

```text
no matches
```

- [ ] **Step 3: 运行目标测试，确认 GREEN**

Run:

```bash
node --experimental-strip-types --no-warnings --test tests/unit/templates/templates.test.ts
```

Expected:

```text
# pass
```

## Task 4: 跑同步和核心验证

**Files:**
- No code changes.

- [ ] **Step 1: 跑模板目标测试**

Run:

```bash
node --experimental-strip-types --no-warnings --test tests/unit/templates/templates.test.ts
```

Expected:

```text
# pass
```

- [ ] **Step 2: 跑 validator 目标测试，确认未破坏现有 gate**

Run:

```bash
node --experimental-strip-types --no-warnings --test tests/e2e/core/validate-artifact.test.ts
```

Expected:

```text
# pass
```

- [ ] **Step 3: 跑类型检查**

Run:

```bash
npm run typecheck
```

Expected:

```text
exit code 0
```

- [ ] **Step 4: 跑核心测试层**

Run:

```bash
npm run test:core
```

Expected:

```text
exit code 0
```

- [ ] **Step 5: 检查 diff 空白**

Run:

```bash
git diff --check
```

Expected:

```text
no output
```

## Task 5: 提交前远端复查

**Files:**
- No code changes.

- [ ] **Step 1: 重新查 issue 状态**

Run:

```bash
gh issue view 544 --repo fitlab-ai/agent-infra --json state,title,labels,updatedAt,url
```

Expected:

```text
state remains OPEN
```

- [ ] **Step 2: 重新查同向 open PR**

Run:

```bash
gh pr list --repo fitlab-ai/agent-infra --state open --search "544 OR task.md OR frontmatter OR status enum OR active blocked completed" --json number,title,url
```

Expected:

```text
[]
```

如果出现同向 PR，停止提交，改为在当前日报仓新增一份 follow-up 记录说明重复风险。

- [ ] **Step 3: 准备单 commit**

Run:

```bash
git status --short
git add .agents/templates/task.md templates/.agents/templates/task.en.md templates/.agents/templates/task.zh-CN.md .agents/QUICKSTART.md templates/.agents/QUICKSTART.en.md templates/.agents/QUICKSTART.zh-CN.md tests/unit/templates/templates.test.ts
git commit -m "fix(meta): align task status template enum"
```

Expected:

```text
1 commit created
```

## PR 草稿

Title:

```text
fix(meta): align task status frontmatter with validator
```

Body:

```markdown
## Summary

- changed task frontmatter templates from the legacy `open | in-progress | review` status values to the validator-supported `active | blocked | completed`
- updated Quickstart task examples to use `active`
- added template contract tests for the task status default and enum comment

## Tests

- `node --experimental-strip-types --no-warnings --test tests/unit/templates/templates.test.ts`
- `node --experimental-strip-types --no-warnings --test tests/e2e/core/validate-artifact.test.ts`
- `npm run typecheck`
- `npm run test:core`
- `git diff --check`

Closes #544
```

## 自检

- Spec coverage：覆盖 issue 中的 `status` 枚举不一致；明确不覆盖冗余字段清理。
- Placeholder scan：无待补内容、延后实现描述或跨任务省略写法。
- Type consistency：不新增 TypeScript 类型；测试函数和 helper 名称均来自现有 `tests/unit/templates/templates.test.ts`。
