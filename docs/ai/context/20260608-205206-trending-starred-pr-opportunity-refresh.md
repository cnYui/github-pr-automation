# 2026-06-08 晚间 PR 机会刷新记录

## 背景

用户要求再看 GitHub 热门排行榜和当前仓库记录，筛出值得提交 PR 的项目。用户随后明确：本窗口只记录要提交的内容，不在当前窗口修改上游代码。

本轮只更新记录类内容：

- `public/reports/latest.json`
- `dist/reports/latest.json`
- 本上下文文档
- `AGENTS.md` 项目记忆

## 数据源

- GitHub Trending daily：`https://github.com/trending?since=daily`
- 当前项目历史报告：`public/reports/latest.json`
- GitHub issue / PR 查重：GitHub MCP `issue_read`、`search_pull_requests`、`search_code`
- 上游代码只读核对：GitHub MCP `get_file_contents`

## 筛选口径

- 优先选 open issue、无重复 open PR、可用小范围测试或文档 diff 证明的问题。
- 排除已经由 `cnYui` 当日提交过 PR 的前三个旧候选：`anthropics/skills#1281`、`ChatLab/ChatLab#210`、`coderamp-labs/gitingest#583`。
- 排除 issue 已被 main 修复或已有开放 PR 覆盖的方向。
- 仓库贡献流程会影响推荐级别：`turbovec` 技术切口很好，但 CONTRIBUTING 明确要求先 issue 讨论并申请 contributor access，不建议冷开 PR。

## 推荐记录

### 1. `Andyyyy64/whichllm#89`

- Issue：`https://github.com/Andyyyy64/whichllm/issues/89`
- 建议 PR 标题：`Fix GGUF benchmark lookup when base_model is missing`
- 推荐级别：值得继续
- 拟改范围：
  - `src/whichllm/models/benchmark.py`
  - `tests/test_benchmark_lookup.py`
- 提交内容：
  - 为社区 GGUF repo name 增加官方模型 ID 候选生成路径。
  - 覆盖 `unsloth/Qwen3.6-27B-GGUF -> Qwen/Qwen3.6-27B`。
  - 覆盖 `Qwen_Qwen3.6-35B-A3B-GGUF` 这类 underscore repo name。
  - 保留 `_params_compatible()` 参数规模 guard，避免 tiny draft/MTP head 继承大模型分数。
- 验证：
  - 先补 failing test，再实现。
  - 目标命令：`uv run pytest tests/test_benchmark_lookup.py`
  - 完整命令：`uv run pytest`

### 2. `Panniantong/Agent-Reach#304`

- Issue：`https://github.com/Panniantong/Agent-Reach/issues/304`
- 建议 PR 标题：`Document Windows python3 Store alias workaround`
- 推荐级别：值得继续
- 拟改范围：
  - `docs/install.md`
- 提交内容：
  - 在 Step 1 增加 Windows 专用提示：`python3` 可能是 Microsoft Store alias。
  - 建议优先使用 `py -3 -m venv ...` 或实际安装路径下的 `python.exe`。
  - 保持范围为文档修复，不承诺 installer 自动搜索 Python。
- 验证：
  - Markdown diff check。
  - 如果仓库有文档 lint，再跑对应命令。

### 3. `RyanCodrai/turbovec#88`

- Issue：`https://github.com/RyanCodrai/turbovec/issues/88`
- 建议 PR 标题：`Match Haystack default duplicate policy behavior`
- 推荐级别：谨慎
- 原因：代码低风险，但仓库 CONTRIBUTING 要求先 issue 讨论并申请 contributor access。
- 拟改范围：
  - `turbovec-python/python/turbovec/haystack.py`
  - `turbovec-python/tests/test_haystack.py`
- 提交内容：
  - 把 `DuplicatePolicy.NONE` 映射从 `FAIL` 改为 `OVERWRITE`。
  - 新增默认 `NONE` 重复写入覆盖的回归测试。
- 验证：
  - `pytest turbovec-python/tests/test_haystack.py`
  - 如果拿到 contributor access，再跑仓库建议的完整 Python/Rust 集成测试。

### 4. `RyanCodrai/turbovec#90`

- Issue：`https://github.com/RyanCodrai/turbovec/issues/90`
- 建议 PR 标题：`Reject intra-batch duplicate IDs in LangChain and Agno stores`
- 推荐级别：谨慎
- 原因：同样受 contributor access 流程限制，且范围比 #88 稍宽。
- 拟改范围：
  - `turbovec-python/python/turbovec/langchain.py`
  - `turbovec-python/python/turbovec/agno.py`
  - 对应 LangChain / Agno 测试文件
- 提交内容：
  - 在 LangChain `add_texts` / `add_documents` 写入前拒绝同批次重复 ID。
  - 在 Agno `insert` 里拒绝同批次派生后重复 ID。
  - 复用 `llama_index.py` 中已有的批内重复 guard 设计。
- 验证：
  - 对 LangChain 和 Agno 各补一个重复 ID 抛 `ValueError` 测试。
  - 跑对应 integration test。

### 5. `Andyyyy64/whichllm#93`

- Issue：`https://github.com/Andyyyy64/whichllm/issues/93`
- 建议 PR 标题：`Add Intel Arc Pro B70 GPU specs`
- 推荐级别：谨慎
- 拟改范围：
  - `src/whichllm/constants.py`
  - GPU 识别相关测试
- 提交内容：
  - 增加 `Arc Pro B70` 静态 GPU 识别。
  - 补 VRAM / memory bandwidth 数据。
  - 明确 PR 只解决 `--gpu "Arc Pro B70"` 静态识别，不承诺修复 Windows 实机枚举 shared memory。
- 风险：
  - 需要可靠硬件规格来源。
  - issue 同时包含 Windows 检测问题，可能比常量补充更宽。

### 6. `aaif-goose/goose#9532`

- Issue：`https://github.com/aaif-goose/goose/issues/9532`
- 建议 PR 标题：`Fix iOS tunneling settings tab copy`
- 推荐级别：谨慎
- 拟改范围：
  - 待定位 iOS/iPadOS 初始弹窗文案文件
- 提交内容：
  - 把 tunneling 指引中的 `App` tab 改成 `Session` tab。
  - 保持单文案修复，不改设置导航逻辑。
- 风险：
  - 当前代码搜索还没定位到精确文案源文件。
  - goose 要求 DCO signoff，提交时需要 `git commit -s`。

## 排除或降级记录

- `mvanhorn/last30days-skill#328/#395`：main 已有对应修复，issue 滞后。
- `refactoringhq/tolaria#826`：main 已有 Windows cmd shim 规避逻辑和测试，issue 滞后。
- `modelcontextprotocol/servers#4288`：已有开放 PR 覆盖。
- `upstash/context7#2527`：已有开放 PR 覆盖。
- `github/github-mcp-server#2636`：已有开放 PR 覆盖。
- `anthropics/claude-agent-sdk-python#966`：已有开放 PR 覆盖。
- `volcengine/MineContext#365`：已有开放 PR 覆盖。

## 当前结论

优先级：

1. 直接推进：`whichllm#89`
2. 直接推进：`Agent-Reach#304`
3. 先沟通再推进：`turbovec#88`
4. 先沟通再推进：`turbovec#90`

`whichllm#93` 和 `goose#9532` 先作为备选。前者需要补硬件规格来源，后者需要先定位文案文件。
