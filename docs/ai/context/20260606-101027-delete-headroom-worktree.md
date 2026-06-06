# 删除 headroom 本地副本

## 背景

用户要求删除项目内涵盖的 `headroom` 项目，因为该目录占用空间过大。

## 执行

- 删除路径：`work/headroom`
- 删除前占用：约 `2.2G`
- 处理方式：只删除本地候选仓库副本，不修改扫描器、页面逻辑或历史日报 JSON。

## 影响

- 释放本地磁盘空间。
- 根目录下不再保留 `chopratejas/headroom` 的工作副本。
- `public/reports/latest.json` 当前仍可能包含 headroom 作为历史日报项目；这是报告数据，不代表本地仍存在该仓库副本。
- 后续如需继续推进 headroom PR，需要重新 clone 或恢复对应工作目录。
