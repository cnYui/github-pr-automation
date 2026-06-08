# MiniMax-MCP PR #90 提交记录

## 目标

提交 `MiniMax-AI/MiniMax-MCP#88` 的修复：让 `text_to_audio` 空文本校验和其他 MCP tools 一样返回 `TextContent` 错误，而不是外抛 `MinimaxRequestError`。

## 工作目录

- 目录：`work/MiniMax-MCP-88-restart`
- 分支：`codex/fix-text-to-audio-empty-text-error`
- 上游：`MiniMax-AI/MiniMax-MCP`
- fork：`cnYui/MiniMax-MCP`

## 改动范围

- `minimax_mcp/server.py`
  - 将 `text_to_audio` 的 `if not text` 校验移入现有 `try` block。
- `tests/test_server.py`
  - 新增回归测试，断言空文本调用返回 `TextContent`，内容为 `Failed to generate audio: Text is required.`。

## 验证

提交前新鲜验证：

```powershell
.\.venv\Scripts\python.exe -m pytest -q
```

结果：`7 passed`

```powershell
.\.venv\Scripts\python.exe -m pytest --cov=minimax_mcp
```

结果：`7 passed`

```powershell
.\.venv\Scripts\ruff.exe check tests/test_server.py
```

结果：通过。

```powershell
git diff --check
```

结果：通过。

## 已知情况

- `ruff check .` 仍会报告仓库既有 lint 问题，包括当前 HEAD 版本 `server.py` 中已有的 star import/未用变量等；本 PR 不把既有 lint 债务塞入小 bug 修复。
- `bash scripts/test.sh` 在当前 Windows checkout 下因 CRLF 解析失败，未进入 pytest；已使用等价 pytest 命令验证。

## 提交与 PR

- Commit：`1f3279c fix: handle empty text_to_audio errors consistently`
- PR：[MiniMax-AI/MiniMax-MCP#90](https://github.com/MiniMax-AI/MiniMax-MCP/pull/90)
