# briandconnelly/skills #51 一句一行修复设计与计划

## 问题

`agent-friendly-mcp` 的 Markdown 约定是一句一行，但多个参考文档的普通段落重新出现一行多句。Issue #51 要求全量检查该目录，只通过插入换行恢复规范，渲染结果和词语必须保持不变。

## 设计边界

- 只修改 `agent-friendly-mcp/**/*.md`。
- 只在句号、问号或感叹号后插入换行，不改词语、标点、缩进或文件结构。
- 分号连接的从句仍视为一句，不拆分。
- 跳过 fenced code、JSON 字符串、表格、YAML frontmatter、链接或锚点语法、缩写、章节号和小数。
- 列表项中的后续句保留同级缩进，但不重复列表标记。
- 不修改脚本、配置、其他 Skill 或无关格式。

## 已知基线问题

Issue 提供的 JSON 检查正则会把 blockquote 内的 JSON fence 也匹配出来，并把带 `> ` 前缀的内容交给 `json.loads`。该命令在干净上游 `main` 已失败，因此不能把它作为本次修改引入回归的证据。验证时同时执行原命令记录基线失败，并执行忽略 blockquote fence 的修正版来证明普通 JSON fence 仍可解析。

## 实施步骤

1. 创建独立目录 `work/opportunity-pipeline/briandconnelly__skills`，先 clone 上游并读取全部适用规则。
2. 因 `cnYui/skills` 已被其他上游占用，创建命名 Fork `cnYui/briandconnelly-skills`。
3. 从实时默认分支 SHA 创建 `style/agent-friendly-mcp-sentence-lines`。
4. 使用候选搜索定位普通 prose 中的一行多句，逐处人工确认后只插入换行。
5. 创建 PR 前再次查询 Issue、开放 PR 和上游默认分支，避免与 #46 至 #50 的并发工作重叠。

## 验证

- 复查 Issue 指定位置和全目录候选搜索结果。
- `git diff --word-diff` 不出现词语增删，只显示换行重排。
- 比较修改前后的规范化文本，确认除换行外字节内容一致。
- 运行忽略 blockquote fence 的 JSON 解析检查。
- 运行 `uv run --with pyyaml scripts/check-skill-frontmatter.py agent-friendly-mcp/SKILL.md`。
- 运行仓库现有 `prek` 检查（若配置支持目标文件或全量执行）。
- 运行 `git diff --check`。

## 提交

- Commit 使用仓库指定的 `style(agent-friendly-mcp): restore one-sentence-per-line`。
- PR 标题、正文和上游评论使用英文。
- PR 正文如实说明原始 JSON 验证命令在上游基线失败及本次采用的等价修正版。
- 创建 ready PR，不自动合并。
