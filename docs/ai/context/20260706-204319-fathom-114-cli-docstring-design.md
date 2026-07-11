# KrakenNet/fathom#114 PR 设计文档

## 目标

为 `KrakenNet/fathom#114` 提交一个 text-only PR，修正 Fathom CLI 测试 docstring 和 CLI 文档生成脚本注释中已经过期的“6 commands”描述。

## 当前状态

- issue：https://github.com/KrakenNet/fathom/issues/114
- 当前状态：open。
- open PR 去重：
  - `#157 docs: include ssvc in shipped rule packs`
  - `#154 chore(deps): security bump (fathom)`
- 结论：没有发现同向 open PR。

## 真正问题

Fathom CLI 当前注册 9 个命令，但两个说明文字仍写成 6 个命令。问题不在 CLI 行为，也不在文档生成逻辑，而是维护性文字已经落后于真实命令集合。

## 最小 PR 边界

必须做：

- 修改 `tests/test_cli.py` 顶部模块 docstring。
- 修改 `scripts/generate_cli_docs.py` 中 `commands = sorted(...)` 上方注释。
- 保持逻辑完全不变。

不做：

- 不新增 CLI 命令测试。
- 不改 `src/fathom/cli.py`。
- 不重生成 CLI reference 文档，除非测试要求。
- 不顺手调整格式、lint、导入顺序。

## 设计

`tests/test_cli.py` 的 docstring 不应再声称覆盖所有子命令。它应该精确说明当前测试文件覆盖 `--version`、`validate`、`compile`、`info`、`test`、`bench`、`repl`，并避免把未覆盖的 `status`、`verify-artifact`、`verify-chain` 写进覆盖范围。

`scripts/generate_cli_docs.py` 的注释应解释现有 fallback 的真实原因：显式命名的 Typer command 使用 `cmd.name`，裸 `@app.command()` 注册的单词命令才从 callback `__name__` 推导。这样能解释 `verify-artifact`、`verify-chain` 这类 hyphenated 命令为什么依赖 `cmd.name`。

## 预期改动文件

- `tests/test_cli.py`
  - 只改模块 docstring。
- `scripts/generate_cli_docs.py`
  - 只改注释块。

## 验证设计

搜索式验证：

- 修改前应能搜到过期描述：
  - `rg -n "6 subcommands|six commands" tests/test_cli.py scripts/generate_cli_docs.py`
- 修改后该命令应无命中。

测试验证：

- `uv run pytest tests/test_cli.py tests/test_scripts/test_cli_docs_real.py`
- `git diff --check`

## 风险

- 风险低。改动只涉及注释和 docstring。
- 主要风险是把测试覆盖范围写大。设计上必须明确 `tests/test_cli.py` 目前不覆盖 `status`、`verify-artifact`、`verify-chain`。

## 建议 PR 信息

标题：

```text
docs: fix stale CLI command count comments
```

正文要点：

- 修正 CLI 测试 docstring 中过期的 6 commands 描述。
- 修正 CLI docs generator 注释，说明 `cmd.name` 与 callback `__name__` fallback。
- 说明没有逻辑改动。
- 附验证命令。
