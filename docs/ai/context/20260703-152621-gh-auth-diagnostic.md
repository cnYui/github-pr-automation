# gh 认证链路诊断记录

- 时间：2026-07-03 15:26:21 +09:00
- 目标：确认并修复此前 `gh` / GitHub HTTPS 认证异常

## 诊断结果

- `gh` 路径：`C:\Program Files\GitHub CLI\gh.exe`
- `gh` 版本：`2.89.0`
- 当前 GitHub CLI 登录账号：`cnYui`
- `GH_TOKEN` / `GITHUB_TOKEN` 环境变量：未设置，未覆盖 keyring 登录态
- `gh api user`：成功返回 `cnYui`
- `gh search prs --author cnYui --state open --limit 1`：成功
- `gh auth token`：成功返回 `gho_` token
- `git ls-remote https://github.com/octocat/Hello-World.git HEAD`：成功
- `git ls-remote https://github.com/cnYui/github-10-pr-pr-5-pr.git HEAD`：成功

## 配置核对

- `gh config get git_protocol`：`https`
- Git 全局 credential helper：`store`
- GitHub 专用 credential helper：
  - 空 helper reset 项
  - `!'C:\Program Files\GitHub CLI\gh.exe' auth git-credential`
- `git credential fill` 对 `https://github.com` 可返回用户名和密码，说明 Git HTTPS 能取到 GitHub CLI 凭据。

## 已执行修复

- 执行 `gh auth setup-git --hostname github.com`，用于幂等刷新 GitHub 专用 credential helper。
- 执行后配置没有异常变化，说明当前 helper 已是正确状态。

## 结论

当前 `gh api`、`gh search`、`gh auth token` 和 Git HTTPS 访问 GitHub 均正常。此前的 `HTTP 401 Requires authentication` / `SEC_E_NO_CREDENTIALS` 没有在本轮复现；当前可按正常 GitHub 巡检流程继续使用。
