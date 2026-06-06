# Agent 项目报告刷新计划

## 背景

用户要求重新去 GitHub 寻找 Agent 相关项目。新增 Star 不需要很高，项目本身需要有价值；候选来源不限定 GitHub Trending，可以优先查看用户 GitHub 账号 `cnYui` 的 starred 项目。

## 本次目标

- 用 Agent/MCP/Skill/Agent Infra 相关项目替换当前偏 Trending 的混合报告。
- 保持页面只读表格边界，不新增按钮，不执行 fork、commit 或 PR 操作。
- 保持 `public/reports/latest.json` schema 不变，避免为了单次刷新扩大扫描器复杂度。

## 筛选口径

- 优先来源：`cnYui` starred repositories。
- 补充来源：GitHub Search 的 `topic:ai-agent`、`topic:agentic-ai`、`topic:mcp-server`、`topic:agent-skills`。
- 价值判断：项目必须能落在 Agent 运行时、工具接入、记忆、MCP、Skill、UI/工作流框架、自动化执行或评测基础设施。
- 排除项：泛 AI 模型、语音模型、纯学习资料、纯 Awesome 列表、无明确 Agent 使用路径的通用工具。
- Star 口径：本次不以 24h Star 增长排序；`starsAdded24h` 作为 schema 兼容字段处理，不伪造 Trending 增长。
- PR 切入口：只记录文档缺口、示例补全、测试补充、小 bug、CI/类型错误等小范围机会。

## 执行计划

1. 读取 starred 项目和 GitHub 主题搜索候选。
2. 检查候选的 license、CI、测试、贡献入口、issue/PR 活动。
3. 选出约 10 个 Agent 相关项目，优先保留 starred 中价值明确的项目。
4. 更新 `public/reports/latest.json`。
5. 同步更新 `AGENTS.md` 项目记忆。
6. 运行 schema/test/build 验证报告仍可被页面解析。

## 取舍

- 不修改扫描器：当前需求是一次 Agent 项目刷新，直接改数据风险更低；等该口径稳定后再把 starred/topic 搜索产品化。
- 不创建本地候选仓库副本：本次只做机会报告，不需要占用磁盘克隆项目。
- 对 license 缺失或贡献/验证信号不足的项目降低推荐等级，避免把大项目误标为低风险机会。
