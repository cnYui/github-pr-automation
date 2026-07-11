# 五个项目 PR 角度设计

日期：2026-06-29

## 目标

基于 2026-06-28 的四个主推候选，再加入 `cyyself/OpenTihui`，确定每个项目适合提交 PR 的最小角度。筛选标准继续沿用日报仓口径：问题明确、可本地验证、无明显重复 PR、尽量避免大范围重构和高维护者门槛。

## 本轮边界

- 只做只读核验和设计记录，不 fork、不推送、不创建 PR。
- 每个项目真正动手前都要重新查 issue、open PR、默认分支和最近提交。
- 如果发现同向 PR、维护者已标记 active/in-progress，优先换项目或先在 issue 下确认。

## 推荐顺序

1. `repowise-dev/repowise#371`：UI 展示层小切口，issue 标 `good first issue`，当前未发现同向 open PR。
2. `cyyself/OpenTihui`：README 配置文件名与代码不一致，doc-only PR，当前无 open issue/PR。
3. `fitlab-ai/agent-infra#544`：契约问题清楚，但 issue 包含多项清理，首 PR 必须收窄到 status 枚举。
4. `xintaofei/codeg#273`：问题真实，但需要先定位运行记录模型和复现路径，风险高于前两项。
5. `yvgude/lean-ctx#594`：原本是好切口，但 issue 现在有 `status: in-progress` 标签，动手前必须确认是否已有维护者分支。

## 1. yvgude/lean-ctx#594

结论：`谨慎`。角度仍然好，但当前状态不适合直接抢先提交。

建议 PR 角度：统一 CLI 与 MCP 的 `config.toml` 解析路径，让两端复用同一个 config resolver。issue 复现显示 CLI 使用 `~/.config/lean-ctx/config.toml`，MCP 使用 `~/.local/share/lean-ctx/config.toml`，用户期望二者一致。

证据：

- issue `#594` 仍为 open，标题为 `bug: LeanCTX config path is different for CLI and MCP`。
- issue 标签包含 `bug`、`priority: high`、`config`，同时新增 `status: in-progress`。
- open PR 搜索 `594 OR config.toml OR MCP` 当前未返回同向 PR。
- 仓库未归档，主语言 Rust，近期仍活跃。

首 PR 边界：

- 只改配置路径解析和对应测试，不顺手改配置 schema、迁移逻辑或文档结构。
- 优先找 CLI 与 MCP 当前分别读取配置的入口，把路径决策收敛到一个函数。
- 保留既有用户数据兼容策略；如需迁移旧路径，必须单独评估，不能混入首 PR。

验证计划：

- 新增或调整 Rust 单测，用临时 HOME/XDG 目录证明 CLI 与 MCP 返回同一个 `config.toml` 路径。
- 跑目标 config 测试，再跑仓库推荐的最小 Rust test/check。
- 提交前再次执行 open PR 查重，并确认 `status: in-progress` 是否已有维护者动作。

建议 PR 标题：

`fix(config): use the same config path for CLI and MCP`

## 2. repowise-dev/repowise#371

结论：`值得继续`。这是当前五个里面最适合先做的项目。

建议 PR 角度：在语言使用区过滤配置/数据格式语言，至少隐藏 `JSON`、`YAML`、`TOML`，使展示更接近 GitHub repo language bar 的价值取向。

证据：

- issue `#371` 仍为 open，标题为 `[Refactor] Language usage section`。
- issue 明确说明 JSON/YAML/TOML 不应展示，并给出当前截图与 GitHub 风格期望截图。
- issue 标记 `good first issue`。
- open PR 搜索 `371 OR language usage OR json yaml toml` 当前未发现同向 PR。
- 仓库未归档，近期仍活跃。

首 PR 边界：

- 只处理语言汇总结果的展示过滤，不改仓库扫描器的原始统计数据。
- 过滤列表先保持小而明确：`JSON`、`YAML`、`TOML`。如果代码里语言名大小写不同，用归一化比较。
- 不重做图表样式、不改颜色算法、不改整体 UI 布局。

验证计划：

- 找到 language usage 数据转换或展示组件，补一个包含 Python/TypeScript/JSON/YAML/TOML 的测试。
- 断言配置类语言被隐藏，主要语言百分比或显示列表符合现有产品约定。
- 跑目标测试；如果是前端组件，补截图或 DOM 断言。

建议 PR 标题：

`fix: hide config languages from language usage`

## 3. fitlab-ai/agent-infra#544

结论：`值得继续`，但必须切薄。issue 范围比一个小 PR 更大。

建议 PR 角度：首 PR 只统一 `task.md` frontmatter 的 `status` 枚举，以校验器实际接受的 `active | blocked | completed` 为准，同步模板默认值、注释和 create-task 写入路径。冗余字段清理作为后续 PR。

证据：

