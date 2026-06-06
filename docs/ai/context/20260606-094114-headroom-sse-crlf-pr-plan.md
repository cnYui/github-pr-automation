# headroom SSE CRLF PR 计划

## 目标

给 `chopratejas/headroom` 提交一个低风险、可验证的 PR：让代理的 SSE bytes 解析器同时支持 LF (`\n\n`) 和 CRLF (`\r\n\r\n`) 事件分隔符，避免合法 SSE 流无法被解析。

## 选题判断

- 已排除重复方向：
  - `perf --format json/csv` 已有 #648、#633、#598。
  - `headroom wrap claude` 模型路由已有 #627。
  - RTK hook PATH 问题已有认领和相关 PR。
  - Qdrant env 方向已有旧 PR #50。
- 选择 SSE CRLF 的原因：
  - SSE 协议允许 HTTP 栈使用 CRLF 行尾。
  - 当前 `parse_sse_events_from_byte_buffer` 只查找 `b"\n\n"`，遇到 `b"\r\n\r\n"` 会把完整事件长期留在 buffer 中。
  - 影响范围集中在 `headroom/proxy/helpers.py`，已有 `tests/test_sse_utf8_split.py` 可承接回归测试。

## 方案

推荐方案：在 bytes buffer 层识别最早出现的合法事件分隔符，支持 `\n\n` 与 `\r\n\r\n`。解析单个事件时用 `splitlines()` 处理 CRLF/LF 行尾，保持现有 `event:` 和多行 `data:` 语义。

备选方案：

1. 只把 buffer 中的 `\r\n` 预替换为 `\n`。实现最短，但会在完整事件抽取前改写 payload bytes，不符合当前“完整事件后再解码”的安全边界。
2. 继续只支持 LF，在文档里说明。不会修复合法 CRLF SSE 的解析问题，不推荐。

## 文件边界

- 修改 `work/headroom/tests/test_sse_utf8_split.py`：新增 CRLF 分隔符回归测试。
- 修改 `work/headroom/headroom/proxy/helpers.py`：抽取最早事件分隔符并用 `splitlines()` 解析行。
- 不修改核心 proxy 路由、不碰网络请求逻辑、不引入依赖。

## TDD 步骤

1. 在 `tests/test_sse_utf8_split.py` 新增测试：
   - 输入 `event: message\r\ndata: {"ok": true}\r\n\r\n`
   - 期望解析出 `[("message", "{\"ok\": true}")]`
   - 期望 buffer 被清空。
2. 运行：
   - `pytest tests/test_sse_utf8_split.py::test_crlf_terminated_event_is_parsed -q`
   - 期望失败，证明现有实现不能解析 CRLF。
3. 最小实现：
   - 用 helper 查找 `b"\n\n"` 和 `b"\r\n\r\n"` 中最早的完整分隔符。
   - 删除完整事件和对应分隔符。
   - 用 `event_text.splitlines()` 替代 `split("\n")`。
4. 验证：
   - `pytest tests/test_sse_utf8_split.py -q`
   - `pytest tests/test_streaming_usage_parser.py -q`
   - `ruff check headroom/proxy/helpers.py tests/test_sse_utf8_split.py`

## PR 信息

- 分支名：`codex/sse-crlf-events`
- commit：`fix(proxy): parse CRLF SSE event terminators`
- PR title：`[codex] fix(proxy): parse CRLF SSE event terminators`
- 风险：低。只影响完整 SSE 事件切分，保留 invalid UTF-8 loudly fail 的现有行为。
