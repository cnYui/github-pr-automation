# CopilotKit Runtime Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复 `CopilotKit/CopilotKit` 文档中仍残留的 Copilot Runtime 坏链，并提交关联 issue `#2082` 的 PR。

**Architecture:** 只做文档链接源头修复：源码 JSDoc 与已生成 reference MDX 同步从 `/concepts/copilot-runtime` 指向现有 `/backend/copilot-runtime`。不新增路由、不改导航、不改变运行时代码行为。

**Tech Stack:** TypeScript JSDoc, MDX, GitHub PR flow.

---

### Task 1: 目标仓库准备与 RED 验证

**Files:**
- Clone/Use: `work/CopilotKit`

- [ ] **Step 1: 准备仓库**

```powershell
git clone https://github.com/CopilotKit/CopilotKit.git work/CopilotKit
cd work/CopilotKit
git remote add fork https://github.com/cnYui/CopilotKit.git
git checkout -b codex/fix-copilot-runtime-links origin/main
```

- [ ] **Step 2: RED 检查坏链仍存在**

```powershell
rg -n "concepts/copilot-runtime" packages showcase/shell-docs/src/content
```

Expected: 命中 4 处 `/concepts/copilot-runtime`，证明回归检查能捕获当前问题。

### Task 2: 最小链接修复

**Files:**
- Modify: `packages/runtime/src/lib/runtime/copilot-runtime.ts`
- Modify: `packages/react-core/src/components/copilot-provider/copilotkit-props.tsx`
- Modify: `showcase/shell-docs/src/content/reference/v1/classes/CopilotRuntime.mdx`
- Modify: `showcase/shell-docs/src/content/reference/v1/components/CopilotKit.mdx`

- [ ] **Step 1: 修改源码 JSDoc 链接**

把源码中的链接替换为当前有效路由：

```md
/backend/copilot-runtime
```

- [ ] **Step 2: 修改已生成 reference MDX 链接**

同步替换两个 reference 文档中的同一链接，避免当前文档站继续暴露坏链。

- [ ] **Step 3: GREEN 检查坏链已清除**

```powershell
rg -n "concepts/copilot-runtime" packages showcase/shell-docs/src/content
```

Expected: 无输出，命令以未匹配状态结束。

- [ ] **Step 4: 确认新链接命中目标文件**

```powershell
rg -n "backend/copilot-runtime" packages/runtime/src/lib/runtime/copilot-runtime.ts packages/react-core/src/components/copilot-provider/copilotkit-props.tsx showcase/shell-docs/src/content/reference/v1/classes/CopilotRuntime.mdx showcase/shell-docs/src/content/reference/v1/components/CopilotKit.mdx
```

Expected: 4 个目标文件各有 1 处命中。

### Task 3: 验证、提交和 PR

**Files:**
- Modify: `docs/ai/context/YYYYMMDD-HHMMSS-copilotkit-pr-xxxx-summary.md` in current project after PR creation
- Modify: `AGENTS.md` in current project after PR creation

- [ ] **Step 1: 检查目标仓库 diff**

```powershell
git diff --stat
git diff
```

Expected: 只包含 4 个链接替换。

- [ ] **Step 2: 运行可行验证**

优先运行仓库中可发现的 docs/reference 构建或检查命令；如果安装成本过高或缺少依赖，保留搜索验证结果并记录原因。

- [ ] **Step 3: 提交并推送**

```powershell
git add packages/runtime/src/lib/runtime/copilot-runtime.ts packages/react-core/src/components/copilot-provider/copilotkit-props.tsx showcase/shell-docs/src/content/reference/v1/classes/CopilotRuntime.mdx showcase/shell-docs/src/content/reference/v1/components/CopilotKit.mdx
git commit -m "docs: fix Copilot Runtime reference links"
git push fork codex/fix-copilot-runtime-links
```

- [ ] **Step 4: 创建 PR**

PR base 使用 `CopilotKit/CopilotKit:main`，标题：

```text
docs: fix Copilot Runtime reference links
```

PR 描述包含：

```md
## Summary
- replace stale `/concepts/copilot-runtime` links with `/backend/copilot-runtime`
- update both source JSDoc and generated reference MDX

Closes #2082

## Testing
- `rg -n "concepts/copilot-runtime" packages showcase/shell-docs/src/content` returns no matches
- `rg -n "backend/copilot-runtime" ...` confirms the four updated references
```

