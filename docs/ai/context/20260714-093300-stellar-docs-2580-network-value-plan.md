# stellar-docs #2580 network 参数修复计划

## 目标

修复 cross-contract guide 中 `stellar contract bindings rust` 示例的无值 `--network` 参数，避免 CLI 把 `--contract-id` 误解析为 network 名称。

## 最小范围

- `docs/build/guides/conventions/cross-contract.mdx`

只把命令改为 `--network testnet`，不扩写段落、不修改其他 CLI 示例、不更新生成内容。

## 依据

- Issue #2580 由维护者创建并给出预期命令。
- 默认分支 `c91a1b2a` 仍存在 `--network --contract-id`。
- 当前开放 PR 无同向文件或 Issue 覆盖。

## 验证

1. 使用锁文件安装依赖。
2. 对目标 MDX 运行仓库 Prettier 配置检查。
3. 运行完整 Docusaurus build，验证 MDX 和链接。
4. 运行 `git diff --check` 并核对单文件 diff。

## 发布约束

- 上游文案、commit 与 PR 使用英文。
- 创建 PR 前记录 publication intent，并按 `cnYui` head 分支查询现有 PR。
- 禁止自动 merge。
