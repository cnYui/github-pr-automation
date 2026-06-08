# CopilotKit Copilot Runtime 坏链修复设计

## 目标

为 `CopilotKit/CopilotKit` 提交一个小范围文档 PR，修复 issue `#2082` 中仍然存在的 `/concepts/copilot-runtime` 坏链。

## 当前核对

- issue `#2082` 仍为 open，描述为多个文档引用 `https://docs.copilotkit.ai/concepts/copilot-runtime` 但页面无法加载。
- 当前 main 仍有 4 个 `/concepts/copilot-runtime` 命中：
  - `packages/runtime/src/lib/runtime/copilot-runtime.ts`
  - `packages/react-core/src/components/copilot-provider/copilotkit-props.tsx`
  - `showcase/shell-docs/src/content/reference/v1/classes/CopilotRuntime.mdx`
  - `showcase/shell-docs/src/content/reference/v1/components/CopilotKit.mdx`
- 精确搜索未发现开放 PR 正在修复 `/concepts/copilot-runtime`。
- 开放 PR `#3585` 是 Claude Agent SDK 文档新增，未触碰上述 reference/JSDoc 文件，不构成重复修复。
- 当前文档中已有有效链接 `/backend/copilot-runtime`，且 `showcase/shell-docs/src/content/docs/backend/meta.json` 中存在 `copilot-runtime` 页面。

## 方案比较

### 方案 A：只改生成后的 reference MDX

优点：改动最小，能让当前文档页面链接恢复。
缺点：源头 JSDoc 仍保留坏链，后续重新生成 reference 时会回退。

### 方案 B：只改源码 JSDoc

优点：修正源头。
缺点：当前仓库已提交的 reference MDX 仍有坏链，issue 不能立即被修复。

### 方案 C：同步修改源码 JSDoc 与已生成 reference MDX

优点：同时修正源头和当前发布内容；范围仍只限 4 个链接。
缺点：需要确认生成产物与源码保持一致。

## 选择

采用方案 C。

本次 PR 不引入新页面、不改导航、不扩展文档内容，只把残留的 `/concepts/copilot-runtime` 改为现有有效路由 `/backend/copilot-runtime`。

## 验证设计

使用搜索作为文档坏链回归检查：

1. RED：修改前运行 `rg "concepts/copilot-runtime"`，应命中 4 处坏链。
2. GREEN：修改后运行 `rg "concepts/copilot-runtime"`，应无命中。
3. 再运行 `rg "backend/copilot-runtime"`，确认替换后的链接存在于上述 4 个目标文件。
4. 尽量运行 docs/reference 相关构建；如果依赖安装或 monorepo 构建成本过高，则记录无法运行原因，并用搜索检查作为本次文档链接修复的最小验证。

