# KrakenNet/fathom#114 PR 执行计划

## 背景

依据 `docs/ai/context/20260706-204319-fathom-114-cli-docstring-design.md` 推进 `KrakenNet/fathom#114`。

Live 核验结果：

- issue `#114` 当前仍为 open。
- open PR 只有 `#157 docs: include ssvc in shipped rule packs` 和 `#154 chore(deps): security bump (fathom)`。
- 未发现同向 open PR。
- 目标仓默认分支为 `main`。

## 目标

提交一个 text-only PR，修正 Fathom CLI 测试 docstring 和 CLI docs 生成脚本注释里过期的 `6 commands` 描述，不修改任何运行逻辑。

## 改动范围

必须修改：

- `tests/test_cli.py`
  - 顶部模块 docstring 不再写 `6 subcommands`。
  - 明确当前测试文件覆盖 `--version`、`validate`、`compile`、`info`、`test`、`bench`、`repl`。
  - 不把 `status`、`verify-artifact`、`verify-chain` 写成已覆盖。
- `scripts/generate_cli_docs.py`
  - `commands = sorted(...)` 上方注释不再写 `six commands`。
  - 说明显式命名的 hyphenated 命令依赖 `cmd.name`，单词命令才 fallback 到 callback `__name__`。

禁止修改：

- `src/fathom/cli.py`
- CLI 注册逻辑
- 文档生成逻辑
- 自动生成的 CLI reference 文档
- 与本 issue 无关的格式化、导入、依赖文件

## 文件结构

- 外部仓本地目录：`work/fathom-114`
- 分支：`codex/fix-stale-cli-command-comments`
- 预期改动文件：
  - `tests/test_cli.py`
  - `scripts/generate_cli_docs.py`

## 执行步骤

### 1. 准备仓库

- 克隆 `KrakenNet/fathom` 到 `work/fathom-114`。
- 创建分支 `codex/fix-stale-cli-command-comments`。
- 用 `rg -n "6 subcommands|six commands" tests/test_cli.py scripts/generate_cli_docs.py` 记录 RED：修改前应命中过期文本。

### 2. 最小文本修改

`tests/test_cli.py` 的 docstring 改成类似：

```python
"""
Tests for the Fathom CLI.

Covers the --version flag and the validate, compile, info, test, bench, and
repl subcommands.
"""
```

`scripts/generate_cli_docs.py` 的注释改成类似：

```python
# Typer stores explicit command names, such as verify-artifact and
# verify-chain, in cmd.name. Commands declared without an explicit name fall
# back to their callback __name__, which matches their rendered command name.
```

实际措辞以仓库原文件上下文为准，保持语义精确和最小 diff。

### 3. 验证

搜索式验证：

```bash
rg -n "6 subcommands|six commands" tests/test_cli.py scripts/generate_cli_docs.py
```

预期：无命中，命令 exit code 为 1。

测试验证：

```bash
uv run pytest tests/test_cli.py tests/test_scripts/test_cli_docs_real.py
```

预期：测试通过。

diff 验证：

```bash
git diff --check
git diff -- tests/test_cli.py scripts/generate_cli_docs.py
```

预期：无 whitespace error，diff 只包含 docstring 和注释。

### 4. 提交与 PR

- 只 stage `tests/test_cli.py` 和 `scripts/generate_cli_docs.py`。
- commit message：`docs: fix stale CLI command comments`
- push 到 `cnYui/fathom` 的同名分支。
- 对 `KrakenNet/fathom:main` 创建 PR。

PR 标题：

```text
docs: fix stale CLI command comments
```

PR 正文要点：

- Fixes `#114`。
- 修正 `tests/test_cli.py` 中过期的 `6 subcommands` 描述。
- 修正 CLI docs generator 注释，说明 `cmd.name` 与 callback `__name__` fallback。
- 明确没有逻辑改动。
- 列出本地验证命令。

## 风险控制

- 本任务为 text-only，TDD 的 RED 用过期文本搜索证明问题存在，GREEN 用同一搜索证明问题消失。
- 不扩大到测试覆盖补全；`status`、`verify-artifact`、`verify-chain` 不在本 PR 中补测。
- 如果目标测试因环境依赖失败，先记录完整失败输出，再判断是否需要安装依赖或降级为可复现阻塞，不直接声称通过。
