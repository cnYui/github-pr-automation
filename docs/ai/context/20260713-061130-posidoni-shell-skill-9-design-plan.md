# posidoni/shell-skill #9 实施设计

- 候选：`posidoni/shell-skill#9`
- 基线：`292a0355aa7c277a473ce4d130ad2d7f5ff57bb3`
- 分支：`docs/bash-nullglob-empty-match`
- 工作目录：`work/opportunity-pipeline/posidoni__shell-skill`

## 必须解决的问题

Bash 的未匹配 glob 默认保留为字面模式，导致循环在空目录中仍执行一次。仓库缺少这一非 ShellCheck 可检测陷阱的说明和 runnable pair。

## 最小方案

1. 新增 `examples/bash/04-nullglob-empty-match.good.sh`，在受控临时目录中启用 `nullglob`，证明空匹配产生零次循环。
2. 新增对应 `.bad.sh`，安全复现字面 `*.txt` 被处理一次，并声明 `# expect-shellcheck: none`。
3. 更新 Bash 示例表和 `reference/bash.md` 的 Globbing 章节，说明默认行为、`nullglob` 与 `failglob` 的取舍。

## 约束与验证

- 遵循仓库 `bash` 与 `shell-standards` Skill。
- good/bad 文件保持安全、自包含；good 文件可执行并退出 0。
- 运行 `task ci`、`task hooks` 与 `git diff --check`。
- 不修改工具链、CI 或其他示例。
