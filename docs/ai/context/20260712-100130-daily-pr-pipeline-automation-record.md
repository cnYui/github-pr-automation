# 每日 PR 机会流水线自动化创建记录

## 结果

- 自动化 ID：`github-pr`
- 名称：`每日 GitHub PR 机会流水线`
- 状态：`ACTIVE`
- 调度：每天日本时间 09:00
- 项目：`D:\CodeWorkSpace\github-pr-automation`
- 执行环境：固定本地项目
- 模型：`gpt-5.6-terra`
- 推理级别：`high`

## 流程

自动化会先恢复 `data/pipeline` 中的未完成运行；没有未完成运行时，调用扫描 Skill 生成具体日期报告，再由编排 Skill 执行 live preflight、最小实现、验证、commit、push 和 PR 创建。

每轮最多创建 `config/pipeline.json` 规定的 2 个 PR。创建前必须按 head 分支对账现有 PR，禁止重复创建和自动 merge。CLA、账号授权、付费服务、密钥、维护者权限、产品方向或高风险大改只记录 blocker。

## 与现有自动化的关系

- `github-pr`：每天发现并提交新的低风险 PR 机会。
- `cnyui-pr`：每 12 小时跟踪已有 open PR 的反馈、CI 和后续修复。

两者职责分离，共享主控仓库上下文，但不共享 cron 身份。

## 验证

- `npm run pipeline -- status` 返回 `null`，创建时没有未完成运行。
- 全量 Vitest：12 个测试文件、34 项测试通过。
- `npm run typecheck` 通过。
- 自动化配置已回读，名称、状态、频率、模型、项目目录和完整提示词均符合设计。

## 已知后续项

真实运行记录中的扫描 CLI、API 重试、报告不可变批次、lease heartbeat、跨阶段一致性校验和 Fork remote 兼容性仍需继续加固。当前先按每天一次、每轮最多 2 个 PR 的低频策略运行。
