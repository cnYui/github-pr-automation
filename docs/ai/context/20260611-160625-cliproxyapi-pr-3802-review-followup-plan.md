# CLIProxyAPI PR #3802 Review Follow-up Plan

## 目标

处理 `router-for-me/CLIProxyAPI#3802` 的 3 条未解决 review 反馈，并推送到现有 `cnYui:codex/deepseek-rmb-usage` 分支，不新开 PR。

## 范围

- 修复 `internal/runtime/executor/helps/usage_helpers.go` 中 cached-only usage 时 `InputTokens` 未由 cache hit + miss 推导的问题。
- 修复 `internal/redisqueue/plugin.go` 中 Redis payload 在 `InputTokens == 0` 且 `CachedTokens > 0` 时未防御性推导 input tokens 的问题。
- 避免在没有 cache split/cache hit 数据时，把普通 `input_tokens` 合成为 `cache_miss_input_tokens`。

## 执行约束

- 独立工作目录优先使用 `work/CLIProxyAPI-3802-fix`；若目录已有未提交改动，另起后缀目录。
- 使用现有 PR 分支 `cnYui:codex/deepseek-rmb-usage`。
- TDD：先新增能失败的回归测试，再改实现。
- 不 revert 任何已有改动；遇到脏工作区先识别来源并保留。

## 测试计划

1. usage parser 回归：输入只有 `prompt_tokens_details.cached_tokens`，没有有效 `prompt_tokens` 时，输出 `InputTokens == CachedTokens`。
2. Redis payload 回归：`UsageTokens{InputTokens: 0, CachedTokens: N}` 写入 payload 时推导 `InputTokens == N`。
3. Redis payload 回归：只有普通 `InputTokens`、没有 cache hit/split 字段时，不写入或不合成 `cache_miss_input_tokens`。
4. 验证命令至少包含目标 Go 测试、`go build`、`git diff --check`；可行时运行 `go test ./...`。

## 预期交付

- 一个提交推送到现有 PR 分支。
- PR 简短回复，说明三类 token 推导修复和实际验证命令。
- 最终汇报提交 SHA、推送状态、验证结果和是否回复 PR。
