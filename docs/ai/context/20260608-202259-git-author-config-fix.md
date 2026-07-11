# Git 作者邮箱配置修复

## 背景

`ChatLab/ChatLab#210` 合并后，维护者提醒提交邮箱是 `developer@example.com`，导致 GitHub 无法把贡献者正确关联到用户账号。

本地核对结果：

- 全局 Git 配置曾为 `Developer <developer@example.com>`。
- `work/ChatLab-195` 中 PR #210 的提交作者确实写入为 `Developer <developer@example.com>`。
- 这不是 GitHub 隐私邮箱导致的问题；GitHub 隐私邮箱通常是 `...@users.noreply.github.com`。

## 决策

将本机全局 Git 作者信息改为用户 GitHub 可关联邮箱：

```powershell
git config --global user.name "cnYui"
git config --global user.email "xiaobianfuai@gmail.com"
git config --global user.useConfigOnly true
```

保留已合并 PR 的历史提交，不做 force-push 或重写历史。

## 取舍

- 优先保证后续 PR 的贡献者关联正确。
- 不重写 `ChatLab#210` 历史，因为 PR 已合并，重写收益低且会制造额外维护成本。
- `user.useConfigOnly=true` 可以避免 Git 在缺少配置时猜测默认身份，降低再次出现占位邮箱的风险。

## 验证

已核对全局配置来源：

```text
global file:C:/Users/yui/.gitconfig user.name cnYui
global file:C:/Users/yui/.gitconfig user.email xiaobianfuai@gmail.com
global file:C:/Users/yui/.gitconfig user.useconfigonly true
```
