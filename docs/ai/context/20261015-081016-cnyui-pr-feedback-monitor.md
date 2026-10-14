# cnYui PR 反馈巡检

- 运行时间：2026-10-15 08:10:16，Asia/Tokyo。
- GitHub 基线：2026-10-14T02:59:33.848Z（本次自动化上次运行时间）。
- 认证：`gh auth status` 确认当前账号为 `cnYui`，token scopes 包含 `repo`、`workflow`；未读取或回显 token。

## 账号级检查

- `gh search prs --author cnYui --state open --limit 100` 返回 51 个 open PR，search 无下一页。
- 使用 GraphQL 总览检查每个 PR 的最新 issue comment、review、review thread、head check/status。51 个 PR 的 head check contexts 均未分页截断；基线后新增 check/status 为 0。
- 最新事件只有两个 PR 的维护者 issue comment，均来自协作者 `juanitorduz`，且都在对应线程最后一条 cnYui 回复之前，属于真实新增反馈：
  - [pyro-ppl/numpyro#2343](https://github.com/pyro-ppl/numpyro/pull/2343)：要求将 `ZeroInflatedLogits`/`ZeroInflatedProbs` 加入 `docs/source/distributions.rst`，否则 docstring 不会渲染。
  - [pyro-ppl/numpyro#2346](https://github.com/pyro-ppl/numpyro/pull/2346)：要求修正 `MixtureSameFamily` variance 数学形式、无效 `:meth:` 链接、逗号拼接和多元 variance 语义。
- 旧快照（2026-10-13，53 个 open PR）中本轮消失的 3 个 PR 已 live 核实：`cnYui/jojo-pixel-game#1` 于 2026-10-13T18:20:50Z 合并，merge commit `e52e903d64b1d000b4b170206963655d8d36ccca`；`NEXUS99991/ai-builder-lab-miniprogram#88` 于 2026-10-13T07:34:47Z 合并，merge commit `3b16f503a1989aac2ca940c921f7fb2da3cb3ef5`；`NEXUS99991/ai-builder-lab-miniprogram#83` 于 2026-10-13T07:35:07Z 关闭，未合并。

## 自动处理

### NumPyro #2343

- 旧 head：`0c33c5022b5db41a27ca29a898a6081544bc45d4`。
- 新提交：`3c23867674e01fb06ca87e005a454d0b5f144f4a`。
- 修改：仅新增 `ZeroInflatedLogits` 与 `ZeroInflatedProbs` 的 `autoclass` 条目，包含 `members`、`undoc-members`、`show-inheritance`、`member-order: bysource`。
- 独立临时目录：`C:\Users\yui\AppData\Local\Temp\cnyui-numpyro-2343-30a2ac7c07794a72ae6899a303fc5819`。
- 已推送到原 PR 分支并回复：[评论](https://github.com/pyro-ppl/numpyro/pull/2343#issuecomment-6180462218)。
- 验证：针对两类的 Sphinx `-W` HTML 构建通过；`uv run ruff check numpyro/distributions/discrete.py`、`uv run ruff format --check numpyro/distributions/discrete.py`、`git diff --check` 通过。完整项目 Sphinx 构建因本机缺少 `pandoc` 在 README 转换阶段阻塞，未将其声称为通过。
- live 回读：PR 仍 `OPEN/MERGEABLE`，新 head 正确；benchmark、两个 lint 和 prek 当时为 pending，prek 已成功。

### NumPyro #2346

- 旧 head：`5d2b4fd91bd2b993b79e6c8e226c7982510ff074`。
- 新提交：`76d57b6f38da5a92ed79147747f205d8177091e5`。
- 修改：仅修改 `numpyro/distributions/mixtures.py` docstring，将 variance 改为代码使用的 law-of-total-variance 形式；将无效 `:meth:` 引用改为普通代码文本；修正逗号拼接；说明多元组件 mean/variance 为逐元素、variance 是逐维边际方差而非协方差矩阵；未扩大到可选 cdf/MixtureGeneral 事项。
- 独立临时目录：`C:\Users\yui\AppData\Local\Temp\cnyui-pr-monitor-63d0625fe46b4cedaeba1dcb70a96d05`。
- 已推送到原 PR 分支并回复：[评论](https://github.com/pyro-ppl/numpyro/pull/2346#issuecomment-6180504848)。
- 验证：`ruff check numpyro/distributions/mixtures.py`、`ruff format --check numpyro/distributions/mixtures.py`、`python -m compileall -q numpyro/distributions/mixtures.py`、`python -m pytest -q test/test_distributions_mixture.py`（47 passed）、docutils docstring parse/assertion、`git diff --check` 均通过。Sphinx 未安装，离线环境无法获取 pinned `funsor` git 源，未将 Sphinx 构建声称为通过。
- live 回读：PR 仍 `OPEN/MERGEABLE`，新 head 正确；benchmark、两个 lint 和 prek 当时为 pending，prek 已成功。

## 工作树与边界

- 主控仓工作树原有大量应用、报告和未跟踪文件改动；本轮未修改、未清理、未覆盖。
- 未执行自动 merge；未处理评论中的可选 follow-up；未读取或导出凭证。
- 本记录是本轮主控仓唯一新增文件，后续只定向暂存该文件提交；PR 修复均在独立临时目录完成。
