# 2026-06-08 两个子 Agent PR 提交记录

## 背景

用户要求开两个子 agent 并行执行两个已筛出的直接推进任务：

- `Andyyyy64/whichllm#89`：修 GGUF 缺 `base_model` 时 benchmark lookup。
- `Panniantong/Agent-Reach#304`：补 Windows `python3` Microsoft Store alias 安装文档。

本轮主线程只负责派发、核对和记录；上游代码改动分别在独立目录完成。

## 子 Agent 结果

### `Andyyyy64/whichllm#94`

- PR：`https://github.com/Andyyyy64/whichllm/pull/94`
- Issue：`https://github.com/Andyyyy64/whichllm/issues/89`
- 工作目录：`work/whichllm-89`
- 分支：`codex/fix-gguf-benchmark-lookup-without-base-model`
- commit：`2d5c24b20635f74e677fd55f04ed151fb6ca47a6`
- 作者：`cnYui <xiaobianfuai@gmail.com>`
- 改动文件：
  - `src/whichllm/models/benchmark.py`
  - `tests/test_benchmark_lookup.py`

提交内容：

- 增加社区 GGUF repo name 到官方 benchmark ID 的候选匹配。
- 支持 `unsloth/Qwen3.6-27B-GGUF` 命中 `Qwen/Qwen3.6-27B`。
- 支持 `Qwen_Qwen3.6-35B-A3B-GGUF` 这类 underscore repo name。
- 保留参数兼容 guard，防止小模型错误继承大模型分数。
- 补 self-reported 低优先级不被提前返回的回归测试。

验证：

- RED：`uv run pytest tests/test_benchmark_lookup.py`，新增用例 3 failed，复现无 `base_model` 时不能命中官方 benchmark。
- GREEN：`uv run pytest tests/test_benchmark_lookup.py`，`9 passed`。
- 全量：`uv run pytest`，`231 passed, 1 failed`。
- 全量失败项：`tests/test_utils.py::test_cache_dir_respects_xdg_cache_home`，worker 判断为 Windows 平台既有问题，与 benchmark lookup 改动无关。
- `git diff --check`：通过。

主线程核对：

- PR 为 open、非 draft、1 commit，head repo 为 `cnYui/whichllm`。
- 远端 changed files 为 2 个，符合预期范围。
- GitHub MCP 暂未返回 check runs。
- `mergeable_state=blocked`，当前更像是远端检查/权限状态未就绪，后续需要单独刷新。

### `Panniantong/Agent-Reach#325`

- PR：`https://github.com/Panniantong/Agent-Reach/pull/325`
- Issue：`https://github.com/Panniantong/Agent-Reach/issues/304`
- 工作目录：`work/Agent-Reach-304`
- 分支：`codex/document-windows-python3-store-alias`
- commit：`4a996a9cbcf0173041a23e4c4697b0d9e5ab257d`
- 作者：`cnYui <xiaobianfuai@gmail.com>`
- 改动文件：
  - `docs/install.md`

提交内容：

- 在安装指南 Step 1 附近增加 Windows / Microsoft Store Python alias 提示。
- 说明 `python3 --version` 打开 Microsoft Store 或 `where python3` 指向 `WindowsApps` 时，`python3` 不是可用安装。
- 提供 PowerShell 示例：
  - `py -3 -m venv $env:USERPROFILE\.agent-reach-venv`
  - `$env:USERPROFILE\.agent-reach-venv\Scripts\Activate.ps1`
  - `python -m pip install https://github.com/Panniantong/agent-reach/archive/main.zip`
- 范围保持为文档修复，没有新增 installer 自动搜索 Python 的承诺。

验证：

- `git grep -n --fixed-strings ... docs/install.md`：命中 `Microsoft Store`、`WindowsApps`、`py -3 -m venv`、`Activate.ps1`、`python -m pip install`、`python.exe`。
- `git diff --check HEAD~1 HEAD`：通过。
- 未跑文档 lint：仓库没有发现现成 markdown/doc lint 命令。

主线程核对：

- PR 为 open、非 draft、1 commit，head repo 为 `cnYui/Agent-Reach`。
- 远端 changed files 为 1 个，符合预期范围。
- GitHub MCP 暂未返回 check runs。
- `mergeable_state=unstable`，需要后续刷新 CI 或维护者反馈。

## 后续建议

- 先等 10-20 分钟刷新两个 PR 的 check 状态。
- 如果 `whichllm#94` full pytest 的 Windows 既有失败被维护者关注，只回复说明目标测试已过、失败项为 Windows 平台下 `XDG_CACHE_HOME` 语义差异。
- `Agent-Reach#325` 是文档 PR，若远端无 CI，可等待维护者 review。
