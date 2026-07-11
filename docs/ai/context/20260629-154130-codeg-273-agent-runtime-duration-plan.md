# codeg Agent 运行时长统计 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `xintaofei/codeg#273` 提交一个小 PR，让会话详情里的 agent 运行时长在缺少 turn-level duration 时仍能从真实开始/结束时间差得到稳定展示。

**Architecture:** 保持后端 schema 和 parser 不变，前端详情弹窗优先使用后端 `SessionStats.total_duration_ms`，只有 completed 会话且该值缺失或为 0 时才用 `DbConversationSummary.created_at` 到 `updated_at` 的差值兜底。这样既覆盖导入会话的真实 start/end，又不会让运行中会话用 `Date.now()` 或刷新时间产生漂移。

**Tech Stack:** TypeScript、React 19、Next.js 16、Vitest、Testing Library、pnpm。

---

## 上游核验证据

- 时间：2026-06-29 15:30 JST 左右。
- issue：`https://github.com/xintaofei/codeg/issues/273`，状态 `OPEN`，标题 `[bug]agent运行时长统计有误`。
- issue 正文只有截图，并补充“cc-switch 看的实际开始跟结束时间”；没有文字复现步骤。
- open PR 查重：`gh pr list --repo xintaofei/codeg --state open --search '273 OR 运行时长 OR duration OR runtime OR agent'` 未发现直接修运行时长统计的 PR；返回项主要是 chat、agent、font、file open 等其他方向。
- 临时浅克隆 HEAD：`e20eb7921fc3b74ff84ecab8498f2d44f96bb3e5`，默认分支 `main`。
- 代码证据：`DbConversationSummary` 暴露 `created_at` / `updated_at`，导入服务把它们分别写成 parser 的 `started_at` / `ended_at.unwrap_or(started_at)`；`SessionDetailsDialog` 当前只展示 `stats.total_duration_ms`，当 parser 没有 turn duration 时会显示不出或显示为 0。

## 范围

做：

- 在 `SessionDetailsDialog` 内集中解析会话 duration。
- 优先保留正数 `stats.total_duration_ms`。
- 对 `summary.status === "completed"` 且 `total_duration_ms` 为 0 的会话，用 `updated_at - created_at` 兜底。
- 补 UI 回归测试，锁定 completed 兜底和 in-progress 不漂移。

不做：

- 不改 SQLite schema。
- 不新增 `started_at` / `ended_at` 到 `DbConversationSummary`。
- 不重构 parser 的 `compute_session_stats()`。
- 不改 agent 生命周期、导入流程、状态栏或消息 turn duration 展示。
- 不用当前时间计算 completed 会话 duration。

## 文件结构

- Modify: `src/components/conversations/session-details-dialog.tsx`
  - 责任：会话详情弹窗展示 token、context window、duration；本次只新增局部 duration 解析 helper 并替换展示值来源。
- Modify: `src/components/conversations/session-details-dialog.test.tsx`
  - 责任：覆盖详情弹窗的 stats 展示路径；新增 completed 时间戳兜底和 in-progress 非漂移回归。
- Read only: `src/components/conversations/active-session-details.ts`
  - 责任：解析当前 tab 的 summary/stats/model；无需改动。
- Read only: `src-tauri/src/db/service/import_service.rs`
  - 责任：导入会话时把 parser start/end 写入 DB `created_at`/`updated_at`；作为兜底依据。
- Read only: `src-tauri/src/models/conversation.rs`
  - 责任：确认 `DbConversationSummary` 当前没有 `started_at`/`ended_at` 字段，避免计划误写 schema 改动。

---

### Task 1: 建立干净执行目录并复查上游状态

**Files:**

- Modify: none
- Test: none

- [ ] **Step 1: 克隆并建分支**

```bash
mkdir -p work
git clone https://github.com/xintaofei/codeg.git work/codeg-273
cd work/codeg-273
git checkout -b codex/fix-agent-runtime-duration
```

