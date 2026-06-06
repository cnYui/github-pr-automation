# hermes-agent PR 切入记录

## 背景

- 用户点名目标仓库：`NousResearch/hermes-agent`。
- 目标：寻找一个低风险 PR 切入点，按 TDD 实现，跑端到端测试，并提交到上游 PR。
- 本地目标仓库主 checkout：`/Users/wujianxiang/CodeSpace/hermes-agent`。
- 为避免影响主 checkout 的本地改动，已使用隔离 worktree：
  `/Users/wujianxiang/.config/superpowers/worktrees/hermes-agent/hermes-pr-candidate`。
- 隔离分支：`codex/hermes-pr-candidate`，基于 `origin/main`，初始状态干净。

## 主 checkout 风险

主 checkout 存在用户或既有本地改动，不能直接修改：

- `AGENTS.md`
- `run_agent.py`
- `tests/run_agent/test_provider_parity.py`
- `tests/run_agent/test_streaming.py`
- 未跟踪：`docs/ai/`

后续所有 hermes-agent 实现应继续在隔离 worktree 中完成。

## 已排除方向

多个初看合适的问题已有开放 PR 或当前 `main` 已不复现，暂不建议重复提交：

- `kanban_create` notifier profile / auto-subscribe：#39738 仍 open，但已有 #33676、#35903 等开放 PR 处理工具创建任务后的网关订阅路径；当前 `tools/kanban_tools.py` 的 `_handle_create` 也已不含 issue 描述中的 `add_notify_sub` 调用。
- `read_file` 空路径报错：#31791 已有直接开放 PR #31801。
- `hermes doctor` disabled toolsets missing-key summary：#11336 已有 #11338、#11361、#11648 等开放 PR。
- `fact_store list` SQL 参数顺序：#28055 描述的问题在当前 `main` 已不复现，`list_facts` 现在只绑定 `LIMIT ?`。
- `MEDIA:` `.md` 附件：#37318 已有多组开放 PR，且已有评论验证当前 `main` 能识别 `.md`。
- Discord `create_thread` 丢 `message` 参数：#37658 已有直接开放 PR #37666。
- PyPI 缺 `locales/`：#39105 已有直接开放 PR #39151。
- `session_search` auxiliary task slot：#39078 已有开放 PR #33371，且 issue 评论中已有贡献者认领前端移除方向。
- `setup.py` 缺失数据目录容错：#36619 已有开放 PR #36660、#37131。
- Desktop 启动需手动 reload MCP：#38271 被维护者标为 #37589 重复，已有 #38301。

## 推荐切入点

推荐选择 #36289：`Improve test coverage: acp_adapter/__main__.py`。

理由：

- 当前没有开放 PR。
- 文件只有入口委托逻辑：
  `acp_adapter/__main__.py` 从 `acp_adapter.entry` 导入 `main` 并调用。
- 目标明确：把该模块覆盖率从 0% 提升到 >= 70%。
- 可做成 test-only PR，不改生产行为，冲突和回归风险低。

## 设计草案

1. 新增一个测试，使用 `runpy.run_module("acp_adapter.__main__", run_name="__main__")` 执行模块入口。
2. 在执行前用 `monkeypatch` 替换 `acp_adapter.entry.main`，断言 `python -m acp_adapter` 会委托调用它。
3. 先运行新增测试确认 RED；然后只调整测试或必要的测试隔离代码，不修改生产逻辑。
4. 验证命令：
   - `python -m pytest tests/acp/test_entry.py -q`
   - `python -m pytest tests/acp -q`
   - `python -m pytest tests/e2e/ -v --tb=short`
   - 覆盖率可用时运行针对 `acp_adapter/__main__.py` 的 coverage 命令。

## 当前状态

尚未在 `hermes-agent` 实现。按 brainstorming/TDD 流程，已向用户提出设计草案并等待确认。

