# getzep/graphiti NeptuneDriver PR 设计

## 背景

当前报告中 `getzep/graphiti` 的原始推荐切口是 `to_prompt_json` 遇到 `datetime` 属性时崩溃。核对 GitHub 当前状态后发现：

- issue #1526 已有开放 PR #1527 覆盖，继续提交会重复。
- 备选的 #1249、#402、#517、#893 也分别已有开放 PR 或大范围 PR 覆盖。
- issue #1529 仍未发现开放 PR 覆盖，且其中有可以用 mock 单元测试验证的小切片。

## 目标

提交一个低风险 PR，修复 `NeptuneDriver` 与 Graphiti 共享调用路径之间的最小契约不一致，避免真实 Neptune/AOSS 环境才暴露的参数形状问题。

## 范围

本轮只处理 #1529 中可独立验证的 driver 契约问题：

1. `NeptuneDriver.execute_query()` 支持调用方传入 `params={...}`，并将其展平为 Neptune openCypher 参数，而不是嵌套成 `{"params": {...}}`。
2. `execute_query()` 丢弃共享搜索层传入但 Neptune 不使用的 `routing_`。
3. `save_to_aoss()` 不在 bulk action 中设置自定义 `_id`，因为 AOSS Serverless 会拒绝自定义文档 ID；逻辑 UUID 保留在 source 字段。
4. 如本地验证确认 `Graphiti.add_episode(group_id=...)` 仍会访问 `_database`，则为 `NeptuneDriver` 增加最小 `_database` 与 `clone(database=...)` 兼容，避免直接 `AttributeError`。

## 非目标

- 不实现完整 Neptune + AOSS 端到端集成测试。
- 不改 Neptune 的数据库/namespace 设计语义。
- 不处理 AOSS update/delete 通过 source `uuid` 查找文档的完整审计，这属于后续 PR。
- 不碰已有开放 PR 正在覆盖的 BM25、label propagation、MCP 文档等方向。

## 方案取舍

推荐方案是最小 driver 契约修复：

- 优点：改动集中在 `graphiti_core/driver/neptune_driver.py`，单元测试可通过 mock 完成，不依赖 AWS 凭据。
- 风险：不能证明完整 `Graphiti.add_episode()` 在真实 Neptune + AOSS 上端到端成功，只能解除已知的参数和 bulk action 阻塞点。

不推荐一次性修完整 #1529：

- `group_id`、Neptune database 语义、AOSS update/delete ID 策略都涉及架构判断。
- 大 PR 在维护者 review 中更容易被要求拆分。

## 测试策略

在 `tests/driver/test_neptune_driver.py` 新增纯单元测试：

- mock `NeptuneDriver.__new__()` 实例与 `client.query`，验证 `params` 展平。
- 验证 `routing_` 不传给 Neptune。
- 验证 direct kwargs 与 `params` 合并时 kwargs 可覆盖同名值。
- mock `helpers.bulk`，验证 AOSS bulk action 不包含 `_id`，但包含 `uuid`。
- 如实现 `_database/clone`，补 `clone(database=...)` 的对象状态测试。

验证命令优先使用：

```bash
uv run --extra dev pytest tests/driver/test_neptune_driver.py -q
uv run --extra dev ruff format --check graphiti_core/driver/neptune_driver.py tests/driver/test_neptune_driver.py
uv run --extra dev ruff check graphiti_core/driver/neptune_driver.py tests/driver/test_neptune_driver.py
uv run --extra dev pyright graphiti_core/driver/neptune_driver.py
```

如果目标仓库未完成依赖安装，先按 `CONTRIBUTING.md` 使用 `make install` 或 `uv sync --extra dev`。
