# KrakenNet/fathom PR #172 提交记录

## 结果

- PR：https://github.com/KrakenNet/fathom/pull/172
- issue：Fixes `KrakenNet/fathom#114`
- 分支：`cnYui:codex/fix-stale-cli-command-comments`
- commit：`80b970850b904afaa36db3f9d784f9c3ffe6c444`
- PR 状态：open，非 draft，mergeable。

## 改动

只修改 text-only 内容：

- `tests/test_cli.py`
  - 修正顶部模块 docstring，不再声称覆盖 `6 subcommands`。
  - 明确当前测试文件覆盖 `--version`、`validate`、`compile`、`info`、`test`、`bench`、`repl`。
- `scripts/generate_cli_docs.py`
  - 修正 `commands = sorted(...)` 上方注释。
  - 说明显式命名的 `verify-artifact`、`verify-chain` 依赖 `cmd.name`，裸 `@app.command()` 注册的单词命令 fallback 到 callback `__name__`。

未修改：

- CLI 注册逻辑。
- docs 生成逻辑。
- `src/fathom/cli.py`。
- 生成文档。

## 本地验证

RED：

```bash
rg -n "6 subcommands|six commands" tests/test_cli.py scripts/generate_cli_docs.py
```

修改前命中：

- `tests/test_cli.py:3`
- `scripts/generate_cli_docs.py:133`

GREEN：

```bash
rg -n "6 subcommands|six commands" tests/test_cli.py scripts/generate_cli_docs.py
```

修改后无命中。

测试：

```bash
uv run pytest tests/test_cli.py tests/test_scripts/test_cli_docs_real.py
```

结果：`33 passed in 4.31s`。

diff 检查：

```bash
git diff --check
```

结果：exit code 0；仅出现 Windows `autocrlf` 行尾转换提示，无 whitespace error。

## 远端检查

PR 创建后即时 checks：

- `DCO`：pass
- `label`：pass
- `validate`：pass
- `dependabot`：skipping

## 备注

首次运行目标 pytest 时失败于 `ModuleNotFoundError: No module named 'cryptography'`。根因是普通 `uv run` 未安装 optional dependencies；仓库 `CONTRIBUTING.md` 明确要求 `uv sync --all-extras`。执行后安装 `cryptography==48.0.1`，同一测试命令通过。
