# cnYui PR 自动化自动修复流程更新

## 背景

用户要求 `cnyui-pr` automation 在检测到需要处理的代码反馈时，不再停在“上报待处理”，而是自动修复、验证、提交并推送到对应 PR。

## 修改内容

- 更新 `C:\Users\yui\.codex\automations\cnyui-pr\automation.toml` 的 prompt。
- 将原第 5 条“代码修改类反馈只上报”改为默认自动处理：
  - 先核验反馈是否技术上成立。
  - 在独立 `work` 目录检出现有 PR 分支。
  - 按 TDD 和最小改动修复。
  - 运行相关测试、build、lint 或 diff check。
  - 提交并推送到现有 PR 分支。
  - 在 PR 中简短回复改动和实际验证命令。
- 增加多问题并行规则：
  - 多个独立 PR 或独立代码问题必须拆成多个子 agent。
  - 子 agent 使用 `gpt-5.5`，`reasoning_effort=high`。
  - 每个 agent 负责一个 PR 或互不重叠的写入范围。
  - 主线程负责核验 live PR head、checks、comments 和最终状态。

## 保留边界

以下情况仍只上报，不自动处理：

- 需要用户账号操作、签署协议、付费授权、外部密钥或维护者权限。
- 产品方向决策、大范围重写或安全敏感且方案未确认的问题。
- 已有 work 目录不干净时，不覆盖未提交改动，改用新目录。

## 验证

- 使用 Python `tomllib` 解析 `automation.toml` 成功。
- 已确认配置仍为 `model = "gpt-5.5"`、`reasoning_effort = "high"`。
- 已确认 prompt 包含“默认自动处理”和“子 agent”规则。
