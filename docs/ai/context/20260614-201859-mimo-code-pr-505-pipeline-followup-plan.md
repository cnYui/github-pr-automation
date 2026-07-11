# MiMo-Code PR #505 pipeline follow-up 计划

## 背景

- PR：`XiaomiMiMo/MiMo-Code#505`
- 新反馈：`fengjikui` 指出 plan agent 的 bash read allowlist 仍允许管道链路把只读命令输出交给写入或删除命令。
- 例子：
  - `cat package.json | tee out.txt`
  - `rg needle src | tee out.txt`
  - `git diff | tee out.patch`
  - `find . -print0 | xargs rm -f`
  - `Get-Content package.json | Set-Content out.txt`

## 判断

- 反馈成立的可能性高，因为 `Permission.evaluate` 对整条 bash 字符串匹配，`cat *`、`rg *`、`find *`、`git diff *`、`Get-Content *` 这类宽 allow 会覆盖右侧命令的写入语义。
- 对 plan mode 来说，默认拒绝 pipeline 比解析右侧命令更保守，也更适合当前 PR 的小范围修复。

## 执行计划

1. 在现有 `plan agent allows only read-only bash commands by default` 用例中加入管道写入/删除负向测试。
2. 运行目标测试确认 RED。
3. 在 plan agent bash 权限中增加 pipeline deny pattern。
4. 复跑目标测试、相关 agent 测试和 `git diff --check`。
5. 提交并推送到现有 PR 分支。
6. 回复 PR 评论，说明本轮只采用保守拒绝 pipeline 的方案。

## 风险

- 这会拒绝所有 pipeline，包括只读到只读的组合；但 plan mode 的首要约束是只读安全，当前没有结构化 shell parser 支持精确判断右侧命令。
