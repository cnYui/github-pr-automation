# `untemps/svelte-palette#229` 提交记录

## 结果

- 上游仓库：`untemps/svelte-palette`
- Issue：`https://github.com/untemps/svelte-palette/issues/199`
- PR：`https://github.com/untemps/svelte-palette/pull/229`
- 本地目录：`D:\CodeWorkSpace\github-pr-automation\work\opportunity-pipeline\untemps__svelte-palette-20260725-0941`
- 分支：`docs/fix-eyedropper-export-name`
- Commit：`948a5d6df9406522bd5b893e384cc26157b41747`
- 状态：ready/open，`gh pr view` 显示 `MERGEABLE`

## live preflight

- 仓库未归档，默认分支为 `main`。
- 默认分支 SHA：`602cbb4de17768a71480f8baa2410877d026673d`。
- Issue #199 仍 open，且由维护者提交，问题描述明确。
- 按 `EyeDropper`、`PaletteEyeDropper`、`PaletteEyeDropperButton` 搜索开放 PR，未发现重复 PR。
- 仓库没有 `AGENTS.md`、`CONTRIBUTING.md` 或 PR 模板；README 的 Contributing 部分明确欢迎 fork、feature branch 和 PR。
- `package.json` 声明 MIT license。
- 真实入口文件为 `src/lib/index.ts`，其中导出 `PaletteEyeDropperButton`。

## 改动

- 只修改 `README.md`。
- 将 EyeDropper API Support 段落中的错误组件名 `PaletteEyeDropper` 改为 `PaletteEyeDropperButton`。
- 增加可复制的导入示例：

```js
import { PaletteEyeDropperButton } from '@untemps/svelte-palette'
```

## 验证

- `rg -n "PaletteEyeDropper component" README.md`：无匹配，旧错误文案已移除。
- `rg -n "import \{ PaletteEyeDropperButton \} from '@untemps/svelte-palette'" README.md`：通过。
- `rg -n "export \{ default as PaletteEyeDropperButton \}" src\lib\index.ts`：通过。
- `git diff --check HEAD^ HEAD`：通过。
- `git status --short --branch`：提交后工作树干净。

未运行构建：本次是 README-only 文档修复，PR 正文已明确说明。

## 远端状态

- `gh pr view 229`：open，base `main`，head `cnYui:docs/fix-eyedropper-export-name`，mergeable。
- `gh pr checks 229`：Vercel 为 failure，原因是 `Authorization required to deploy`，属于部署账号授权，不是代码或文档验证失败。
