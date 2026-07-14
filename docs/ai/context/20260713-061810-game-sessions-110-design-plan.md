# ChulioZ/game-sessions #110 实施设计

- 候选：`ChulioZ/game-sessions#110`
- 基线：`31a246e9b503356fec33c64fd483da30ae51f1ee`
- 分支：`fix/remove-stale-provider-hints`
- 工作目录：`work/opportunity-pipeline/ChulioZ__game-sessions`

## 必须解决的问题

新增 Nintendo 与 Xbox provider 后，两处搜索提示仍枚举旧的三个 provider。继续维护枚举会反复漂移，Issue 已由 owner 明确给出英德文目标文案。

## 最小方案

只修改 `public/js/lang/de.js` 与 `public/js/lang/en.js` 中：

- `addGame.searchHint`
- `linkProvider.searchHint`

移除 provider 名称，保留 link-provider 的“选择匹配项会保存链接”说明。键集合不变，不改视图、逻辑或 README。

## 验证

- 修改前后运行 `npm test`，确认 176 项测试与 i18n parity 通过。
- 运行 `npm run lint`。
- 在 WSL 运行 `npm run check:syntax`，规避 Windows 缺少 POSIX `find/xargs` 的环境限制。
- 运行 `git diff --check` 并检查最终 diff 仅有四行文本。
