# agent-deck #1297 设计与计划

## 背景

- 目标仓库：`asheshgoplani/agent-deck`
- 目标 issue：`https://github.com/asheshgoplani/agent-deck/issues/1297`
- 需求：`agent-deck add` 无显式路径时，路径解析顺序从 `explicit path -> group DefaultPath -> cwd` 扩展为 `explicit path -> group DefaultPath -> global config default_path -> cwd`。
- 限制：不触碰 dashboard，不做 #1288 OpenCode MCP attach/detach，不做无关重构。

## 工作目录

- 建议目录 `work/agent-deck-1297` 的 `git clone` 超时后只残留 `.git`，未形成可用工作树。
- 后续 `work/agent-deck-1297-restart`、`work/agent-deck-1297-restart2` 也在 git 传输阶段超时。
- `work/agent-deck-1297-restart3` 使用截断 zip 解压，缺少 `internal/` 和 `go.mod`，不可用。
- 最终使用完整校验通过的 GitHub main 分支 zip 建立 `work/agent-deck-1297-restart4`，本地初始化 git，分支为 `codex/add-global-default-path`。
- 该目录不是完整远端 clone 历史，但源码来自 `main` 的 `9b88400a51658162a8684080a4401edc9af5b04f` archive，适合本地 TDD 和生成目标 diff。

## 根因

`cmd/agent-deck/main.go` 的 `handleAdd` 在无显式 path 时只读取 `groupTree.DefaultPathForGroup(sessionGroup)`，为空就直接 `os.Getwd()`。全局 JSON config 的 `internal/session.Config` 也没有 `DefaultPath` 字段，所以 `~/.agent-deck/config.json` 中无法表达机器级默认工作目录。

## 方案

采用最小扩展：

1. 在 `internal/session/config.go` 的 `Config` 增加 `DefaultPath string json:"default_path,omitempty"`。
2. 在 `cmd/agent-deck/cli_utils.go` 扩展 path resolution，新增可测试的小函数负责无显式路径时的候选顺序：group default、global default、cwd。
3. global default 使用现有 `resolveAddPath` 处理 `~`、环境变量和相对路径。
4. global default 解析后如果路径不存在或不是目录，只输出 warning 并回退 cwd，不硬失败。
5. 保持显式 path 的现有行为：显式 path 不存在仍由 `handleAdd` 后续校验硬失败。

## 取舍

- 不把 global default 做成 profile 级设置。issue 明确要求 global config，后续 per-profile 可以单独扩展。
- 不复用 `GroupTree.DefaultPathForGroup` 的 worktree repo root 归一化逻辑。issue 要求 global default 走现有 `resolveAddPath`，该函数当前负责 shell path 展开和绝对化。
- 不新增 CLI 命令管理 `default_path`。当前修复范围只覆盖 schema、add resolution 和必要文档。

## TDD 计划

### Task 1: 写 RED 测试

修改 `cmd/agent-deck/add_test.go`，新增三个最小测试：

- config `DefaultPath` 存在且目录有效时，无显式 path 使用 global default。
- group `DefaultPath` 与 config `DefaultPath` 同时存在时，group 优先。
- config `DefaultPath` 指向不存在路径时，输出 warning 并回退 cwd。

运行：

```powershell
go test ./cmd/agent-deck -run TestResolveAddPathFromDefaults -count=1
```

预期：编译或断言失败，因为 `Config.DefaultPath` 和默认解析函数尚不存在。

### Task 2: 最小实现

修改：

- `internal/session/config.go`
- `cmd/agent-deck/cli_utils.go`
- `cmd/agent-deck/main.go`

实现只做：

- schema 字段；
- 默认路径解析函数；
- `handleAdd` 中 group fallback 与 cwd fallback 之间插入 config default。

### Task 3: GREEN 验证

运行：

```powershell
go test ./cmd/agent-deck -run TestResolveAddPathFromDefaults -count=1
go test ./cmd/agent-deck -run 'TestResolveAddPath|TestResolveAddPathFromDefaults' -count=1
go test ./cmd/agent-deck -count=1
```

必要时追加：

```powershell
go test ./internal/session -run Test -count=1
```

## 风险

- 本地工作树来自 archive fallback，不是完整 clone 历史；最终不能直接 `git push`，需要用目标 diff 应用到正常 fork 后再推送。
- `cmd/agent-deck` 测试依赖 tmux 或环境时可能出现 Windows 环境限制；若全包测试失败，需要区分目标测试通过和环境性失败。
