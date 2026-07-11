# MiMo-Code PR #505 control operator follow-up 计划

## 背景

- PR：`XiaomiMiMo/MiMo-Code#505`
- 新反馈：`fengjikui` 确认 `115865a` 已覆盖 pipeline 绕过，但仍存在 shell 控制操作符和命令替换绕过。
- 例子：
  - `cat package.json; touch out.txt`
  - `ls && touch out.txt`
  - `git status && rm -rf x`
  - `Get-Content package.json; Set-Content out.txt`
  - ``cat package.json `touch out.txt` ``
  - `cat package.json $(touch out.txt)`

## 判断

- 反馈成立：当前 plan-mode bash 规则仍允许 `cat *`、`ls *`、`git status *`、`Get-Content *` 这类宽 read pattern，完整命令字符串以这些 pattern 开头时，右侧写入/删除命令仍可能被放行。
- 当前 PR 目标是默认只读，不适合在本轮引入完整 shell parser。

## 执行计划

1. 在目标测试中补充 `;`、`&&`、反引号、`$()` 负向用例。
2. 运行目标测试确认 RED。
3. 在 plan agent bash 权限中增加保守 deny pattern。
4. 复跑目标测试、文件级 agent 测试、`git diff --check` 和 typecheck。
5. 提交推送到现有 PR 分支。
6. 回复 PR 评论并更新本地记录。

## 取舍

- 保守拒绝 shell control/substitution token，优先保证 plan mode 只读边界。
- 这可能拒绝少量理论上只读的组合命令；若维护者要求精细支持，应单独设计结构化 shell 解析。
