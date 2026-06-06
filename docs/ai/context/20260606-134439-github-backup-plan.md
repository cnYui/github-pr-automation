# GitHub 备份计划

## 背景

用户要求把当前项目提交到 GitHub 备份，并使用 `gh` 创建新仓库。

## 仓库策略

- 本地当前目录还不是 git 仓库，需要先执行 `git init`。
- 远端仓库默认使用当前目录名：`github-10-pr-pr-5-pr`。
- 备份仓库默认创建为 private，避免误公开本地上下文。
- 默认分支使用 `main`。

## 提交范围

纳入提交：

- 源码：`src/`、`tests/`
- 页面与报告：`index.html`、`public/`、`dist/`
- 项目配置：`package.json`、`package-lock.json`、`tsconfig.json`、`vitest.config.ts`
- 上下文文档：`AGENTS.md`、`docs/ai/context/`
- 提交控制：`.gitignore`

排除提交：

- `node_modules/`
- `work/`
- `outputs/`
- `.env*`
- 本地缓存、日志和系统文件

## 验证计划

- 运行 `npx vitest run src` 验证项目源码测试。
- 运行 `npm run build` 验证页面可构建。
- 使用 `git status --short --ignored` 检查忽略规则。
- 推送后用 `gh repo view` 和 `git ls-remote` 核验远端存在且 main 分支可访问。
