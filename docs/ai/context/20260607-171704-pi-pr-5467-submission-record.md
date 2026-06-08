# pi PR #5467 提交记录

## 背景

- 项目：`earendil-works/pi`
- Issue：#5418
- 工作目录：`work/pi-5418-restart`
- 分支：`codex/fix-models-json-migration-error-path`
- commit：`23ff58a9adf868e24d48715b8b5e67b7272e52c5`
- PR：`https://github.com/earendil-works/pi/pull/5467`

## 改动范围

- `packages/coding-agent/src/migrations.ts`
  - 将 `models.json` 路径解析为绝对路径。
  - 在 config value migration 读取 malformed `models.json` 时捕获 `SyntaxError`，错误信息中附带具体文件路径。
  - 非 `SyntaxError` 仍按原异常路径抛出。
- `packages/coding-agent/test/config-value-migration.test.ts`
  - 新增 malformed `models.json` 回归测试，断言错误信息同时包含 parse error 和文件路径。
  - mock keybindings migration，避免测试被无关迁移逻辑影响。

## 验证

- Docker Linux 完整 package test：
  - 镜像：`node:22.19.0-bookworm`
  - 命令：`npm ci --ignore-scripts && npm run build && npm --workspace @earendil-works/pi-coding-agent test`
  - 结果：`Test Files 132 passed | 6 skipped (138)`
  - 结果：`Tests 1357 passed | 44 skipped (1401)`
- `wsl bash -lc 'cd /mnt/d/CodeWorkSpace/github-10-pr-pr-5-pr/work/pi-5418-restart && npm run check'`
  - `Checked 631 files in 6s. No fixes applied.`
  - `packages/coding-agent/npm-shrinkwrap.json is up to date.`
  - exit code 0
- `git diff --check`
  - exit code 0
- `git diff --cached --check`
  - exit code 0

## 验证环境说明

- Docker Desktop on WSL2 的容器 `/proc/version` 会暴露 Microsoft/WSL kernel 字符串，导致 clipboard 单测把普通 Linux CI 环境误判为 WSL。
- 验证容器以 `--privileged` 启动后，在容器内 bind mount 了普通 Linux 字符串到 `/proc/version`。
- 该操作只存在于验证容器，不影响仓库文件和 PR diff。

## 提交与推送

- 显式 stage 了 2 个文件，没有使用 `git add .`。
- 新建 fork：`cnYui/pi`。
- 使用 SSH remote `git@github.com:cnYui/pi.git` 推送分支。
- 使用 `gh pr create` 创建 PR #5467。

## 取舍

- 本 PR 只修复 malformed `models.json` 迁移报错缺少路径的问题，不调整其他迁移错误格式。
- 错误路径使用绝对路径，便于用户在多 config 目录或迁移批处理中定位实际坏文件。
