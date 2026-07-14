# visualtorch #172 动画参数示例计划

## 目标

在三个既有 animated reveal gallery 示例中显式传入 `frame_duration`、`final_hold_duration` 和 `loop`，让读者无需阅读实现即可发现动画控制参数。

## 最小范围

- `docs/examples/graph/plot_animated_reveal_graph.py`
- `docs/examples/flow/plot_animated_reveal_flow.py`
- `docs/examples/lenet_style/plot_animated_reveal_lenet_style.py`

不修改核心动画实现、默认值、测试契约或生成图片。

## 设计

- 三个示例使用相同参数值，避免不同 style 暗示不同默认语义。
- 在调用前增加一条简短注释，说明每帧时长、最终帧停留时间和循环开关的含义。
- 保留原有 style 专属参数与示例结构，只把长调用按仓库格式拆行。

## 验证

1. 对三个文件运行 pre-commit。
2. 分别直接运行三个示例脚本，确认无异常。
3. 运行 `tests/test_animation.py`。
4. 运行 `git diff --check` 并核对最终 diff。

## 发布约束

- 按 CONTRIBUTING 要求，修改前在 Issue #172 留言认领。
- commit、PR 标题与正文使用英文。
- 创建 PR 前按 head 分支查询现有 PR，禁止重复创建。
