# GitHub PR 自动化流水线实现记录

## 完成内容

- 将扫描 Skill 源码迁入仓库。
- 新增 `github-implement-pr-opportunity`。
- 新增 `github-run-pr-opportunity-pipeline`。
- 新增 Skill 原子安装与回滚脚本。
- 新增 `GH_TOKEN`、`GITHUB_TOKEN`、`gh auth token` 认证回退。
- 新增候选不可变快照、current run、ledger、lease 和 summary。
- 新增 `pending -> preflight -> implementing -> verifying -> publishing -> pr_opened` 状态机。
- 新增独立 `leaseId`，所有状态写操作必须验证执行窗口所有权。
- 新增 execution context 和 publication intent，支持实现、验证和创建 PR 阶段恢复。
- 创建 PR 前按 head 分支对账，避免崩溃恢复时重复创建。
- 保持 opportunity key 稳定，Issue URL 不再破坏跨日 ledger 去重。
- 限制报告、状态、CLI 输入和候选工作区必须位于主控仓库允许目录内。
- 将 Vitest 限制为本仓 `src/**/*.test.ts`，不扫描 `work/` 下外部仓库。

## GitHub CLI 能力边界

`gh` 可以完成认证、仓库查看与改名、clone、fork、PR 创建、Review/评论、checks 查询和 merge 等 GitHub 远程操作。

`gh` 不负责本地代码编辑、测试、`git switch`、`git add`、`git commit`、`git push` 和冲突解决。完整流程必须组合：

- `gh`：GitHub 远程资源与 PR API
- `git`：本地分支、提交和推送
- Codex 与目标仓库工具链：代码修改和验证

流水线禁止自动 merge。

## 工作区清理

- 已归档 144 份历史上下文文档和 5 组日期报告。
- `public/reports` 与 `dist/reports` 对应文件 SHA-256 一致。
- `data/`、`work/`、字面量 `~/`、缓存和 Python 字节码已加入忽略规则。
- 已删除仓库内误生成的 `~/.openclaw` 副本，未触碰真实用户主目录。
- `work/` 下约 47GB 候选仓库包含多处未提交修改，本次未移动、删除或改写。

## 验证

- `npm test`：12 个测试文件、34 项测试全部通过。
- `npm run typecheck`：通过。
- `npm run build`：通过。
- 三个仓库内 Skill：`quick_validate.py` 全部通过。
- 三个安装 Skill 与源码哈希一致。
- Python 候选脚本编译通过，并成功使用 `gh auth token` 回退。
- 主控仓库 dry-run：读取 `public/reports/2026-07-11.json`，建立候选快照和 lease，4 个候选全部以 dry-run 原因跳过，运行正常完成，未执行 clone、fork、push 或创建 PR。

## 前向验证

- 默认分支已修且存在重复 PR 的候选被执行 Skill 判定为 `skipped`，未发生远程写入。
- 已有未过期 lease 时，第二个 cron 被编排 Skill 判定为立即停止，不扫描、不修改、不删除其他运行的 lease。

## 后续

- 提交当前实现并快进合并到 `main`。
- 将远程和本地仓库改名为 `github-pr-automation`。
- 更新 `cnyui-pr` 自动化绑定路径。
- 用户确定新 cron 的执行时间后，再创建正式机会流水线定时任务。
