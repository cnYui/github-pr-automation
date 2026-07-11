# speckit-companion 安装命令文档跟进设计与计划

## 背景

- 原候选 `alfredoperez/speckit-companion#419` 已由上游提交 `55145b1` 直接修复，当前 `main` 已包含前导斜杠归一化、回归测试和设置说明，不能再提交同向 PR。
- 同一轮发布中的 `#420` 也由提交 `ff4e6ab` 修复：编辑器内的 `specify extension add` 命令不再携带旧 CLI 不支持的 `--force`。
- 根目录 `README.md` 的手动安装示例仍保留 `specify extension add ... --force`，与实际生成命令和回归测试不一致，用户复制文档命令仍会遇到 #420 的报错。
- 当前没有覆盖该文档漂移的开放 PR。

## 必须解决的问题

让根 README 的 Companion spec-kit extension 安装/更新说明与 `buildInstallCommand()` 保持一致，避免文档继续分发已知无效的参数。

## 方案

- 只修改根目录 `README.md` 的安装段落。
- 保留 `uv tool install ... --force`，因为该参数属于 `uv` 且受支持。
- 从 `specify extension add companion --from ...` 及对应说明中移除 `--force`。
- 将“重新运行并携带 `--force`”改成“重新运行同一命令”，与当前代码注释中的 install-or-update 语义一致。
- 不改 `speckit-extension/` 下的独立产品文档，避免把一个 VS Code extension 文档跟进扩大成跨产品版本/CHANGELOG 变更。

## 边界与取舍

- 这是有用户影响的文档修复，不做纯格式化。
- 不重新修改已经通过测试的安装命令实现。
- 不声明关闭 #419；PR 说明标注为 #420 的文档跟进。

## 验证

```powershell
npx jest src/speckit/specKitExtensionInstall.test.ts --runInBand
npx jest tests/integration/docs-consistency.test.ts --runInBand
npm run compile
rg -n -- "specify extension add companion.*--force" README.md
git diff --check
```

## 提交计划

- 分支：`codex/docs-install-command-no-force`
- 提交：`docs(readme): align companion install command with CLI`
- PR 目标：`alfredoperez/speckit-companion:main`
