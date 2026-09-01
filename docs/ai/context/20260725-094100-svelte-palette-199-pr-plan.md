# `untemps/svelte-palette#199` PR 计划

## 背景

用户要求必须找到一个可提交 PR 并完成提交。日报流水线本轮候选均因 live preflight 未通过跳过，因此本轮改为主动搜索近期开放的低风险 GitHub 贡献机会。

## 候选选择

- 选择仓库：`untemps/svelte-palette`
- Issue：`https://github.com/untemps/svelte-palette/issues/199`
- 标题：`EyeDropper export documented under wrong name`
- 默认分支：`main`
- 默认分支 SHA：`602cbb4de17768a71480f8baa2410877d026673d`

选择原因：

- Issue 由维护者创建，描述具体到文件、行附近、错误导出名和建议替换内容。
- 当前 README 仍写 `PaletteEyeDropper`，但入口导出为 `PaletteEyeDropperButton`。
- `gh pr list` 按 `EyeDropper`、`PaletteEyeDropper`、`PaletteEyeDropperButton` 搜索未发现开放 PR。
- 仓库 README 的 Contributing 部分明确欢迎 fork、feature branch 和 Pull Request。
- 改动范围仅限 README 文档，不需要外部账号、云资源、密钥或维护者权限。

跳过的候选：

- `rapina-rs/rapina#701`：看似合适，但已有外部贡献者在 issue 中 `/take`，不抢占。
- `vishnugovind10/haircut#7`：需要先梳理 CSV/JSON 导出字段和 demo/live 可用性，范围比本轮文档名修复更开放。

## 实施边界

- 只修改 `README.md` 的 EyeDropper API Support 段落。
- 把错误的 `PaletteEyeDropper` 改为 `PaletteEyeDropperButton`。
- 增加可复制的 import 示例，避免用户只知道组件存在但不知道导入路径。
- 不改源码、不改构建配置、不做格式化噪音。

## 验证计划

- 搜索确认 README 不再出现错误导出名 `PaletteEyeDropper component`。
- 搜索确认 README 包含 `import { PaletteEyeDropperButton } from '@untemps/svelte-palette'`。
- 搜索确认 `src/lib/index.js` 导出 `PaletteEyeDropperButton`。
- 运行 `git diff --check`。
- 若仓库提供轻量文档检查命令则补跑；否则作为 doc-only PR 说明未运行构建。
