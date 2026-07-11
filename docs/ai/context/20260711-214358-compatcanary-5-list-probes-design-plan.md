# compatcanary #5 离线 probe 列表设计与计划

## 问题

`compatcanary --profile <profile> --list-probes` 当前会被参数解析器判定为未知选项并以状态码 2 退出。CLI 只有 help/version 能在 `validateScanOptions` 前返回，因此用户无法在没有 URL、model、凭据和网络时查看 profile 包含的 probe。

## 设计

- 在 `parseArgs` 的布尔选项中增加 `listProbes`，不改变现有 value flag 行为。
- 从现有扫描逻辑提取纯函数 `selectProbes(profile, probeSet)`，让真实扫描和列表输出共用同一筛选规则。
- CLI 在 help/version 之后、在线扫描参数校验之前处理 `listProbes`。
- 文本输出按当前 probe 定义顺序展示 ID、名称、required/optional 和 weight，保持可扫描且稳定。
- 更新 CLI help 与 README 用法，不增加依赖、不改变报告 schema 或网络请求路径。

## 测试

1. 参数单测确认 `--list-probes` 被识别。
2. 新增子进程 CLI 测试，证明无 URL、model 和凭据时：
   - `chat` 状态码为 0，恰好列出 5 个 Chat probe，不包含 Responses probe。
   - `modern` 状态码为 0，恰好列出全部 7 个 probe。
3. 运行 `npm run check`、`npm test`、两个真实 CLI 命令和 `git diff --check`。
4. 运行 `npm run evidence:check` 并区分基线失败与本次改动。

## 已知基线

干净上游 `3b46c515` 上，`npm run check` 和 16 项测试通过；`npm run evidence:check` 因 `evidence/pages/github-models-cohere-command-a.md` 已陈旧而失败。该失败在本次修改前存在，PR 不应混入无关 evidence 生成物。

## 提交流程

- 工作目录：`work/opportunity-pipeline/CognizenOrg__compatcanary`
- 分支：`feat/list-probes`
- 先 Fork 到 `cnYui/compatcanary`，再精确暂存实现、测试和 README。
- 创建 PR 前重新检查 Issue、开放 PR 和上游 `main`。
- PR 使用英文，说明 `evidence:check` 的上游基线失败，不声称其通过。
