---
name: github-run-pr-opportunity-pipeline
description: 当 Codex 需要在独立定时任务中执行完整 GitHub PR 机会流水线时使用：恢复未完成运行、调用 github-daily-pr-opportunity-scan 刷新候选报告、保存不可变候选快照、调用 github-implement-pr-opportunity 处理「值得继续」项目、创建 PR，并用持久状态支持并发保护、失败恢复和跨日去重。
---

# GitHub PR 自动化流水线

## 原则

在一次 cron 任务中串联扫描和执行，不依赖历史对话。所有跨阶段信息写入 `data/pipeline`。

只处理 `值得继续` 候选，但仍强制执行 live preflight。禁止自动 merge。

## 启动

1. 进入主控仓库根目录。
2. 运行 `npm run pipeline -- status` 检查当前运行。
3. 有未完成运行时执行 `npm run pipeline -- start` 恢复并获取租约。
4. 没有未完成运行时，使用 `github-daily-pr-opportunity-scan` 刷新并复筛报告。
5. 使用具体日期文件启动，例如：

   `npm run pipeline -- start --report public/reports/2026-07-11.json`

不要把 `latest.json` 作为持久交接文件。

保存 `start` 输出中的 `run.window.id`，作为本次执行窗口的 `<lease-id>`。后续所有状态命令必须携带该值。

## 处理候选

循环执行：

1. 运行 `npm run pipeline -- next --lease <lease-id>`。
2. 返回 `limit_reached` 时停止本轮。
3. 返回 `empty` 时结束本轮。
4. 根据候选当前状态恢复：

   - `pending` 或 `preflight`：使用 `github-implement-pr-opportunity` 完成或更新 live preflight。
   - `implementing`：读取已保存的工作目录、分支和基线 SHA，继续原修改，不重复 preflight。
   - `verifying`：进入已保存工作目录继续验证，不重新实现。
   - `publishing`：按保存的 upstream/base/head 对账远程 PR，找到已有 PR 时直接补录。

5. 对 `pending` 或 `preflight` 候选，将 preflight JSON 写入 `data/pipeline/input/<candidate-id>-preflight.json`。
6. 记录 preflight：

   `npm run pipeline -- preflight --lease <lease-id> --candidate <id> --file <path>`

7. preflight 通过后依次推进：

   - 写 execution JSON。
   - `transition --lease <lease-id> --to implementing --execution-file <path>`
   - 完成最小修改
   - `transition --lease <lease-id> --to verifying`
   - 完成验证并写 publication intent JSON
   - `transition --lease <lease-id> --to publishing --publication-file <path>`
   - 使用 `gh pr list` 或 `gh pr view` 按 head 分支对账；确认不存在时才创建 PR
   - `transition --lease <lease-id> --to pr_opened --result-file <path>`

8. 无法执行时使用 `skipped` 或 `blocked`，并通过 `--message` 写明原因。

状态转换必须由 CLI 完成，不直接手工修改 `run.json`。

## Execution JSON

进入实现阶段前记录：

```json
{
  "workspacePath": "work/opportunity-pipeline/owner__repo",
  "branch": "fix/example",
  "upstreamRepository": "owner/repo",
  "baseBranch": "main",
  "baseSha": "abcdef1234567890"
}
```

## Publication Intent JSON

创建 PR 前记录：

```json
{
  "preparedAt": "2026-07-11T00:00:00.000Z",
  "upstreamRepository": "owner/repo",
  "baseBranch": "main",
  "headOwner": "cnYui",
  "headBranch": "fix/example"
}
```

## Preflight JSON

至少包含：

```json
{
  "checkedAt": "2026-07-11T00:00:00.000Z",
  "defaultBranchSha": "abcdef1234567890",
  "issueState": "open",
  "defaultBranchContainsFix": false,
  "duplicatePullRequest": false,
  "contributionGate": "allowed",
  "localVerification": ["npm test -- target.test.ts"],
  "communicationLanguage": "English",
  "notes": []
}
```

有 Issue 时增加 `issueUrl`。

## PR 结果 JSON

```json
{
  "branch": "fix/example",
  "commitSha": "abcdef1234567890",
  "pullRequestUrl": "https://github.com/owner/repo/pull/1",
  "verificationSummary": ["目标测试通过"],
  "ciStatus": "pending"
}
```

## 结束

无论本轮达到数量上限还是完成全部候选，都运行：

`npm run pipeline -- close --lease <lease-id>`

`close` 释放租约并生成 `summary.md`。仍有待处理候选时保留 `current.json`，下一次 cron 自动恢复；全部进入终态时清除 current run。

意外崩溃时不要手工删除 lease。等待租约过期后由下一轮接管。

从 `publishing` 恢复时先查询现有 PR。已存在时补写结果，禁止再次调用 `gh pr create`。

## 语言与输出

- 内部状态、summary 和用户报告使用中文。
- 上游修改、commit、PR 和评论遵循目标仓库的主要沟通语言。
- 最终汇报本轮扫描报告、处理数量、PR 链接、验证结果、阻塞项和剩余队列。