Expected: 当前分支为 `codex/fix-agent-runtime-duration`。

- [ ] **Step 2: 复查 issue 和 open PR**

```bash
gh issue view 273 --repo xintaofei/codeg --json number,title,state,labels,url,updatedAt
gh pr list --repo xintaofei/codeg --state open --search "273 OR 运行时长 OR duration OR runtime OR agent" --json number,title,url,headRefName --limit 20
```

Expected:

- issue `273` 仍是 `OPEN`。
- open PR 没有直接修 agent 运行时长统计；如果出现同向 PR，停止执行并回日报仓记录原因。

- [ ] **Step 3: 安装依赖**

```bash
pnpm install --frozen-lockfile
```

Expected: 依赖安装成功，没有 lockfile drift。

---

### Task 2: 写失败测试

**Files:**

- Modify: `src/components/conversations/session-details-dialog.test.tsx`
- Test: `src/components/conversations/session-details-dialog.test.tsx`

- [ ] **Step 1: 在 `SessionDetailsDialog` 测试中新增 completed 兜底用例**

把下面两个测试追加到 `describe("SessionDetailsDialog", () => { ... })` 内，放在现有 `renders provided stats without fetching` 用例之后：

```tsx
  it("falls back to completed summary timestamps when stats duration is missing", () => {
    const completedSummary = summary({
      status: "completed",
      created_at: "2026-06-10T10:00:00.000Z",
      updated_at: "2026-06-10T10:02:30.000Z",
    })
    const statsWithoutDuration: SessionStats = {
      ...fullStats,
      total_duration_ms: 0,
    }

    const { getByText, queryByText } = renderWithIntl(
      <SessionDetailsDialog
        open
        onOpenChange={() => {}}
        summary={completedSummary}
        stats={statsWithoutDuration}
      />
    )

    expect(getByText("2.5m")).toBeTruthy()
    expect(queryByText("0ms")).toBeNull()
  })

  it("does not derive an in-progress duration from timestamps", () => {
    const liveSummary = summary({
      status: "in_progress",
      created_at: "2026-06-10T10:00:00.000Z",
      updated_at: "2026-06-10T10:02:30.000Z",
    })
    const statsWithoutDuration: SessionStats = {
      ...fullStats,
      total_duration_ms: 0,
    }

    const { queryByText } = renderWithIntl(
      <SessionDetailsDialog
        open
        onOpenChange={() => {}}
        summary={liveSummary}
        stats={statsWithoutDuration}
      />
    )

    expect(queryByText("2.5m")).toBeNull()
    expect(queryByText("0ms")).toBeNull()
  })
```

- [ ] **Step 2: 运行目标测试并确认失败**

```bash
pnpm test src/components/conversations/session-details-dialog.test.tsx
```

Expected: FAIL。第一个新增用例找不到 `2.5m`，因为当前实现只读 `stats.total_duration_ms`，不会用 completed summary 的时间差兜底。

---

### Task 3: 实现 duration 解析兜底

**Files:**

- Modify: `src/components/conversations/session-details-dialog.tsx`
- Test: `src/components/conversations/session-details-dialog.test.tsx`

- [ ] **Step 1: 增加时间解析 helper**

在 `formatDuration()` 后加入：

```tsx
function parseTimestampMs(value: string): number | null {
  const ms = Date.parse(value)
  return Number.isFinite(ms) ? ms : null
}

function resolveSessionDurationMs(
  summary: DbConversationSummary,
  stats: SessionStats | null
): number {
  const statsDuration = stats?.total_duration_ms ?? 0
  if (statsDuration > 0) return statsDuration
  if (summary.status !== "completed") return 0

  const startedAt = parseTimestampMs(summary.created_at)
  const endedAt = parseTimestampMs(summary.updated_at)
  if (startedAt == null || endedAt == null || endedAt <= startedAt) return 0

  return endedAt - startedAt
}
```

