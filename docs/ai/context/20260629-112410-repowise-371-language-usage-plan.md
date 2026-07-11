# repowise Language Usage 过滤 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `repowise-dev/repowise#371` 提交一个小 PR，让语言使用区不再展示 `JSON`、`YAML`、`TOML` 这类配置/数据格式语言。

**Architecture:** 只在共享展示组件 `LanguageDonut` 内过滤可见语言，让 overview 与 stats 页面自然复用同一逻辑。后端仍保留原始语言统计，避免影响扫描、API 契约、图谱和文件筛选。

**Tech Stack:** TypeScript、React、Vitest、Testing Library、Recharts、npm workspaces。

---

## 上游核验证据

- 时间：2026-06-29 11:16 JST 左右。
- issue：`https://github.com/repowise-dev/repowise/issues/371`，状态 `OPEN`，标题 `[Refactor] Language usage section`，标签 `good first issue`。
- issue 内容明确要求不展示 `json`、`yaml`、`toml`，理由是它们不增加语言使用区价值，并希望接近 GitHub repo page 的展示。
- open PR 查重：`gh search prs --repo repowise-dev/repowise --state open "371 language usage json yaml toml"` 返回空数组。
- 仓库状态：默认分支 `main`，未归档，主语言 Python，最近推送 `2026-06-28T12:52:09Z`。
- 临时浅克隆 HEAD：`db1ef2dc71eac741b82754d59a8172b1127e0f09`。

## 范围

做：

- 在 `packages/ui/src/dashboard/language-donut.tsx` 内过滤 `JSON`、`YAML`、`TOML`。
- 过滤大小写不敏感，并在过滤后重新计算百分比。
- 新增 UI 单测覆盖混合大小写输入和“只剩配置语言”输入。

不做：

- 不改 `packages/server` 的 `overview-summary` 或 `stats/highlights` API。
- 不改 `GraphNode.language`、语言识别、ingestion、文件索引或颜色算法。
- 不重做 donut 样式、布局、tooltip 或语言排序。

## 文件结构

- Modify: `packages/ui/src/dashboard/language-donut.tsx`
  - 责任：共享语言使用 donut 组件；过滤只属于展示层，所有调用方复用。
- Create: `packages/ui/__tests__/dashboard/language-donut.test.tsx`
  - 责任：验证配置/数据格式语言不会出现在语言使用区，并验证百分比基于过滤后的语言重新计算。
- Read only: `packages/web/src/app/repos/[id]/overview/page.tsx`
  - 责任：overview 页调用 `LanguageDonut`，无需改动。
- Read only: `packages/web/src/components/stats/architecture-tab.tsx`
  - 责任：stats architecture tab 调用 `LanguageDonut`，无需改动。
- Read only: `packages/web/src/components/stats/quality-tab.tsx`
  - 责任：stats quality tab 调用 `LanguageDonut`，无需改动。

---

### Task 1: 建立干净执行目录并复查上游状态

**Files:**

- Modify: none
- Test: none

- [ ] **Step 1: 克隆并建分支**

```bash
mkdir -p work
git clone https://github.com/repowise-dev/repowise.git work/repowise-371
cd work/repowise-371
git checkout -b codex/hide-config-languages-usage
```

Expected: 当前分支为 `codex/hide-config-languages-usage`。

- [ ] **Step 2: 复查 issue 仍可推进**

```bash
gh issue view 371 --repo repowise-dev/repowise --json number,title,state,labels,url
gh search prs --repo repowise-dev/repowise --state open "371 language usage json yaml toml" --json number,title,url --limit 20
```

Expected:

- issue `371` 仍是 `OPEN`。
- open PR 搜索结果为空；如果出现同向 PR，停止执行并回到日报仓记录原因。

- [ ] **Step 3: 安装依赖**

```bash
npm ci
```

Expected: 依赖安装成功，没有 lockfile drift。

---

### Task 2: 写失败测试

**Files:**

- Create: `packages/ui/__tests__/dashboard/language-donut.test.tsx`
- Modify: none
- Test: `packages/ui/__tests__/dashboard/language-donut.test.tsx`

- [ ] **Step 1: 新增测试文件**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LanguageDonut } from "../../src/dashboard/language-donut.js";

