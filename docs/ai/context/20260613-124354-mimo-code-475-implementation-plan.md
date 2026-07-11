# MiMo-Code Plan Mode Bash Permission Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复 `XiaomiMiMo/MiMo-Code#475`，让默认 plan mode 不再允许通过 bash 修改文件系统，同时保留常见只读探索命令。

**Architecture:** MiMo-Code 的 agent 权限由 `packages/opencode/src/agent/agent.ts` 组装，`Permission.evaluate()` 使用最后匹配规则决定 action。实现只改 plan agent 默认权限：先拒绝 `bash: "*"`, 再白名单只读命令前缀；用户配置仍按现有顺序最后合并，保持 override 语义不变。

**Tech Stack:** TypeScript、Bun test、MiMo-Code permission ruleset。

---

## File Structure

- Modify: `work/MiMo-Code-triage/packages/opencode/test/agent/agent.test.ts`
  - 责任：验证默认 plan agent 的 bash 权限边界。
- Modify: `work/MiMo-Code-triage/packages/opencode/src/agent/agent.ts`
  - 责任：定义内建 plan agent 的权限规则。
- Create: `docs/ai/context/20260613-*-mimo-code-pr-475-submission-record.md`
  - 责任：记录最终提交、验证和 PR 状态。

## Task 1: Add RED Permission Test

**Files:**
- Modify: `work/MiMo-Code-triage/packages/opencode/test/agent/agent.test.ts`

- [ ] **Step 1: Add failing test near the existing plan-agent edit test**

Add this test after `plan agent denies edits except .mimocode/plans/*`:

```ts
test("plan agent allows only read-only bash commands by default", async () => {
  await using tmp = await tmpdir()
  await Instance.provide({
    directory: tmp.path,
    fn: async () => {
      const plan = await load(tmp.path, (svc) => svc.get("plan"))
      expect(plan).toBeDefined()

      for (const pattern of ["mkdir test", "touch output.txt", "echo test > output.txt"]) {
        expect(Permission.evaluate("bash", pattern, plan!.permission).action).toBe("deny")
      }

      for (const pattern of ["ls -la", "git status --short", "rg needle src", "Get-ChildItem ."]) {
        expect(Permission.evaluate("bash", pattern, plan!.permission).action).toBe("allow")
      }
    },
  })
})
```

- [ ] **Step 2: Run the targeted test and confirm RED**

Run:

```powershell
cd D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\MiMo-Code-triage\packages\opencode
bun test test/agent/agent.test.ts --timeout 30000
```

Expected: FAIL because `mkdir test`, `touch output.txt`, or `echo test > output.txt` still resolves to `allow`.

## Task 2: Implement Plan Bash Permission Rules

**Files:**
- Modify: `work/MiMo-Code-triage/packages/opencode/src/agent/agent.ts`

- [ ] **Step 1: Add bash rules to the plan agent permission block**

Change the plan agent `Permission.fromConfig({ ... })` block to include this `bash` section after `external_directory` and before `edit`:

```ts
                bash: {
                  "*": "deny",
                  "pwd *": "allow",
                  "ls *": "allow",
                  "cat *": "allow",
                  "grep *": "allow",
                  "rg *": "allow",
                  "find *": "allow",
                  "git status *": "allow",
                  "git diff *": "allow",
                  "git log *": "allow",
                  "git show *": "allow",
                  "Get-ChildItem *": "allow",
                  "Get-Content *": "allow",
                },
```

Do not add a destructive-command denylist. Default deny plus read-only allowlist is the simpler and safer rule for plan mode.

- [ ] **Step 2: Run the targeted agent test and confirm GREEN**

Run:

```powershell
cd D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\MiMo-Code-triage\packages\opencode
bun test test/agent/agent.test.ts --timeout 30000
```

Expected: PASS.

## Task 3: Verify Bash Pattern Assumptions

**Files:**
- Read-only verification: `work/MiMo-Code-triage/packages/opencode/test/tool/bash.test.ts`

- [ ] **Step 1: Run existing bash tool permission tests**

Run:

```powershell
cd D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\MiMo-Code-triage\packages\opencode
bun test test/tool/bash.test.ts --timeout 30000
```

Expected: PASS. This confirms the bash tool still emits command patterns like `echo test > output.txt` and always-prefix patterns like `ls *`.

## Task 4: Package Verification

**Files:**
- No code changes expected.

- [ ] **Step 1: Run package typecheck**

Run:

```powershell
cd D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\MiMo-Code-triage\packages\opencode
bun typecheck
```

Expected: PASS.

- [ ] **Step 2: Run diff whitespace check**

Run:

```powershell
cd D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\MiMo-Code-triage
git diff --check
```

Expected: no output and exit code 0.

## Task 5: Submit PR

**Files:**
- Commit only:
  - `packages/opencode/src/agent/agent.ts`
  - `packages/opencode/test/agent/agent.test.ts`

- [ ] **Step 1: Create branch**

Run:

```powershell
cd D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\MiMo-Code-triage
git switch -c codex/fix-plan-mode-bash-permissions
```

- [ ] **Step 2: Commit**

Run:

```powershell
git add packages/opencode/src/agent/agent.ts packages/opencode/test/agent/agent.test.ts
git commit -m "fix: restrict bash in plan mode"
```

- [ ] **Step 3: Push to fork and create PR**

If no `cnYui` fork remote exists, add it:

```powershell
git remote add fork https://github.com/cnYui/MiMo-Code.git
git push -u fork codex/fix-plan-mode-bash-permissions
```

Create PR against `XiaomiMiMo/MiMo-Code:main` with title:

```text
fix: restrict bash in plan mode
```

PR body should state:

```markdown
### Issue for this PR

Fixes #475

### Type of change

- [x] Bug fix
- [ ] New feature
- [ ] Refactor / code improvement
- [ ] Documentation

### What does this PR do?

Plan mode is documented as read-only, but it only denied edit-family tools. The bash tool still inherited the default allow rule, so commands like `mkdir`, `touch`, and shell redirects could modify the workspace.

This change makes the built-in plan agent deny bash by default and explicitly allow common read-only exploration commands such as `ls`, `cat`, `rg`, `grep`, `find`, `git status`, `git diff`, `git log`, `git show`, `Get-ChildItem`, and `Get-Content`.

### How did you verify your code works?

- `bun test test/agent/agent.test.ts --timeout 30000`
- `bun test test/tool/bash.test.ts --timeout 30000`
- `bun typecheck`
- `git diff --check`

### Screenshots / recordings

No UI change.

### Checklist

- [x] I have tested my changes locally
- [x] I have not included unrelated changes in this PR
```

## Self-Review

- Spec coverage: covers #475 by changing default plan agent bash permission and preserving read-only exploration.
- Placeholder scan: no placeholders remain; all commands and file paths are concrete.
- Type consistency: uses existing `Permission.fromConfig` shape and existing `Permission.evaluate("bash", pattern, ruleset)` test pattern.
