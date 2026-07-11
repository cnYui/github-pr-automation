# GitHub PR 自动化流水线真实运行计划

## 目标

在不自动合并的前提下，完整执行一次扫描、候选快照、live preflight、实现、验证、提交、推送、创建 PR、关闭运行和结果记录流程，确认真实 GitHub 与本地环境中的故障点。

## 运行边界

- 本轮最多创建 2 个 PR，遵循 `config/pipeline.json`。
- 只处理经过 live preflight 后仍为低风险最小切口的候选。
- 上游代码、文档、commit 和 PR 文案遵循目标仓库主要沟通语言。
- 禁止自动 merge、签署协议、使用付费资源或扩大到安全敏感问题。
- 不覆盖 `work/` 内已有未提交改动；目录冲突时使用新的独立目录。

## 已发现的启动问题

1. `npm run scan -- --help` 没有显示帮助，而是静默执行了真实扫描并覆盖当日报告。
2. 启发式扫描把 `n8n-io/n8n` 和 `Snailclimb/JavaGuide` 标为「值得继续」，但没有给出可直接执行的具体切口，也没有完成默认分支、重复 PR 和贡献门禁复核。
3. 扫描器只写 `public/reports`，尚未证明会同步 `dist/reports`，与 Skill 的主控仓库模式要求存在偏差。

## 执行步骤

1. 对扫描结果进行 live 复筛，必要时替换为有明确 Issue、验证路径和贡献门禁证据的候选。
2. 同步日期报告、`latest.json` 与 `dist/reports`，再以日期报告启动不可变快照。
3. 获取 lease，按 CLI 状态机逐个处理候选。
4. 每个候选在 clone 前完成默认分支、重复 PR、贡献规则、语言和本地验证检查。
5. 通过候选进入独立目录实现和验证；失败则写明 `skipped` 或 `blocked`。
6. 创建 PR 前按 head 分支对账，创建后核对远程 diff 与初始 CI。
7. 关闭运行、释放 lease，并记录 summary、实际 PR 和所有故障点。

## 验证

- 主控仓：测试、类型检查、构建、报告一致性、状态文件和干净工作区。
- 候选仓：目标测试、lint/format、类型检查或构建、`git diff --check`。
- GitHub：Fork、远程分支、PR base/head、PR diff、checks 和无重复 PR。