describe("LanguageDonut", () => {
  it("hides config file formats from the visible language usage", () => {
    render(
      <LanguageDonut
        distribution={{
          Python: 7,
          TypeScript: 3,
          JSON: 5,
          yaml: 4,
          TOML: 1,
        }}
      />,
    );

    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.queryByText("JSON")).not.toBeInTheDocument();
    expect(screen.queryByText("yaml")).not.toBeInTheDocument();
    expect(screen.queryByText("TOML")).not.toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
  });

  it("renders nothing when only config file formats are present", () => {
    const { container } = render(
      <LanguageDonut distribution={{ json: 2, YAML: 1, toml: 1 }} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: 运行目标测试并确认失败**

```bash
npm run test --workspace @repowise-dev/ui -- __tests__/dashboard/language-donut.test.tsx
```

Expected: FAIL。至少出现 `JSON` 仍在文档中，或 `70%` 找不到，因为当前组件未过滤配置语言且百分比按未过滤总量计算。

---

### Task 3: 实现展示层过滤

**Files:**

- Modify: `packages/ui/src/dashboard/language-donut.tsx`
- Test: `packages/ui/__tests__/dashboard/language-donut.test.tsx`

- [ ] **Step 1: 在组件顶部增加过滤集合和判断函数**

在 `LANG_COLORS` 后加入：

```tsx
const HIDDEN_LANGUAGE_USAGE_FORMATS = new Set(["json", "yaml", "toml"]);

function shouldShowLanguageUsage(name: string): boolean {
  return !HIDDEN_LANGUAGE_USAGE_FORMATS.has(name.trim().toLowerCase());
}
```

- [ ] **Step 2: 过滤 entries**

把 `LanguageDonut` 内的 entries 构造替换为：

```tsx
  const entries = Object.entries(distribution)
    .filter(([name]) => shouldShowLanguageUsage(name))
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
```

保留后续代码不变：

```tsx
  const total = entries.reduce((s, e) => s + e.value, 0);
  if (total === 0) return null;
```

Reason: 过滤发生在 `total` 计算前，展示百分比会基于真正显示的语言重新计算。

- [ ] **Step 3: 运行目标测试并确认通过**

```bash
npm run test --workspace @repowise-dev/ui -- __tests__/dashboard/language-donut.test.tsx
```

Expected: PASS。

---

### Task 4: 跑最小验证集

**Files:**

- Modify: none
- Test: package validation

- [ ] **Step 1: 跑 UI 包目标测试**

```bash
npm run test --workspace @repowise-dev/ui -- __tests__/dashboard/language-donut.test.tsx
```

Expected: PASS。

- [ ] **Step 2: 跑 UI 包类型检查**

```bash
npm run type-check --workspace @repowise-dev/ui
```

Expected: PASS。

- [ ] **Step 3: 跑 UI 包完整测试**

```bash
npm run test --workspace @repowise-dev/ui
```

Expected: PASS。若出现与本改动无关的既有 flaky 失败，记录完整失败测试名和错误，不要说全量通过。

- [ ] **Step 4: 检查 diff 空白问题**

```bash
git diff --check
```

Expected: 无输出，退出码 0。

---

### Task 5: 提交与 PR

**Files:**

- Modify: `packages/ui/src/dashboard/language-donut.tsx`
- Create: `packages/ui/__tests__/dashboard/language-donut.test.tsx`

- [ ] **Step 1: 查看最终 diff**

```bash
git diff -- packages/ui/src/dashboard/language-donut.tsx packages/ui/__tests__/dashboard/language-donut.test.tsx
```

Expected:

- 只有 `LanguageDonut` 的展示过滤逻辑和新增测试。
- 没有 `packages/server`、ingestion、颜色、布局或 unrelated formatting。

- [ ] **Step 2: 提交**

```bash
git add packages/ui/src/dashboard/language-donut.tsx packages/ui/__tests__/dashboard/language-donut.test.tsx
git commit -m "fix: hide config languages from language usage"
```

Expected: 生成一个单 commit。

- [ ] **Step 3: 推送并创建 PR**

```bash
git push -u origin codex/hide-config-languages-usage
gh pr create \
  --repo repowise-dev/repowise \
  --title "fix: hide config languages from language usage" \
  --body-file pr-body.md
```

`pr-body.md` 内容：

```markdown
## Summary

- hide JSON, YAML, and TOML from the shared language usage donut
- recalculate visible percentages after filtering config/data formats
- add a regression test for mixed-case config language names

Fixes #371.

## Tests

- npm run test --workspace @repowise-dev/ui -- __tests__/dashboard/language-donut.test.tsx
- npm run type-check --workspace @repowise-dev/ui
- npm run test --workspace @repowise-dev/ui
- git diff --check
```

Expected: PR 创建成功；如果完整 UI 测试未跑或有无关失败，必须从 `pr-body.md` 删除对应通过项并改为说明未覆盖项。

## 自检

- Spec coverage: issue 要求隐藏 `json`、`yaml`、`toml`，Task 2 与 Task 3 覆盖；overview/stats 通过共享组件继承。
- Placeholder scan: 本计划不含占位说明、未定义函数或泛化“补测试”步骤。
- Type consistency: 测试导入 `LanguageDonut`，实现只新增局部 helper，不改变组件 props 类型。
- 风险控制: 后端原始统计不变，避免破坏 API、图谱、文件筛选和 ingestion 语义。
