# CopilotKit PR #5296 提交记录

## PR

- 仓库：`CopilotKit/CopilotKit`
- PR：`https://github.com/CopilotKit/CopilotKit/pull/5296`
- 分支：`cnYui:codex/fix-copilot-runtime-links`
- base：`CopilotKit:main`
- 关联 issue：`#2082`

## 背景

原报告切口 `#5282` 在当前 main 上已能看到 headers 相关修复痕迹，不适合作为新 PR。

本轮改选仍 open 且无重复开放 PR 的文档 issue `#2082`：多个 reference 文档仍链接到已失效的 `/concepts/copilot-runtime`。

## 改动范围

只替换 Copilot Runtime 文档链接：

- `packages/runtime/src/lib/runtime/copilot-runtime.ts`
- `packages/react-core/src/components/copilot-provider/copilotkit-props.tsx`
- `showcase/shell-docs/src/content/reference/v1/classes/CopilotRuntime.mdx`
- `showcase/shell-docs/src/content/reference/v1/components/CopilotKit.mdx`

替换前：

```text
/concepts/copilot-runtime
```

替换后：

```text
/backend/copilot-runtime
```

## 验证

已运行：

```powershell
rg -n "concepts/copilot-runtime" packages showcase/shell-docs/src/content
```

结果：无命中。

已运行：

```powershell
rg -n "backend/copilot-runtime" packages/runtime/src/lib/runtime/copilot-runtime.ts packages/react-core/src/components/copilot-provider/copilotkit-props.tsx showcase/shell-docs/src/content/reference/v1/classes/CopilotRuntime.mdx showcase/shell-docs/src/content/reference/v1/components/CopilotKit.mdx
```

结果：4 个目标文件各命中 1 处。

已运行：

```powershell
git diff --check
```

结果：exit 0。Windows Git 输出 LF/CRLF 提示，但 diff 只包含 4 行链接替换。

未运行完整 docs build：当前浅 clone 没有安装依赖；本次是静态链接替换，已用搜索验证覆盖问题本身和替换目标。

## PR checks

`gh pr checks 5296 --repo CopilotKit/CopilotKit --watch=false` 当前结果：

- `Vercel – docs`：pending，正在部署。
- `Vercel Preview Comments`：pass。
- `analyze-major`、`auto-merge`：skipping。
- `Vercel – chat-with-your-data`、`form-filling`、`research-canvas`、`travel`：fail，原因均为 `Authorization required to deploy.`，属于 fork PR 的 Vercel 部署授权状态。

## 风险

风险低。PR 不新增页面、不改导航、不改运行时代码行为，只把坏链指向已存在的 `/backend/copilot-runtime` 路由。
