# getzep/graphiti NeptuneDriver PR 实施计划

> 本计划按 TDD 执行。先写失败测试，确认失败原因符合预期，再修改生产代码。

## 目标

为 `getzep/graphiti` 提交一个聚焦 PR，修复 issue #1529 中 `NeptuneDriver` 的参数转发和 AOSS bulk action 形状问题。

## 文件

- 修改：`work/graphiti/graphiti_core/driver/neptune_driver.py`
- 新增或修改：`work/graphiti/tests/driver/test_neptune_driver.py`
- 新增：`docs/ai/context/20260606-152213-graphiti-neptune-driver-pr-design.md`
- 新增：`docs/ai/context/20260606-152213-graphiti-neptune-driver-pr-plan.md`
- 修改：`AGENTS.md`

## 步骤

1. 准备目标仓库
   - 克隆 `getzep/graphiti` 到 `work/graphiti`。
   - fork 或确认 `cnYui/graphiti` 可推送。
   - 创建分支 `codex/neptune-driver-contract`.

2. 建立测试入口
   - 检查现有 `tests/driver` 结构。
   - 新建 `tests/driver/test_neptune_driver.py`，使用 `NeptuneDriver.__new__(NeptuneDriver)` 避免真实 AWS 客户端初始化。

3. RED：写参数展平失败测试
   - 构造 mock driver：
     - `driver.client.query = Mock(return_value=[])`
   - 调用 `await NeptuneDriver.execute_query(driver, "RETURN $id", params={"id": "edge-1"}, routing_="r")`
   - 断言 `client.query` 收到 `params={"id": "edge-1"}`，且没有 `routing_`、没有嵌套 `params`。
   - 预期旧代码失败，因为会传 `{"params": {"id": "edge-1"}, "routing_": "r"}`。

4. GREEN：实现最小参数归一化
   - 在 `execute_query()` 中集中构造参数：
     - `params = dict(kwargs.pop("params", {}) or {})`
     - `params.update(kwargs)`
     - `params.pop("routing_", None)`
   - 列表查询路径保持原行为，但同样经过参数归一化。

5. RED：写 AOSS bulk action 失败测试
   - monkeypatch `graphiti_core.driver.neptune_driver.helpers.bulk`
   - 调用 `driver.save_to_aoss("edge_name_and_fact", [{"uuid": "u1", "name": "n", "fact": "f", "ignored": "x"}])`
   - 断言 action 中没有 `_id`，有 `_index`、`uuid`、`name`、`fact`。
   - 预期旧代码失败，因为 action 包含 `_id`。

6. GREEN：修改 `save_to_aoss()`
   - 删除 `'_id': d['uuid']`。
   - 保留映射字段中的 `uuid`。
   - 不改变返回值和索引匹配逻辑。

7. 检查 `_database` 兼容
   - 读取 `Graphiti.add_episode` 和 `add_episode_bulk` 调用。
   - 如果 NeptuneDriver 未设置 `_database` 会导致 `group_id` 路径直接崩溃，则新增：
     - `database: str = ""` 构造参数，默认与 provider 默认 group id 对齐。
     - `self._database = database`
     - `clone(database)` 复用同一 client/aoss_client 的浅拷贝或最小复制。
   - 对应写测试，确保 `clone(database="g1")._database == "g1"` 且复用客户端。

8. 运行目标测试和格式检查
   - `uv run --extra dev pytest tests/driver/test_neptune_driver.py -q`
   - `uv run --extra dev ruff format --check graphiti_core/driver/neptune_driver.py tests/driver/test_neptune_driver.py`
   - `uv run --extra dev ruff check graphiti_core/driver/neptune_driver.py tests/driver/test_neptune_driver.py`
   - `uv run --extra dev pyright graphiti_core/driver/neptune_driver.py`

9. 提交和 PR
   - commit message：`fix: normalize neptune driver query params`
   - push 到 `cnYui/graphiti` 分支。
   - PR 标题：`fix: normalize NeptuneDriver params and AOSS bulk actions`
   - PR body 说明关联 #1529、测试命令、非目标范围。

## 风险控制

- 如果依赖安装耗时或失败，优先使用可运行的 `python -m pytest`/`uv run pytest` 子集验证。
- 如果 `pyright` 因仓库既有问题失败，记录具体错误并说明本次相关测试已通过。
- 不触碰与开放 PR 重叠的社区检测、MCP 配置、BM25 多 group 过滤等代码。