Reason: imported completed conversations already persist parser start/end into `created_at`/`updated_at`; in-progress rows should not infer duration from the current updated timestamp.

- [ ] **Step 2: 替换 duration 来源**

把 `SessionDetailsDialog` 内这行：

```tsx
  const durationMs = stats?.total_duration_ms ?? 0
```

替换为：

```tsx
  const durationMs = resolveSessionDurationMs(summary, stats)
```

- [ ] **Step 3: 运行目标测试并确认通过**

```bash
pnpm test src/components/conversations/session-details-dialog.test.tsx
```

Expected: PASS。

---

### Task 4: 跑最小验证集

**Files:**

- Modify: none
- Test: frontend validation

- [ ] **Step 1: 跑详情弹窗目标测试**

```bash
pnpm test src/components/conversations/session-details-dialog.test.tsx
```

Expected: PASS。

- [ ] **Step 2: 跑相关 session 解析测试**

```bash
pnpm test src/components/conversations/active-session-details.test.ts
```

Expected: PASS。

- [ ] **Step 3: 跑格式化工具测试**

```bash
pnpm test src/lib/format-elapsed.test.ts
```

Expected: PASS。

- [ ] **Step 4: 跑 lint**

```bash
pnpm eslint src/components/conversations/session-details-dialog.tsx src/components/conversations/session-details-dialog.test.tsx
```

Expected: PASS。

- [ ] **Step 5: 检查 diff 空白问题**

```bash
git diff --check
```

Expected: 无输出，退出码 0。

---

### Task 5: 提交与 PR

**Files:**

- Modify: `src/components/conversations/session-details-dialog.tsx`
- Modify: `src/components/conversations/session-details-dialog.test.tsx`

- [ ] **Step 1: 查看最终 diff**

```bash
git diff -- src/components/conversations/session-details-dialog.tsx src/components/conversations/session-details-dialog.test.tsx
```

Expected:

- 只有 `SessionDetailsDialog` duration 解析 helper 和对应测试。
- 没有 schema、parser、agent lifecycle、状态栏、消息渲染、国际化文案或 unrelated formatting。

- [ ] **Step 2: 提交**

```bash
git add src/components/conversations/session-details-dialog.tsx src/components/conversations/session-details-dialog.test.tsx
git commit -m "fix: compute completed session runtime from timestamps"
```

Expected: 生成一个单 commit。

- [ ] **Step 3: 推送并创建 PR**

```bash
git push -u origin codex/fix-agent-runtime-duration
gh pr create \
  --repo xintaofei/codeg \
  --title "fix: compute completed session runtime from timestamps" \
  --body-file pr-body.md
```

`pr-body.md` 内容：

```markdown
## Summary

- keep using `total_duration_ms` when parsers provide a positive duration
- fall back to completed conversation timestamps when parser stats have no duration
- add regression coverage so in-progress sessions do not derive a moving duration from timestamps

Fixes #273.

## Tests

- pnpm test src/components/conversations/session-details-dialog.test.tsx
- pnpm test src/components/conversations/active-session-details.test.ts
- pnpm test src/lib/format-elapsed.test.ts
- pnpm eslint src/components/conversations/session-details-dialog.tsx src/components/conversations/session-details-dialog.test.tsx
- git diff --check
```

Expected: PR 创建成功；如果某条验证未执行或失败，必须从 `pr-body.md` 删除对应通过项，并如实说明未覆盖项。

## 自检

- Spec coverage: issue 反映运行时长统计不准；计划通过 completed 会话真实开始/结束时间差兜底覆盖 parser duration 缺失路径。
- Placeholder scan: 本计划不含占位说明、未定义函数或泛化“补测试”步骤。
- Type consistency: `resolveSessionDurationMs()` 使用现有 `DbConversationSummary` 与 `SessionStats` 类型，不引入新 schema 字段。
- 风险控制: 只改详情弹窗展示层；不影响 parser、数据库、导入、状态栏和运行中 live timer。
