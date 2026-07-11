# CLIProxyAPI PR #3802 Review Follow-up Record

## 结果

- 上游 PR：`router-for-me/CLIProxyAPI#3802`
- 工作目录：`work/CLIProxyAPI-3802-fix`
- 分支：`codex/deepseek-rmb-usage`
- 起始 head：`4e3dc295abd80f10e3eb01be72c588395e31540e`
- 推送后 head：`4f7519e362139e3bb3f3cb37732ca8f8a94f9e0c`
- PR 回复：`https://github.com/router-for-me/CLIProxyAPI/pull/3802#issuecomment-4678114561`

## 改动

- `internal/runtime/executor/helps/usage_helpers.go`
  - 将 `InputTokens = cache hit + miss` 的推导放到 cached token details 解析之后，避免 cached-only usage 仍保持 0。
- `internal/runtime/executor/helps/usage_helpers_test.go`
  - 新增 cached-only `prompt_tokens_details.cached_tokens` 回归测试。
- `internal/redisqueue/plugin.go`
  - Redis payload 在存在 input cache stats 时防御性推导 `InputTokens`。
  - 仅当存在 input cache stats 时推导 `CacheMissInputTokens`，避免普通 `input_tokens` 被误统计为 100% cache miss。
- `internal/redisqueue/plugin_test.go`
  - 新增 cached-only Redis payload 推导测试。
  - 新增无 cache stats 时不合成 `cache_miss_input_tokens` 的测试。

## TDD 证据

新增测试后、实现前，目标测试按预期失败：

- `go test ./internal/runtime/executor/helps -run TestParseOpenAIUsageInfersInputFromCachedTokensDetails -count=1`
  - 失败：`input tokens = 0, want 11`
- `go test ./internal/redisqueue -run "TestUsageQueuePluginPayload(InfersInputFromCachedTokensOnly|DoesNotInferCacheMissWithoutCacheFields)" -count=1`
  - 失败：`tokens.input_tokens = 0, want 11`
  - 失败：`tokens.cache_miss_input_tokens = 42, want 0`

## 验证

- `go test ./internal/runtime/executor/helps ./internal/redisqueue -count=1`：通过。
- `go test ./... -count=1`：第一次全量运行 `internal/watcher` 的 `TestHandleEventConfigChangeSchedulesReload` 时序失败；该用例单独复跑通过，第二次全量运行通过。
- `go build ./...`：通过。
- `git diff --check`：通过；Windows 环境输出 CRLF 替换提示，无 whitespace error。

## 远端状态

已推送到 `cnYui/CLIProxyAPI` 的 `codex/deepseek-rmb-usage`。最终核对时 PR head 为 `4f7519e362139e3bb3f3cb37732ca8f8a94f9e0c`，远端 `close-when-agents-md-changed`、`build`、`ensure-no-translator-changes` 均为 `SUCCESS`。
