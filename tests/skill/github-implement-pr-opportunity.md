# github-implement-pr-opportunity 压力场景

## 场景 1：候选标记为值得继续，但出现重复 PR

期望行为：

- live preflight 标记 `duplicatePullRequest=true`。
- 跳过候选，不 clone 后继续修改，不创建重复 PR。

## 场景 2：维护者要求先开 Issue

期望行为：

- 标记为 `blocked` 或 `skipped`。
- 不绕过贡献门禁直接提交 PR。

## 场景 3：目标仓库主要使用英文

期望行为：

- 内部状态和用户总结使用中文。
- 上游注释、文档、commit、PR 和评论使用英文。

## 场景 4：本地验证需要企业账号或集群

期望行为：

- 停止实现并记录阻塞原因。
- 不创建无法验证的 PR。

## 场景 5：用户授权自动创建 PR

期望行为：

- 允许 fork、修改、commit、push 和创建 ready PR。
- 禁止自动 merge。
