# destructive_command_guard PR 机会复核

## 目标与边界

- 目标仓库：`Dicklesworthstone/destructive_command_guard`
- 本地目录：`D:\CodeWorkSpace\destructive_command_guard`
- 本轮只做发现、live 复核和报告，不修改候选仓库，不创建 PR。
- 复核基线：远端 `origin/main` 提交 `10552f492e2a02fa4bf88677446143ceb9add7eb`，本地 `main` 落后且存在用户未提交的 `AGENTS.md`、`docs/ai/` 内容，因此没有切换、合并或覆盖工作树。

## 贡献门禁

- README 明确说明维护者不直接合并外部贡献；外部 PR 主要用于展示可复现修复，维护者可能自行重做。
- `LICENSE` 含 OpenAI/Anthropic rider，明确排除相关主体及其代理的使用权。使用 AI 生成补丁提交存在明显合规不确定性，推进前应由用户自行确认是否接受该风险。
- 仓库唯一开放 PR 为 `#186 fix: enforce path-scoped allowlists`，以下候选均不与其重叠。

## 已排除方向

- Issue `#181` 至 `#184` 虽仍为 open，但最新 `main` 已直接实现修复，不能重复提交。
- Issue `#185` 的错误链接位于外部 Skill 仓库，本仓 `SKILL.md` 已使用正确地址。
- Cargo 仍为 `0.6.5`、CHANGELOG 已写 `0.6.6`，但版本合并会触发自动发布，属于维护者发布动作，不建议外部 PR 代做。
- Linux CI 的磁盘耗尽和 fuzz 依赖编译失败真实存在，但当前根因涉及流水线资源与上游 `fsqlite` 依赖组合，改动面和验证成本高，暂不作为首选。

## 候选 1：修复 Windows CLI help 断言的可执行文件名假设

- 推荐等级：值得继续，优先级最高。
- 证据：最新 Windows CI 中 `tests/test_command.rs` 的 3 个 help 测试稳定失败；断言硬编码 `Usage: dcg ...`，Windows Clap 输出通常包含 `dcg.exe`。
- 最小切口：只调整测试辅助或断言，统一归一化 `dcg.exe`/`dcg`，不要修改 CLI 生产输出。
- 预期文件：`tests/test_command.rs`，必要时复用现有测试 helper。
- 验证：目标 3 个测试、完整 `cargo nextest run --profile ci --no-fail-fast`，至少在 Windows 本机复跑目标测试。
- 风险：低。必须先捕获实际输出证明是 `.exe` 差异，而不是 Clap 行为回归。
- 去重：无同向开放 PR；`#186` 不涉及 help 测试。

## 候选 2：拆分并更新 CLI 版本审计

- 推荐等级：值得继续，但建议按工具拆为独立 PR。
- 证据：`cli-version-audit` 当前明确失败：Vault 最新 `2.0.3`、rclone `1.74.4`、GitHub CLI `2.96.0`，而 `docs/cli-versions.yaml` 仍停留在 2026-01-10 的旧版本族。
- 推荐顺序：先做 GitHub CLI，再做 rclone；Vault 2.0 是大版本升级，标为谨慎。
- 最小切口：审阅对应版本区间的上游 changelog，确认受保护命令和参数未改变；必要时补 pack 回归测试，再更新单个条目的 `tested_versions` 与 `last_verified`。
- 预期文件：`docs/cli-versions.yaml`、对应 `src/packs/**` 测试；不要在一个 PR 混合 3 个工具。
- 验证：对应 pack 单测、离线 `scripts/check_cli_versions.sh --offline` fixture、完整版本审计。
- 风险：GitHub CLI/rclone 为低到中；Vault 2.0 为中高，不能只改 YAML 让 CI 变绿。
- 去重：无同向开放 PR。

## 候选 3：升级安装时清理旧的 repo-local Copilot hook

- 推荐等级：值得继续。
- 证据：最新 `#182` 修复把 Copilot hook 迁到 `${COPILOT_HOME:-~/.copilot}/hooks/dcg.json`；提交说明明确记录已知缺口：升级安装不会移除旧 `<repo>/.github/hooks/dcg.json`，导致同一命令重复调用 dcg。卸载器已经具备同时清理新旧位置的逻辑。
- 最小切口：在 Unix 与 PowerShell 安装器完成 user-level hook 配置后，复用卸载器的字段级去重思路，只移除旧文件中的 dcg-owned 字段并保留其他 hook；不要直接删除整个文件。
- 预期文件：`install.sh`、`install.ps1`、两套 Copilot installer tests。
- 验证：旧文件仅含 dcg、旧文件含混合 hook、无 git repo、重复升级幂等、Unix Bats 与 PowerShell 目标测试。
- 风险：中。跨两套安装器，且涉及用户配置迁移，必须保证非 dcg hook 不丢失。
- 去重：无同向开放 PR；开放 `#186` 不重叠。

## 候选 4：重构 explanation 性能测试，避免把进程启动当作生成性能

- 推荐等级：谨慎。
- 证据：Windows CI 的 `test_explanation_generation_performance` 连续失败，当前测试循环启动 10 次 debug `dcg` 子进程，并以平均 500ms 判断“explanation generation”。实际测量包含 Windows 进程启动、配置发现、数据库和完整 CLI 路径，指标名与测量对象不一致。
- 根本方案：把核心 explanation 生成的纯函数/库路径作为微基准或单测；CLI 端只保留宽松的超时/不挂起验证。不要简单把 500ms 改成更大常数。
- 预期文件：`tests/test_explanations.rs`，必要时暴露已有内部函数供测试使用；避免生产重构扩散。
- 验证：目标测试在 Linux/Windows 均稳定，多次复跑；基准仍能捕获 explanation 本身的数量级回归。
- 风险：中。需要先确认可直接调用的核心函数，避免为了测试新增不必要公共 API。

## 建议推进顺序

1. Windows help 断言可移植性。
2. GitHub CLI 2.96 版本审计。
3. rclone 1.74 版本审计。
4. Copilot 旧 hook 升级清理。
5. explanation 性能测试重构。
6. Vault 2.0 仅在完成命令语义审计后推进。

## 最终判断

技术上存在多个可提交角度，但仓库贡献政策和 LICENSE rider 会显著降低实际合并概率与合规确定性。若继续，优先选择测试可移植性或单工具版本审计这种边界最小、证据最强的 PR，并在 live preflight 再确认默认分支和开放 PR 状态。
