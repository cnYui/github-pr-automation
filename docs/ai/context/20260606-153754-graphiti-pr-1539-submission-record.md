# getzep/graphiti PR #1539 提交记录

## 结果

- 目标仓库：`getzep/graphiti`
- Fork：`cnYui/graphiti`
- 分支：`codex/neptune-driver-contract`
- Commit：`17e1b81 fix: normalize neptune driver query params`
- PR：`https://github.com/getzep/graphiti/pull/1539`
- 关联 issue：`https://github.com/getzep/graphiti/issues/1529`

## 范围

本轮没有继续推进原报告中的 #1526，因为该方向已有开放 PR #1527 覆盖。改为处理 #1529 的低风险 driver contract 切片：

- `NeptuneDriver.__init__()` 初始化 `_database`，避免 `Graphiti.add_episode(group_id=...)` 访问 `_database` 时崩溃。
- `NeptuneDriver.clone(database=...)` 返回复用同一 Neptune/AOSS 客户端的浅拷贝，并重新绑定 operation 实例。
- `NeptuneDriver.execute_query()` 展平 `params={...}`，并过滤共享搜索路径传入但 Neptune 不使用的 `routing_`。
- `save_to_aoss()` 不再向 AOSS bulk action 写入自定义 `_id`，继续把逻辑 `uuid` 保留在 source 字段中。
- 新增 `tests/driver/test_neptune_driver.py`，覆盖参数归一化、AOSS action 形状和 clone 行为。

## 验证

在 `D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\graphiti` 执行：

```powershell
.\.venv\Scripts\python.exe -m pytest tests/driver/test_neptune_driver.py -q
```

结果：`3 passed, 1 warning`

```powershell
.\.venv\Scripts\python.exe -m pytest tests/driver -q
```

结果：`28 passed, 1 skipped, 1 warning`

```powershell
.\.venv\Scripts\python.exe -m ruff format --check graphiti_core/driver/neptune_driver.py tests/driver/test_neptune_driver.py
```

结果：`2 files already formatted`

```powershell
.\.venv\Scripts\python.exe -m ruff check graphiti_core/driver/neptune_driver.py tests/driver/test_neptune_driver.py
```

结果：`All checks passed!`

```powershell
.\.venv\Scripts\python.exe -m pyright --pythonpath .\.venv\Scripts\python.exe graphiti_core/driver/neptune_driver.py
```

结果：`0 errors, 0 warnings, 0 informations`

## 风险和未覆盖

- 没有跑真实 Neptune + AOSS 集成测试；PR 说明中已明确本轮用 mock client 覆盖 driver contract。
- #1529 还提到是否需要过滤查询未引用的 `search_vector`、`limit`、`min_score` 等额外参数，本轮没有在没有真实 Neptune 证据的情况下扩大行为改动。
- AOSS 通过 source `uuid` 保存逻辑 ID 后，后续如果存在按 `_id == uuid` 更新或删除的路径，还需要单独审计。

## 远端检查

PR 创建后 GitHub 显示 `mergeable=MERGEABLE`、`reviewDecision=REVIEW_REQUIRED`。

失败检查均为仓库自动化凭证或 OIDC 配置问题，当前没有看到代码测试失败：

- `CLAAssistant`：`graphql call to get the committers details failed: HttpError: Bad credentials`
- `Claude PR Code Review`：`Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable`
- `PR Triage`：`Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable`

通过检查：

- `check-fork`
