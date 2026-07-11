# MiMo-Code PR #505 separator follow-up 计划

## 背景

- PR：`XiaomiMiMo/MiMo-Code#505`
- 新反馈：`fengjikui` 确认 `f59c3c8` 已覆盖 pipeline、`;`、`&&`、反引号和 `$()`，但仍有两个相邻分隔符绕过：
  - `cat package.json\ntouch out.txt`
  - `cat package.json & touch out.txt`

## 判断

- 反馈成立：换行和单 `&` 都能作为 shell 命令分隔符，在当前完整字符串通配匹配下仍可能被 `cat *` 等 read allow rule 覆盖。
- 当前 PR 仍采用 pattern-level hardening，最小修复是继续保守拒绝这些分隔符。

## 执行计划

1. 在目标测试中补充换行和单 `&` 负向用例。
2. 运行目标测试确认 RED。
3. 在 plan agent bash 权限中增加 `*\n*` 和 `*&*` deny。
4. 复跑目标测试、文件级 agent 测试、`git diff --check` 和 typecheck。
5. 提交推送到现有 PR 分支。
6. 回复 PR 评论并更新本地记录。

## 取舍

- 单 `&` deny 会覆盖 `&&`，但两者都应在 plan-mode bash 中保守拒绝。
- 若后续继续出现 shell 语法绕过，应考虑建议维护者改用结构化 shell parser，而不是继续扩展字符串通配规则。
