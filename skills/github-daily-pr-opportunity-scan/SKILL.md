---
name: github-daily-pr-opportunity-scan
description: 当 Codex 需要在 GitHub 全站寻找值得低风险后续 PR 工作的仓库、按贡献可行性而非热度筛选候选项目，或在 github-pr-automation 仓库中刷新候选报告时使用。只负责发现、复核和报告，不执行 Fork、修改、提交或创建 PR。
---

# GitHub 每日 PR 机会扫描

## 目标

寻找值得投入的低风险 GitHub 贡献机会。优先考虑切口明确、验证成本低和维护者接受概率，不以 Star 数或候选数量为目标。

## 工作流

1. 读取 `references/search-queries.md` 和 `references/scoring-rubric.md`。
2. 使用默认查询构建 GitHub 候选池。
3. 按 `owner/repo` 去重。
4. 检查 Issue、开放 PR、默认分支实现和贡献门禁。
5. 排除归档、停滞、重复或难以本地验证的方向。
6. 输出 5 至 10 个候选，并标记为 `值得继续`、`谨慎` 或 `跳过`。

大型项目只保留文档、示例、失效链接或配置指引类低风险切口。

## 通用发现模式

不在主控仓库时：

- 需要实时搜索时运行 `scripts/find_candidates.py`。
- 在对话中输出候选项目。
- 不创建仪表盘文件。

## 主控仓库模式

当前目录同时存在以下文件时，视为主控仓库：

- `src/scanner/cli.ts`
- `src/scanner/scan-runner.ts`
- `public/reports/latest.json`

在该模式下：

1. 优先运行仓库现有扫描器与 schema。
2. 对自动扫描结果执行 live 复筛，不能只相信启发式评分。
3. 同步更新日期报告和 `latest.json`。
4. 保持 `public/reports` 与 `dist/reports` 一致。
5. 向编排阶段交接具体日期报告，不交接会被覆盖的 `latest.json`。

## 输出要求

每个保留候选必须包含：

- `owner/repo`
- 项目简介
- 推荐等级
- 明确的 PR 切入点
- 具体证据
- 主要风险
- 本地验证说明
- 重复 PR 与默认分支检查结果
- 贡献门禁说明

## 硬门槛

默认跳过：

- 仓库已归档或长期停滞。
- 问题已在默认分支修复。
- 已有开放 PR 覆盖相同方向。
- 需要重型云资源、企业账号、内部网络或多节点集群。
- 无法建立可信的本地验证路径。
- 大型项目没有文档类低风险切口。

## 禁止事项

- 不要只因 Star 高而推荐。
- 不要为凑数量降低标准。
- 不要自动 Fork。
- 不要修改候选仓库。
- 不要提交或创建 PR。
