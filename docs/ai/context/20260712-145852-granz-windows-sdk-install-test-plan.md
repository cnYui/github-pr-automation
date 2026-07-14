# granz Windows SDK 补装与完整测试计划

## 背景

`dmwyatt/granz#56` 的未修改基线在 Windows 执行 `cargo test test_command_exists_known` 时，链接器报 `LNK1181`，缺少 `DXCORE.lib`。当前系统只安装 Windows SDK `10.0.18362.0`；该版本早于 DXCore 开发库进入 Windows SDK 的版本。

## 目标

为现有 Visual Studio C++ 工具链补装包含 `DXCORE.lib` 的 Windows 11 SDK，然后在不修改候选仓代码的情况下重新执行目标测试与完整质量检查。

## 执行步骤

1. 查询 Visual Studio Installer 组件目录，确认 Windows 11 SDK 组件 ID。
2. 优先为当前 Rust 使用的 Visual Studio 2026 Community 安装 Windows 11 SDK `10.0.26100`；如果该产品不提供该组件，则为 VS 2022 Build Tools 安装等价 SDK，并确认 MSVC 环境可发现它。
3. 验证 `C:\Program Files (x86)\Windows Kits\10\Lib\<version>\um\x64\DXCORE.lib` 存在。
4. 重新打开开发环境并运行：
   - `cargo test test_command_exists_known`
   - `cargo test`
   - `cargo fmt --check`
   - `cargo clippy --all-targets --all-features -- -D warnings`
   - `git diff --check`
5. 若测试暴露真实代码失败，再按独立设计与 TDD 流程处理；本计划不预先修改候选仓代码。

## 边界

- 不卸载或替换现有 Visual Studio、MSVC 或旧 Windows SDK。
- 不启用需要外部密钥、账号或付费服务的验证。
- 安装命令使用被动/静默模式并禁止自动重启。
- 保留候选仓工作区现有状态，不清理或覆盖文件。
