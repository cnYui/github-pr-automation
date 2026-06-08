# MiniMax-MCP #88 Restart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development and superpowers:verification-before-completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在独立后缀目录中修复 `MiniMax-AI/MiniMax-MCP#88`，让 `text_to_audio` 的空 `text` 输入像其他工具一样返回 `TextContent` 错误消息，而不是直接外抛 `MinimaxRequestError`。

**Architecture:** 根因是 `text_to_audio` 的本地参数校验位于 `try/except MinimaxAPIError` 外部，空文本会在进入统一错误返回路径前抛出异常。修复只移动或调整该校验到 `try` 内，复用现有 `except MinimaxAPIError` 分支，不新增错误处理框架。

**Tech Stack:** Python, pytest, MCP `TextContent`, MiniMax-MCP 现有服务函数。

---

## 背景与隔离决策

- 建议目录 `work/MiniMax-MCP-88` 已存在且有未提交改动：`minimax_mcp/server.py`、`tests/test_server.py`。
- 为避免覆盖上一轮 agent 工作，本轮使用 `work/MiniMax-MCP-88-restart`。
- 本轮只克隆 `MiniMax-AI/MiniMax-MCP`，创建本地分支 `codex/fix-text-to-audio-empty-text-error`，不推送、不创建 PR。
- 不修改 dashboard 项目文件；管理仓库仅新增本计划文档并追加 AGENTS 记忆。

## 文件范围

- Modify: `work/MiniMax-MCP-88-restart/minimax_mcp/server.py`
  - 职责：保留 `text_to_audio` 原有逻辑，仅让空文本校验进入现有 `try/except MinimaxAPIError` 返回路径。
- Test: `work/MiniMax-MCP-88-restart/tests/test_server.py` 或仓库现有相邻测试文件
  - 职责：最小覆盖 `text_to_audio(text="")` 返回 `TextContent` 错误消息，不外抛异常。

## TDD 计划

### Task 1: 准备独立工作目录

- [ ] 克隆仓库：

```powershell
git clone https://github.com/MiniMax-AI/MiniMax-MCP.git D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\MiniMax-MCP-88-restart
```

- [ ] 创建本地分支：

```powershell
git -C D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\MiniMax-MCP-88-restart switch -c codex/fix-text-to-audio-empty-text-error
```

- [ ] 检查测试工具和现有测试结构：

```powershell
Get-ChildItem -Force D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\MiniMax-MCP-88-restart
Get-ChildItem -Recurse -Filter '*test*.py' D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\MiniMax-MCP-88-restart\tests
```

### Task 2: RED 测试

- [ ] 阅读 `minimax_mcp/server.py` 中 `text_to_audio` 和其他工具的错误处理模式。
- [ ] 新增或调整一个最小 pytest，用真实函数调用证明空文本期望返回 `TextContent`：

```python
@pytest.mark.asyncio
async def test_text_to_audio_returns_text_content_for_empty_text():
    result = await text_to_audio(text="", voice_id="male-qn-qingse")

    assert len(result) == 1
    assert isinstance(result[0], TextContent)
    assert "text parameter cannot be empty" in result[0].text
```

- [ ] 运行目标测试，记录 RED：

```powershell
python -m pytest tests/test_server.py::test_text_to_audio_returns_text_content_for_empty_text -q
```

Expected: FAIL，失败原因为 `MinimaxRequestError: text parameter cannot be empty` 直接外抛，而不是返回 `TextContent`。

### Task 3: GREEN 实现

- [ ] 只移动或调整 `text_to_audio` 内空文本校验，使它位于现有 `try` 内。
- [ ] 不改变错误消息、不扩展捕获类型、不重构其他工具。
- [ ] 运行目标测试：

```powershell
python -m pytest tests/test_server.py::test_text_to_audio_returns_text_content_for_empty_text -q
```

Expected: PASS。

- [ ] 运行相关测试文件或仓库可承受的最小测试集：

```powershell
python -m pytest tests/test_server.py -q
```

Expected: PASS。

### Task 4: 收尾验证

- [ ] 查看差异，确认只包含目标测试和 `minimax_mcp/server.py`：

```powershell
git -C D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\MiniMax-MCP-88-restart diff --stat
git -C D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\MiniMax-MCP-88-restart diff -- minimax_mcp/server.py tests/test_server.py
```

- [ ] 记录最终状态：

```powershell
git -C D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\MiniMax-MCP-88-restart status --short
git -C D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\MiniMax-MCP-88-restart branch --show-current
```

## 风险

- 如果仓库测试依赖未安装，需要先按 `pyproject.toml` 使用本地虚拟环境或 `uv` 安装测试依赖。
- 如果 `tests/test_server.py` 已存在不同结构，优先复用现有 fixtures，避免引入大范围测试重排。
- 不处理 open PR #87 的 coverage 范围，也不改变 MiniMax API 请求语义。
