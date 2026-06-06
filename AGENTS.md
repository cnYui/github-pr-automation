# 项目记忆

## GitHub 每日 PR 机会展示页

- 首版目标：每天发现 GitHub 最近 24 小时新增 Star 较高的热门项目，语言不限，生成只读表格报告，帮助用户选择后续要推进的项目。
- 页面边界：单页表格，只展示项目、热度、健康度、PR 切入口、证据、风险和建议动作，不放按钮，不操作 GitHub。
- 自动化边界：不自动 fork、不自动提交、不自动打开 PR；用户在对话中点名项目后才进入单独推进流程。
- 数据口径：页面可直接使用 GitHub Trending daily 填充；自动扫描优先用每日 Star 快照差分计算 24 小时新增 Star，首次运行可用 GitHub Search 冷启动。
- 贡献范围：文档缺口、示例补全、测试补充、小 bug、CI/类型错误修复；排除纯格式化、批量拼写和无明确价值的大改。
- 推荐门槛：只有低风险且切入口明确的项目标为 `值得继续`；中风险标为 `谨慎`；高风险标为 `跳过`。
- Skill 方向：创建 `github-daily-pr-opportunity-scan`，用于规范每日扫描流程和报告 JSON 输出，不用于自动提交 PR。
- 实现计划：见 `docs/ai/context/20260605-211520-github-daily-pr-opportunity-implementation-plan.md`；执行阶段按 TDD，先测试扫描逻辑和页面只读约束，再创建 Skill。
- 2026-06-06 变更：报告 schema 与扫描器已放宽为语言不限，当前 `public/reports/latest.json` 使用 GitHub Trending daily 当前数据生成 10 个项目。
- 2026-06-06 清理：已按用户要求删除本地候选仓库副本 `work/headroom`，释放约 2.2G 空间；当前日报 JSON 仍可能保留 headroom 的历史报告项，后续刷新报告时再更新数据。
- 2026-06-06 Agent 刷新：按用户要求改用 Agent/MCP/Skill 相关项目口径，优先参考 `cnYui` starred repositories，Star 新增不再作为硬门槛；本轮只更新报告数据，不修改扫描器。
- 2026-06-06 GitHub 备份：当前项目已初始化为 git 仓库并推送到 private 仓库 `cnYui/github-10-pr-pr-5-pr`；`.gitignore` 排除 `node_modules/`、`work/`、`outputs/` 和 `.env*`。
- 2026-06-06 候选 PR：`jwasham/coding-interview-university` 推荐切入点是修复 README 中 Bloom filter 与 MIT OCW 两个有官方新地址的坏链；避开翻译、新资源、工作流升级和一次性修全部坏链，详见 `docs/ai/context/20260606-103823-jwasham-ciu-pr-angle.md`。
