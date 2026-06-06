# lfnovo/open-notebook PR 切口调研

## 目标

为 `lfnovo/open-notebook` 找一个适合提交 PR 的低风险切入角度。优先选择维护者已认可、范围小、能本地验证、没有明显重复 PR 的问题。

## 仓库状态

- 仓库：`lfnovo/open-notebook`
- 地址：https://github.com/lfnovo/open-notebook
- 主语言：TypeScript
- License：MIT
- Star：26022
- 默认分支：`main`
- 最近推送：2026-06-04
- 贡献流程：仓库要求 issue-first，PR 最好先在 issue 下提出方案并等待分配；无关联 approved issue 的 PR 可能被关闭。

## 推荐切口

推荐做 `#726 feat: make source retry action more accessible`。

Issue 地址：https://github.com/lfnovo/open-notebook/issues/726

选择原因：

- 由维护者 `lfnovo` 创建，并带有 `ready` 标签，说明方向已被认可。
- 范围集中在前端 `SourceCard`，不涉及数据库、AI provider、内容处理 pipeline。
- 现有 API、hook、UI 都已经存在，问题集中在可发现性和交互细节。
- 当前未发现明确重复 PR；搜索过 `source retry`、`retry processing`、`SourceCard`、`stopPropagation` 等关键词。
- 前端已有 Vitest 和 Testing Library，可补组件测试，让 PR 不只是视觉调整。

## 具体代码入口

临时浅克隆路径：`/tmp/open-notebook-pr-angle`

主要文件：

- `frontend/src/components/sources/SourceCard.tsx`
- `frontend/src/app/(dashboard)/notebooks/components/SourcesColumn.tsx`
- `frontend/src/lib/hooks/use-sources.ts`
- `frontend/src/lib/api/sources.ts`

当前观察：

- `sourcesApi.retry(id)` 已存在，调用 `POST /sources/{id}/retry`。
- `useRetrySource()` 已存在。
- `SourcesColumn` 已把 `onRetry` 传给 `SourceCard`。
- `SourceCard` 在 failed 状态下有 dropdown 里的 `Retry Processing`，也有底部小按钮。
- 底部 retry 按钮的 `onClick={handleRetry}` 没有阻止冒泡，点击按钮可能同时触发整张卡片的 `onClick`，打开 source 详情。
- `SourceCard` 里存在 `/* eslint-disable-next-line @typescript-eslint/no-explicit-any */` 和 `(isFailed as any)`，可在本次小改中顺手去掉。

## 建议 PR 范围

标题建议：

`fix: make failed source retry action easier to access`

改动建议：

1. 在 failed source card 上保留一个始终可见的 retry 操作，位置比底部小按钮更明显，例如失败状态行或失败信息区域内的 `Retry Processing` 按钮。
2. 给直接 retry 按钮增加 `event.stopPropagation()`，避免点击 retry 时打开 source 详情。
3. 保留 dropdown 里的 retry 项，避免移除现有入口。
4. 去掉 `(isFailed as any)` 的不必要类型绕过。
5. 新增 `frontend/src/components/sources/SourceCard.test.tsx`：
   - failed source 会渲染始终可见的 retry 按钮；
   - 点击 retry 只调用 `onRetry(source.id)`；
   - 点击 retry 不调用卡片 `onClick`。

## 验证建议

在目标仓库里执行：

```bash
cd frontend
npm test -- SourceCard
npm run lint
```

如果修改了样式并需要截图，再启动：

```bash
cd frontend
npm run dev
```

## 暂不推荐的候选

- `#648 Search fails with "position overflow"`：维护者认可且很有价值，但 2026-06-05 已有人留言请求接手，容易撞车。
- `#756 leverage standard i18n tooling`：ready 且未分配，但涉及 dev tooling、依赖和配置，收益偏工程体验，PR 讨论成本可能高于 `#726`。
- `#781 Update Quickstart documentation`：很小，但仍是 `needs-triage`，且 issue 作者勾选了想自己实现，不适合作为优先切口。
- `#503 Optimize notebook SourceCard list performance`：有现成外部分支和维护者讨论，且性能改动更容易扩大范围。
- `#223 Select/deselect all sources`：已有历史 PR，重复风险更高。

## 建议先发的 issue 评论

```markdown
Hi @lfnovo, I'd like to pick this up if it's available.

I checked the current `SourceCard` flow and the retry path already exists through the API, hook, dropdown item, and a failed-state button. My proposed scope is intentionally small:

- make the failed-source retry action visibly available on the card without relying on the hover-only dropdown
- stop the retry button click from bubbling to the card click handler, so retry does not also open the source detail view
- add a focused component test for failed source retry visibility and click behavior

If that matches the intent of this issue, could you assign it to me?
```

