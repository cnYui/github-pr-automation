# repowise PR #623 提交记录

日期：2026-06-29

## 目标

执行 `docs/ai/context/20260629-112410-repowise-371-language-usage-plan.md`，为 `repowise-dev/repowise#371` 提交一个小 PR，让 language usage donut 不再展示 `JSON`、`YAML`、`TOML` 这类配置/数据格式语言。

## 上游状态

- issue：`https://github.com/repowise-dev/repowise/issues/371`
- 状态：`OPEN`
- 标签：`good first issue`
- 提交前查重：`gh search prs --repo repowise-dev/repowise --state open "371 language usage json yaml toml"` 返回空数组。

## 实现范围

- 修改 `packages/ui/src/dashboard/language-donut.tsx`
  - 新增大小写不敏感的隐藏集合：`json`、`yaml`、`toml`
  - 在 entries 进入排序、切片和百分比计算前过滤这些格式
- 新增 `packages/ui/__tests__/dashboard/language-donut.test.tsx`
  - 覆盖混合大小写输入下 `JSON`、`yaml`、`TOML` 不渲染
  - 覆盖过滤后百分比按可见语言重新计算
  - 覆盖只包含配置格式时组件不渲染

## TDD 记录

RED：

```bash
npm run test --workspace @repowise-dev/ui -- __tests__/dashboard/language-donut.test.tsx
```

结果：失败，原因符合预期：`JSON` 仍在文档中，且只包含配置格式时组件仍渲染。

GREEN：

```bash
npm run test --workspace @repowise-dev/ui -- __tests__/dashboard/language-donut.test.tsx
```

结果：通过，`1` 个 test file、`2` 个 tests。

## 验证

```bash
npm run test --workspace @repowise-dev/ui -- __tests__/dashboard/language-donut.test.tsx
npm run type-check --workspace @repowise-dev/ui
npm run test --workspace @repowise-dev/ui
git diff --check
```

结果：

- 目标测试通过：`1` 个 test file、`2` 个 tests。
- UI type-check 通过。
- UI 全量测试通过：`85` 个 test files、`542` 个 tests。
- `git diff --check` 退出码 `0`；Windows 本机提示 `language-donut.tsx` 下次触碰会转 CRLF，不是空白错误。

## 提交与 PR

- fork：`https://github.com/cnYui/repowise`
- 分支：`codex/hide-config-languages-usage`
- commit：`5568df798dc97d26410819de37cff0970fb3f465`
- PR：`https://github.com/repowise-dev/repowise/pull/623`
- PR 标题：`fix: hide config languages from language usage`

即时远端状态：

- `state=OPEN`
- `mergeable=MERGEABLE`
- `reviewDecision=REVIEW_REQUIRED`
- `statusCheckRollup=[]`

## 后续

- 当前无远端 checks 可等待。
- 如维护者要求扩大过滤列表，优先让维护者确认范围；首 PR 仍保持 `JSON`、`YAML`、`TOML` 三项最小切口。
