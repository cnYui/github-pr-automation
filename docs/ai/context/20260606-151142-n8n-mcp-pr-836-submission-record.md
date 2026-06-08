# n8n-mcp PR #836 提交记录

## 目标

- 上游仓库：`czlonkowski/n8n-mcp`
- 本地工作区：`work/n8n-mcp`
- 分支：`codex/normalize-http-mcp-workflow-input`
- PR：https://github.com/czlonkowski/n8n-mcp/pull/836
- 关联 issue：`#814`

## 范围

本次只处理 HTTP MCP 客户端把嵌套数组、对象和数字错误序列化后的归一化问题：

- 将 JSON 字符串根节点解析回对象或数组。
- 将稠密数字索引对象递归恢复为数组，例如 `{ "0": x, "1": y }` 恢复为 `[x, y]`。
- 对 workflow node 的 `typeVersion`、`position`、`parameters`、`credentials` 做输入归一化。
- 在 `createWorkflow`、`updateWorkflow`、workflow validation schema、partial workflow diff 的 `addNode` 和 `position` 路径接入归一化。

本次不处理 `PUT /api/v1/workflows/:id` 的 additional properties 问题；该问题与 n8n API 请求体兼容性有关，是独立范围。

## 提交

- commit：`4a05d8e fix: normalize HTTP MCP workflow inputs`
- fork 分支：`cnYui:codex/normalize-http-mcp-workflow-input`
- PR 状态：open、ready for review、mergeable

## 验证

- `npx vitest run tests/unit/services/n8n-validation.test.ts --coverage.enabled=false`：106 passed
- `npx vitest run tests/unit/mcp/handlers-n8n-manager.test.ts --coverage.enabled=false`：108 passed
- `npx vitest run tests/unit/mcp/handlers-workflow-diff.test.ts --coverage.enabled=false`：46 passed
- `npm run typecheck`：通过
- `npm run build`：通过

## 注意

上游当前 `package.json` 与 `package-lock.json` 不同步，本地无法使用 `npm ci` 安装依赖；本次使用 `npm install --package-lock=false --no-audit --no-fund` 安装依赖，未产生 tracked 文件变更。`npm run build` 产生的 `dist/` 未暂存构建产物已在提交后清理。
