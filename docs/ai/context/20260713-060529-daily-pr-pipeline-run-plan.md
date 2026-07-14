# 2026-07-13 每日 GitHub PR 机会流水线计划

- 执行时间：2026-07-13 06:05 JST
- 日期报告：`public/reports/2026-07-13.json`
- 每轮 PR 上限：2

## 设计判断

1. 先恢复持久状态；`pipeline status` 返回 `null`，因此启动新运行。
2. 自动扫描器使用 UTC 日期并生成超大仓启发式误报，不能直接作为交接文件。本轮按日本时区创建 2026-07-13 报告，并恢复被覆盖的 2026-07-12 报告。
3. 只将 `posidoni/shell-skill#9` 与 `ChulioZ/game-sessions#110` 标为「值得继续」。两者均由 owner 建立 Issue、范围小、默认分支未修复、无直接重复 PR，并有本地验证命令。
4. `getsentry/dotagents#131` 涉及 resolver 行为，降为谨慎；`SchoolyB/EZ#2072` 改公共契约，`dmwyatt/granz#77` 依赖开放 PR 且本机验证阻塞，均跳过。
5. 每个候选仍必须执行独立 live preflight；发现默认分支变化、认领、重复 PR、门禁或验证不可执行时立即 skipped/blocked。

## 执行顺序

1. 用具体日期报告启动流水线并保存 lease id。
2. 对候选写 preflight JSON，通过后写 execution JSON 并进入 implementing。
3. 先建立问题证据，再做最小修改；运行目标测试、lint/格式、必要构建和 `git diff --check`。
4. 发布前写 publication intent，按 head 查询现有 PR；不存在时才创建 ready PR。
5. 达到 2 个 PR 或队列结束后执行 close，生成 summary 并释放租约。

## 风险控制

- 不自动 merge，不签署 CLA，不使用付费服务或外部密钥。
- 工作目录不干净时创建新目录，不覆盖历史改动。
- 上游内容使用仓库主要语言；内部记录使用中文。
- 不能把未执行的验证写入 PR 或结果 JSON。
