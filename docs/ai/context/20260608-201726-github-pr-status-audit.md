# GitHub PR 状态审计

时间：2026-06-08 20:17 JST

## 范围

- 当前 GitHub CLI 授权账号：`cnYui`
- 查询范围：
  - `author:cnYui is:open`，共 16 个 open PR
  - `author:cnYui is:closed updated:>=2026-06-01`，用于发现最近合并或关闭后的后续事项
- 使用证据：
  - `gh search prs --author cnYui --state open --sort updated --order desc --limit 100`
  - `gh pr view <url> --json statusCheckRollup,mergeStateStatus,mergeable,reviewDecision,comments,latestReviews,commits`
  - `git config --global --get user.email/name`
  - `git config --get user.email/name`

## 需要处理

### Git author 邮箱配置错误

`ChatLab/ChatLab#210` 已合并，但维护者评论提醒：commit 邮箱是 `developer@example.com`，导致贡献者无法关联到 `cnYui`。

本机当前配置确认如下：

- 全局：`Developer <developer@example.com>`
- 当前仓库：`Developer <developer@example.com>`

已确认受影响的 open PR：

- `anthropics/skills#1281`：1 个 commit，author 为 `Developer <developer@example.com>`
- `coderamp-labs/gitingest#583`：1 个 commit，author 为 `Developer <developer@example.com>`
- `MiniMax-AI/MiniMax-MCP#90`：1 个 commit，author 为 `Developer <developer@example.com>`
- `thinking-machines-lab/tinker-cookbook#741`：2 个 commit，其中包含 `Developer <developer@example.com>`
- `cnYui/personal-knowledge#4/#5`、`Hai-qq/SW#1/#2` 也包含该错误邮箱，属于旧业务 PR 清理范围

建议先修正本机 Git author 配置，再继续提交新 PR。可选邮箱：

- 真实且已在 GitHub 验证的邮箱，例如本轮 CLA 使用过的 `xiaobianfuai@gmail.com`
- GitHub no-reply：`132864240+cnYui@users.noreply.github.com`

是否重写现有 open PR 的 commit author 需要谨慎：这会 force-push 并重跑 CI。对刚提交且尚无 review 的 `anthropics/skills#1281`、`coderamp-labs/gitingest#583`、`MiniMax-AI/MiniMax-MCP#90` 可以考虑修；对已有讨论或较老 PR，不建议只为贡献者归属强行重写。

### `chopratejas/headroom#649`

- 状态：draft
- CI：除 GitGuardian 成功外，其余 GitHub Actions 在 2026-06-08 被取消
- 当前没有外部 review 要求改代码

如果该 PR 已准备给维护者看，应先确认是否要从 draft 标记为 ready，并让远端 CI 重新跑。若继续保持 draft，则暂时不处理。

### 旧业务 PR 清理

以下 open PR 已长期未更新且当前为 conflict：

- `cnYui/personal-knowledge#4`
- `cnYui/personal-knowledge#5`
- `Hai-qq/SW#1`
- `Hai-qq/SW#2`

这些不像外部贡献 PR，更像历史分支清理事项。若后续不再合并，应关闭；若仍要保留，需要单独 rebase/拆分。

## 暂不需要改代码

- `getzep/graphiti#1539`：代码相关 checks 通过，唯一失败仍是 `CLAAssistant`；已签 CLA。最新外部评论来自 `bonajoy`，内容是同意把额外 live-path 问题拆到 follow-up，不要求本 PR 改代码。
- `CopilotKit/CopilotKit#5296`：失败项是 Vercel 团队授权，不是代码失败；Claude 只提示 fork PR 自动 review 未运行。
- `cclank/cell-architecture-studio#8`：draft，Vercel 失败指向账号部署阻塞，不是代码失败。
- `anthropics/skills#1281`、`coderamp-labs/gitingest#583`：无评论、无失败 check，当前主要等待 review；但 commit author 邮箱需要决定是否重写。
- `MiniMax-AI/MiniMax-MCP#90`：merge state clean，无评论、无失败 check；但 commit author 邮箱需要决定是否重写。
- `GLips/Figma-Context-MCP#384`、`jackwener/OpenCLI#1870`：GitHub 当前无 check rollup，无评论；等待维护者处理。
- `MemTensor/MemOS#1894`、`czlonkowski/n8n-mcp#836`、`thinking-machines-lab/tinker-cookbook#741`：当前无失败 check、无 review 评论；主要等待 review。
- `shareAI-lab/Kode-CLI#190`、`ChatLab/ChatLab#210`：已合并。
- `earendil-works/pi#5467`：被仓库门禁自动关闭，原因是未获 `lgtm` 批准贡献者需先开 issue，不是代码失败。

## 建议动作

1. 先确认 Git author 使用 `xiaobianfuai@gmail.com` 还是 `132864240+cnYui@users.noreply.github.com`。
2. 修正全局和当前仓库 Git 配置，避免后续 PR 继续出现 `developer@example.com`。
3. 决定是否重写 `anthropics/skills#1281`、`coderamp-labs/gitingest#583`、`MiniMax-AI/MiniMax-MCP#90` 三个新 open PR 的 author。
4. `graphiti#1539`、`CopilotKit#5296`、`cell-architecture-studio#8` 当前不通过代码或空提交处理。
