# MCPJungle #247 配置验证入口计划

## 背景

- 上游 issue：`mcpjungle/MCPJungle#247`，当前仍 open。
- 查重：open PR 中没有覆盖 `mcpjungle validate <file>` 的实现；旧的 config sync PR 关注目录同步，不是手动验证入口。
- 工作目录：`D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\MCPJungle-247`。
- 分支：`codex/add-cli-config-validation`。

## 设计

- 新增一个纯 Go 的配置验证服务，放在上游仓库的 `internal/service/configvalidation`。
- CLI 新增顶层命令 `mcpjungle validate <file>`，只做本地静态验证，不连接正在运行的 MCPJungle server。
- 验证器读取 JSON、执行现有环境变量占位符解析，并根据字段推断配置类型。
- MVP 覆盖当前文档已有的四类 JSON 配置：
  - MCP server：`mcpjungle register -c <file>`
  - Tool group：`mcpjungle create group -c <file>`
  - MCP client：`mcpjungle create mcp-client -c <file>`
  - User：`mcpjungle create user -c <file>`

## 边界

- 不实现数据库态校验，例如 server/client/group/user 名称是否已存在。
- 不验证真实 MCP server 是否可连接或能初始化。
- Tool group 只做静态结构校验，不检查工具名是否存在。
- 不一次性改造 POST / PUT 路径；验证服务保持可复用，后续可接入 API handler。

## TDD 计划

1. 新增 `cmd/validate_test.go`，先断言根命令存在 `validate` 子命令，并且 `runValidateConfig` 对合法 server config 输出成功。
2. 新增 `internal/service/configvalidation` 的失败测试，覆盖合法 server、非法 server URL、合法 group、合法 client、合法 user、未知配置类型。
3. 运行目标测试确认 RED。
4. 实现验证服务和 CLI 命令的最小代码。
5. 更新 docs config-file 页面，让入口可发现。
6. 运行目标测试、`git diff --check`，能跑则补 `go test -cover ./...` 和 `./scripts/test-mcpjungle.sh`。
