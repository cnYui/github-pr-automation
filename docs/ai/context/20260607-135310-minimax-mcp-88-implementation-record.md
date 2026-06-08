# MiniMax-MCP #88 实现记录

## 范围

- 目标仓库：`MiniMax-AI/MiniMax-MCP`
- 目标 issue：`https://github.com/MiniMax-AI/MiniMax-MCP/issues/88`
- 实际工作目录：`D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\MiniMax-MCP-88-restart`
- 本地分支：`codex/fix-text-to-audio-empty-text-error`
- 隔离原因：建议目录 `work\MiniMax-MCP-88` 已有旧 agent 未提交改动，本轮没有触碰该目录。

## 根因

`minimax_mcp/server.py` 中 `text_to_audio` 的 `if not text: raise MinimaxRequestError("Text is required.")` 位于现有 `try/except MinimaxAPIError` 之前，导致空文本输入直接外抛实现细节异常；同文件其他工具把输入校验放在 `try` 内，会统一返回 `TextContent` 错误消息。

## RED

新增测试：

- `tests/test_server.py::test_text_to_audio_returns_text_content_for_empty_text`

命令：

```powershell
uv run pytest tests/test_server.py::test_text_to_audio_returns_text_content_for_empty_text -q
```

失败证据：

```text
FAILED tests/test_server.py::test_text_to_audio_returns_text_content_for_empty_text
E minimax_mcp.exceptions.MinimaxRequestError: Text is required.
minimax_mcp\server.py:91: MinimaxRequestError
```

说明：第一次直接用全局 Python 跑测试时缺少 `fuzzywuzzy`，属于环境依赖问题；执行 `uv sync --extra dev` 后重跑同一目标测试，得到上述行为级 RED。

## GREEN

实现：

- 只把 `text_to_audio` 的空 `text` 校验移动到现有 `try` 内。
- 不改变错误消息、不扩展捕获类型、不重构其他工具。

目标测试：

```powershell
.\.venv\Scripts\python.exe -m pytest tests/test_server.py::test_text_to_audio_returns_text_content_for_empty_text -q
```

结果：

```text
1 passed in 1.15s
```

完整测试：

```powershell
.\.venv\Scripts\python.exe -m pytest -q
```

结果：

```text
7 passed in 1.24s
```

新增测试 lint：

```powershell
.\.venv\Scripts\ruff.exe check tests/test_server.py
```

结果：退出码 0，无输出。

## 额外检查

- `uv sync --extra dev` 会把旧 `uv.lock` 升级到 revision 3；已恢复 `uv.lock`，最终外部仓库状态只剩：

```text
 M minimax_mcp/server.py
?? tests/test_server.py
```

- `uv run ruff check minimax_mcp/server.py tests/test_server.py` 失败，原因是 `server.py` 既有 37 个 lint 问题，包括 star import、未用 `Path`、现有 f-string 无 placeholder；本轮不处理这些既有问题，避免无关重构。

## 剩余风险

- 未推送、未创建 PR，符合本轮要求。
- 没有基于 PR #87 的 coverage 分支修改测试；当前测试直接加在 upstream `main` 基线。
- `server.py` 仍有既有 lint 债务，后续如仓库 CI 强制 ruff，需要单独决定是否提交清理 PR。
