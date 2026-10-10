# cnYui PR 反馈巡检

- 运行时间：2026-10-10 12:04（Asia/Tokyo）；比较基线：2026-10-09T14:56:11.769Z。
- 使用当前 Codex 模型和本机 gh；未使用 Claude 专属工具，未切换模型。
- 已读全局及项目 AGENTS.md、当前自动化记忆。gh 确认活跃用户为 cnYui，权限包含 repo/workflow。
- 全站搜索并逐个查询 49 个 open PR 的 head、评论、reviews、reviewThreads、检查、commit statuses、reviewDecision 和 mergeStateStatus。GraphQL 分页标志均无遗漏。
- 新活动仅出现在 numpyro #2336 和 sub2api #64；其余 47 个 PR 无基线后评论、review 或当前 head 检查变化。历史失败及合并冲突不作为新反馈重复处理。

## 需要关注：sub2api #64 安全扫描失败

- PR：https://github.com/cnYui/sub2api/pull/64
- Live head：`0ff15b894033ecb2d87f6648e9b174574f1a757f`；状态 open、unstable。
- push 和 pull_request 两次安全扫描均失败；普通 test、frontend、golangci-lint、shell 检查全部成功；CLA 两项 skipped。
- 实际安全日志：https://github.com/cnYui/sub2api/actions/runs/38014805505
- 后端 govulncheck 退出码 3，报告 10 个可达漏洞：GO-2026-6617、6613、6612、6611、6610、6609、6608、6607、6605、6603。日志中 Go 1.26.6 对应修复版本 1.26.9，golang.org/x/net v0.56.0 对应修复版本 v0.60.0；这些是日志建议，未执行升级或兼容性验证。
- 前端扫描发现 9 条缺少例外的高危告警：axios 7 条（GHSA-c29m-xwm3-cm6r、mghh-pgcx-3jjj、x97p-jq2g-jp4f、3pq3-5fj3-cg6v、542g-h47m-68v8、m8m8-qj5v-23w3、r4gj-5m52-g5wh），source-map-js 1 条（GHSA-68fv-2mgg-jv7q），@vue/server-renderer 1 条（GHSA-g2v6-rqmx-r4w6）。
- xlsx 的 GHSA-4r6h-8v6p-xvw6、GHSA-5pgg-2g8v-p4x9 两条例外于 2026-10-06 到期；已读取当前 `.github/audit-exceptions.yml` 确认。
- 默认分支 2026-10-05 安全扫描已因相同 7 条 axios 告警失败：https://github.com/cnYui/sub2api/actions/runs/37295551042 。本 PR 与当前 main 的差异仅包括 AGENTS.md、上下文文档、UsageGuideView.vue 及其测试，没有依赖、锁文件、Go 工具链或安全配置改动；未声称当前 main 已复跑或全部漏洞均在历史扫描中出现。
- 处理边界：任务第 7 条要求安全敏感未确认方案只上报。xlsx 替换/风险接受及升级兼容性方案需要负责人确认；本轮不延长例外、不添加安全忽略、不改依赖、不推送 PR 分支、不添加诊断评论。建议单独处理安全维护，采用修复版本并验证导出功能及后端回归。

## 已处理反馈：numpyro #2336

- PR：https://github.com/pyro-ppl/numpyro/pull/2336
- 维护者 2026-10-09T15:18:01Z 提出 4 条非阻塞修改建议，并于 15:19:07Z 批准。
- cnYui 已于 2026-10-10T00:08:54Z 回复已处理，当前 head 为 `cac7537b38800a4c452d04c959f35fd71b59dc47`。回读该提交 diff 确认标点、Fréchet 拼写、intermediates 说明和重复 note 已调整。
- Live reviewDecision 为 APPROVED、mergeStateStatus 为 CLEAN；gh pr checks 确认 benchmark、prek、两项 lint、四项 test、examples、finish 共 10 项检查全部通过。
- benchmark 机器人编辑报告不要求新改动；最新人工意见已有 cnYui 后续回复，本轮不重复评论。上述提交与回复由此前会话完成，不归为本轮修复或推送。

## 基线后合并

| PR | 合并时间（UTC） | 合并提交 |
| --- | --- | --- |
| https://github.com/boost-ext/sml/pull/725 | 2026-10-09T21:16:02Z | `4970fefa2345a6ece9f10d2a0c01aab73f113842` |
| https://github.com/cnYui/sub2api/pull/65 | 2026-10-09T21:27:31Z | `686e7595ad766465c5cdc4635f375e4c67adce21` |
| https://github.com/cnYui/github-pr-automation/pull/33 | 2026-10-09T16:06:29Z | `c7b8de17e90c989638d9cdbddd23e9cbb2aad6d2` |

GitHub Search 按 closedAt 搜索后用 REST merged_at 复核，无基线后仅关闭而未合并的 PR。AGENTS.md 记录的 CopilotKit/CopilotKit #5296 与 cclank/cell-architecture-studio #8 也已通过 REST 回读，分别于 2026-08-12、2026-06-17 合并，属于历史状态，不重复报作当前阻塞。

## 本轮动作与验证边界

仅新增本运行记录并更新自动化记忆；没有 PR 评论、代码修复、PR 分支推送、新建 PR 或自动 merge。主控仓原有修改保留；提交时只暂存本记录文件。未运行本地应用测试，CI 结论来自 live GitHub 检查与日志。
