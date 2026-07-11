# MCPJungle #247 PR 提交记录

## 结果

- 上游仓库：`mcpjungle/MCPJungle`
- Issue：`#247`
- PR：`https://github.com/mcpjungle/MCPJungle/pull/274`
- 分支：`cnYui:codex/add-cli-config-validation`
- Commit：`a012583186d2e3d45680c5297842a23e2bd48882`
- 状态：PR open，非 draft，mergeable 为 `MERGEABLE`
- 初始 checks：`statusCheckRollup=[]`，`gh pr checks` 返回 no checks reported

## 改动

- 新增 `mcpjungle validate <file>` 顶层 CLI 命令。
- 新增 `internal/service/configvalidation` 纯 Go 静态验证服务，覆盖 MCP server、tool group、MCP client、user 四类 JSON config。
- 支持 `--type mcp-server|tool-group|mcp-client|user` 处理无法可靠推断的文件。
- 更新 `docs/reference/config-file.mdx`，让配置验证入口可发现。

## 验证

- `go test ./internal/service/configvalidation -count=1`：通过。
- `go test ./cmd -run 'TestValidate|TestRunValidateConfig' -count=1`：通过。
- `go run . validate <temp-json>`：通过，输出检测到 `mcp-server`。
- `git diff --cached --check`：通过。

## 本地验证限制

- `go test -cover ./...` 在 Windows 本机未通过：
  - 默认 `CGO_ENABLED=0` 时，多个使用 `go-sqlite3` 的包报 `go-sqlite3 requires cgo to work`。
  - `CGO_ENABLED=1` 时，本机缺少 `gcc`。
  - 同次运行还出现既有 Windows/环境敏感失败：`cmd/export_test.go` 权限用例和 `cmd/config/config_test.go` HOME 状态串扰。
- `bash scripts/test-mcpjungle.sh` 未进入测试逻辑，脚本因 CRLF 在 Bash 下报 `set: pipefail\r: invalid option name`。

## 边界

- 本 PR 是静态 MVP：不连接真实 MCP server，不检查数据库内实体是否存在，不接入 POST / PUT handler。
- 验证服务放在 `internal/service/configvalidation`，后续 API/frontend 可复用。
