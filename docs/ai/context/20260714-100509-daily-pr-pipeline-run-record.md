# 2026-07-14 每日 GitHub PR 机会流水线记录

## 运行结果

- 日期报告：`public/reports/2026-07-14.json`
- Run ID：`20260714000538-72a817`
- Lease ID：`2026-07-14T00:05:38.858Z-ab8bdc`
- 处理候选：2
- 创建 PR：2
- 结束状态：`completed`，已执行 `close`，当前 `pipeline status` 为 `null`
- 剩余队列：0；`next` 在第 2 个 PR 后返回 `limit_reached`

## 扫描与报告

- 扫描 CLI 不支持 `--help`，首次探测实际执行了扫描并按 UTC 覆盖 `2026-07-13` 报告。
- 已把机器结果保存到 `data/pipeline/input/2026-07-14-machine-scan.json`，并从未被覆盖的 `dist/reports/2026-07-13.json` 恢复历史报告。
- live 复筛后保留 8 个唯一仓库候选：2 个 `值得继续`、3 个 `谨慎`、3 个 `跳过`。
- `taxiway#52` 因开放 PR #62 精确覆盖跳过；`hound-mcp#95` 因维护者确认 PR #100 正在处理跳过；`world-cup-predictor#1` 因已有认领意向跳过。
- 日期报告、`latest.json` 与两份 `dist` 报告哈希一致；schema 解析通过，报告相关 4 个测试文件共 8 项通过。

## PR 结果

### willyfh/visualtorch #174

- PR：https://github.com/willyfh/visualtorch/pull/174
- Commit：`02b37c525079982fb85ef8de3337f8061f37e158`
- 改动：三个 animated reveal 示例显式展示 `frame_duration`、`final_hold_duration` 和 `loop`。
- 本地验证：三个示例脚本通过，`tests/test_animation.py` 41 项通过，适用的 pre-commit hooks、ruff、format、py_compile 与 diff check 通过。
- 直接 mypy 的 82 个 Pillow 类型错误在相同基线 SHA 完整复现，确认不是本次改动引入。
- 远端 checks：Read the Docs、pre-commit、pre-commit.ci、MCP、Python 3.10/3.12/3.14 与 previous Torch 全部通过。
- 当前状态：open、mergeable，等待人工 review。

### stellar/stellar-docs #2582

- PR：https://github.com/stellar/stellar-docs/pull/2582
- Commit：`c8c75b9ef2617e975b734784abb6249538820ba7`
- 改动：把无值的 `--network` 修正为 `--network testnet`。
- 本地验证：Corepack pnpm 11.6.0 frozen install、全仓 `check:mdx`、完整 Docusaurus build 和 diff check 通过。
- build 结果：Client/Server 编译成功，生成 936 routes 与 910 份 markdown source；build 后仍只有目标 MDX 的一行替换。
- 远端 checks：Socket Security Project Report 与 Pull Request Alerts 全部通过。
- 当前状态：open、mergeable，等待人工 review。

## 工具链记录

- visualtorch 全量 pre-commit 首次初始化被与 Python 文件无关的旧 prettier Node 环境卡住；改为逐项运行适用 hooks，远端 pre-commit 与 pre-commit.ci 后续均通过。
- stellar-docs 的 Husky 因本机旧 pnpm shim 无法切换到 11.6.0 而失败；已直接运行其唯一命令 `corepack pnpm check:mdx` 并通过，提交时仅跳过损坏的 shim 调用。
- 排查 pnpm 时误把 11.6.0 作为隔离 Node runtime 安装；已用原 pnpm 10 store 配置精确卸载，系统 Node 保持 `v24.11.0`，临时 shim 也已删除。

## 后续

- 两条 PR 均无需改代码或补 CI，等待维护者 review。
- 扫描器 UTC 日期和参数静默忽略问题仍未修复，后续应单独处理，避免再次覆盖历史日报。
