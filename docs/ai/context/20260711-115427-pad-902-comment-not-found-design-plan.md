# pad #902 comment not-found 设计与计划

## 背景与根因

- `PerpetualSoftware/pad#902` 当前仍为 open，未分配、无同向开放 PR，`main` 尚未实现。
- `GetItem`、`UpdateItem`、`DeleteItem` 已使用 `wrapItemNotFound`，把裸 `not_found` 补充为 item ref 与 workspace 上下文。
- `CreateComment` 直接返回 `c.post(...)` 的错误，因此 `pad item comment TASK-999999` 只显示 `Item not found`。

## 必须解决的问题

让 comment 路径复用既有 item not-found 契约，同时保持 APIError 的 code、details 和 concrete type 不变。

## 方案

- 只修改 `internal/cli/client.go` 的 `CreateComment`。
- 将 `c.post(...)` 返回错误交给 `wrapItemNotFound(err, itemSlug, wsSlug)`。
- 在 `internal/cli/item_notfound_test.go` 的既有 not-found 表达测试中增加 `CreateComment` 断言。
- 不把包装逻辑下沉到通用 `post`，避免把其他资源的 `not_found` 误标成 item 缺失。

## 贡献流程

- 按 `CONTRIBUTING.md` 先在 #902 留言认领，再创建独立 fork 分支。
- PR 保持单一 issue，正文使用 `Closes #902`。
- 不修改 server、store、Cobra、MCP、schema 或文档。

## 验证

```powershell
go test ./internal/cli -run 'Test(GetItemWrapsNotFound|NotFoundPreservesDetails|GetItemPassesThroughOtherErrors)$' -count=1
go test ./internal/cli/... ./cmd/pad/...
make build
make test
go vet ./...
make lint
git diff --check
```

Windows 上现有 HOME/credentials 测试及缺少 `web/build` embed 产物可能导致非目标失败；若出现，记录精确根因并以目标测试、可运行门禁和远端 CI 为准。

## 提交计划

- 分支：`codex/fix-comment-not-found-context`
- 提交：`fix(cli): wrap comment not-found errors`
- PR 目标：`PerpetualSoftware/pad:main`
