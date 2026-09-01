# 2026-07-15 每日 GitHub PR 机会流水线计划

## 目标

- 生成并复筛 `public/reports/2026-07-15.json`。
- 以具体日期报告启动持久化流水线，不使用 `latest.json` 交接。
- 最多处理 2 个 live preflight 通过的“值得继续”候选，禁止自动合并。

## 当前状态

- `npm run pipeline -- status` 返回 `null`，不存在需要恢复的运行。
- 仓库扫描器仍按 UTC 生成 `2026-07-14` 报告；机器结果已保存到 `data/pipeline/input/2026-07-15-machine-scan.json`，历史日报从 `dist/reports/2026-07-14.json` 恢复。
- 根仓库已有前序自动化留下的 `AGENTS.md` 和上下文文档改动，本轮保留并追加，不回退。

## 候选决策

- `alphacrack/readme2demo#98`：默认分支的 `STAGES` 为 `verify -> tutorial -> render`，四处文档仍写反；无同向开放 PR，项目允许文档贡献且无需外部密钥验证，标为“值得继续”。
- `vlang/setup-v#26`：默认分支警告文本和注释仍残留 Node 模板文案；无同向开放 PR，npm 测试、构建、lint、格式和打包可本地执行，标为“值得继续”。
- `vlang/vtl#147` 与 `Avenx-JS/avenx-js#417`：方向成立但文档范围或行为说明需要更多维护者语义确认，标为“谨慎”。
- `vlang/vsl#320`：默认分支两个测试文件 SHA 不同，Issue 的“字节完全相同”前提已不成立，标为“跳过”。
- `SchoolyB/EZ#2072`：已有开放 PR #2083 精确覆盖，标为“跳过”。
- `stellar-guardian/stellar-guardian#32`：默认分支只有 README 与 LICENSE，没有配置 schema 或实现可作为文档依据，标为“跳过”。
- `ulises-jeremias/github-actions-aur-publish#10`：默认分支自 2023-06-29 未更新，且无 CI、测试和贡献规则，标为“跳过”。

## 执行顺序

1. 校验日期报告 schema，并同步 `latest.json` 与 `dist/reports`。
2. 用日期报告启动流水线并保存 lease id。
3. 按 `next` 顺序执行 live preflight、实现、验证、publication intent、远程 PR 对账和发布。
4. 达到 2 个 PR 上限或队列结束后运行 `close`，保留完整 summary 和 ledger。

