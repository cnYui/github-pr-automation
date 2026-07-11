# 2026-06-27 三项目 PR 主线程验收清单

## 通用验收

- worker 返回 `DONE` 或明确说明 `DONE_WITH_CONCERNS`。
- 有 PR URL、分支名、commit SHA、修改文件列表。
- RED/GREEN 证据清楚：失败测试先失败，修复后通过。
- 验证命令覆盖目标测试和 `git diff --check`。
- PR 描述包含关联 issue、修复说明和验证摘要。
- 主线程只做结果复核，不修改 worker 负责的上游仓代码，除非 worker 明确 `BLOCKED` 且需要接管。

## holon

- PR 指向 `holon-run/holon` 默认分支。
- 只处理 `a//absolute/path` / `b//absolute/path` 兼容。
- 普通 `a/src/foo.rs`、`b/src/foo.rs` 仍按 git prefix 处理为相对路径。
- 不试图修复无法判别的 `a/home/...` 单斜杠绝对路径。

## octocode

- PR 指向 `Muvon/octocode` 默认分支。
- `.cppm`、`.ixx`、`.mxx`、`.ccm`、`.cxxm` 均被识别为 C++。
- 未引入可配置扩展名映射这类大功能。
- 目标语言索引测试通过。

## ccgram

- PR 指向 `alexei-led/ccgram` 默认分支。
- `tmux rename-window` 不会重置已读 offset 或重放历史 transcript。
- 测试不依赖真实 Telegram 或外部网络。
- 保持现有 session/window identity 语义，避免把 window name 当稳定 key。