- issue `#544` 仍为 open，标题为 `refactor(meta): 清理 task.md frontmatter 冗余字段并修复 status 枚举不一致`。
- issue 明确指出模板写 `open | in-progress | review | blocked | completed`，`create-task` 写 `active`，校验器只认 `active | blocked | completed`。
- issue 标签为 `type: enhancement`、`status: waiting-for-triage`、`in: meta`。
- open PR 搜索 `544 OR task.md frontmatter OR status enum OR created_by` 当前未发现同向 PR。
- 仓库未归档，主语言 TypeScript。

首 PR 边界：

- 只修 `status` 枚举不一致，不删除历史 task 文件里的孤儿字段。
- 不在同一 PR 里清理 `created_by`、`blocked_reason`、`short_id`、`parent_issue`、`depends_on`、`milestone`。
- 如果 `.agents/` 与 `templates/` 是镜像结构，必须同步两边，避免只改一侧。

验证计划：

- 新增或更新验证器测试：模板默认 status 能通过 gate，`open`/`in-progress`/`review` 按现行契约应失败或不再出现在模板。
- 跑仓库 meta/gate 相关测试和格式检查。
- 若 maintainers 更倾向完整清理，再把冗余字段拆成第二 PR。

建议 PR 标题：

`fix(meta): align task status frontmatter with validator`

## 4. xintaofei/codeg#273

结论：`谨慎`。问题像真实 bug，但 issue 只有截图，缺少文字复现步骤。

建议 PR 角度：修正 agent 运行时长统计，确保展示值来自真实开始时间和结束时间差，而不是状态刷新时间、当前时间或错误字段。首 PR 应先补一个纯函数/组件测试，锁定 “start/end -> duration” 的计算。

证据：

- issue `#273` 仍为 open，标题为 `[bug]agent运行时长统计有误`。
- issue 截图对比了 codeg 显示值和 cc-switch 实际开始/结束时间。
- open PR 搜索 `273 OR 运行时长 OR duration OR agent` 命中的是其他 chat/agent 方向 PR，未发现直接修运行时长统计的 PR。
- 仓库未归档，主语言 TypeScript，近期活跃。

首 PR 边界：

- 只修 duration 计算或展示，不重构 agent 生命周期模型。
- 不改数据库 schema，除非现有字段无法表达 start/end；如果需要 schema 变化，应先转为 issue 讨论。
- 如果代码里已有多个 duration 展示入口，先修 issue 截图对应路径。

验证计划：

- 本地定位运行记录结构，构造固定 `startedAt` 与 `endedAt` 的 fixture。
- 新增单测或组件测试，断言 duration 不受当前时间和刷新次数影响。
- 如果 UI 可启动，再用最小页面或截图验证展示。

建议 PR 标题：

`fix(agent): compute runtime from start and end timestamps`

## 5. cyyself/OpenTihui

结论：`值得继续`。推荐先做 doc-only PR，而不是直接加 XCTest target。

建议 PR 角度：修正 README 中远程端点配置文件名，把 `endpoints.json` 改为实际代码使用的 `remote-endpoints.json`。README 当前两处写 `endpoints.json`，但 `RemoteStore` 实际持久化到 `LocalStore.fileURL("remote-endpoints.json")`。

证据：

- 仓库 `cyyself/OpenTihui` 未归档，默认分支 `master`，主语言 Swift，最近推送时间为 `2026-06-28T17:40:31Z`。
- 当前无 open issue，无 open PR。
- 本地浅克隆 HEAD 为 `cf34df8e40ba3f36497044a940d64012952c2c80`。
- README 配置段写 `settings.json`、`shortcuts.json`、`endpoints.json`、`models.json`，并写 API keys `endpoints.json` 使用 complete file protection。
- 代码 `src/openTihui/Models/RemoteEndpoint.swift` 中 `RemoteStore` 使用 `LocalStore.fileURL("remote-endpoints.json")`。

首 PR 边界：

- 只改 README 的文件名，不碰 Swift 代码、不改存储文件名、不加迁移。
- 同时改两处 `endpoints.json`，避免 README 内部仍不一致。
- 仓库当前 `licenseInfo` 为空，首 PR 保持 doc-only 更稳；较大代码 PR 前需再评估贡献边界。

备选但不建议首选：

- 给 `KBSetupPayload` 或 `PromptTemplate` 加 XCTest 覆盖。它们是纯 Swift 逻辑，长期价值更高，但需要新增/确认 Xcode test target；在 Windows 本机难以完整验证，作为第二步更合适。

验证计划：

- `rg -n "endpoints\\.json|remote-endpoints\\.json" README.md src/openTihui/Models`
- 确认 README 只剩 `remote-endpoints.json`，代码仍是同名文件。
- doc-only PR 可用 `git diff --check` 验证；无需跑 Xcode build。

建议 PR 标题：

`docs: correct remote endpoints config filename`

## 提交前通用检查

- 重新执行 `gh issue view` 和 `gh pr list --state open --search ...`，确保没有重复 PR。
- 优先从 clean clone 开分支，避免带入日报仓 `work/` 或其他本地噪音。
- 每个 PR 只解决一个可验证问题；大 issue 拆成首 PR 和后续 PR。
- PR 描述中写清楚本地验证命令和未覆盖项；没有运行的重型检查不要说跑过。
