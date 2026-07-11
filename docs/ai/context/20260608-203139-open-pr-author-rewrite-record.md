# Open PR 作者邮箱重写记录

时间：2026-06-08 20:31 JST

## 背景

本机 Git author 已修复为 `cnYui <xiaobianfuai@gmail.com>`，但此前已推送的三个新 open PR 仍使用 `Developer <developer@example.com>`，导致 GitHub 贡献者关联失败。

本轮只处理尚无 review 评论、范围清晰、单 commit 的三个新 PR：

- `anthropics/skills#1281`
- `coderamp-labs/gitingest#583`
- `MiniMax-AI/MiniMax-MCP#90`

## 操作

三个分支均执行：

```powershell
git commit --amend --reset-author --no-edit
git push --force-with-lease=<remote-ref>:<old-head> <remote> HEAD:<branch>
```

执行前后校验 commit tree hash 一致，确认只改提交元数据，不改代码内容。

## 结果

| PR | 旧 SHA | 新 SHA | 远端分支 | GitHub 验证 |
| --- | --- | --- | --- | --- |
| `anthropics/skills#1281` | `312df82c23b0` | `79e536b17ded` | `origin/codex/fix-skill-creator-utf8-io` | `cnYui <xiaobianfuai@gmail.com>` |
| `coderamp-labs/gitingest#583` | `20cf4e7f7bea` | `c57c2c4a9e97` | `origin/codex/fix-utf8-chunk-boundary-detection` | `cnYui <xiaobianfuai@gmail.com>` |
| `MiniMax-AI/MiniMax-MCP#90` | `1f3279cc0eb2` | `48be654cf4e4` | `fork/codex/fix-text-to-audio-empty-text-error` | `cnYui <xiaobianfuai@gmail.com>` |

GitHub PR API 已确认三个 PR 的 `commits[].authors[]` 均显示：

```text
name: cnYui
email: xiaobianfuai@gmail.com
login: cnYui
```

## 未处理范围

- `ChatLab#210` 已合并，不重写历史。
- `thinking-machines-lab/tinker-cookbook#741` 含多个提交且较早，暂不为邮箱单独 force-push。
- `personal-knowledge#4/#5`、`Hai-qq/SW#1/#2` 属于旧业务 PR 清理范围，后续按是否继续合并单独处理。

## 注意

force-push 后三个 PR 的远端 head SHA 已改变，远端 CI 或 merge state 可能短暂显示 `UNKNOWN`，等待 GitHub 重新计算即可。
