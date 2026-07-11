# keyfarm ESLint 修复计划

时间：2026-06-09 15:29 JST

目标仓库：`t42ji2ji/keyfarm`

本地实现目录：`work/keyfarm-triage`

## 目标

提交一个小范围 PR，让仓库现有 `npm run lint` 从 main 上的失败状态恢复为通过。

## 范围

只处理现有 ESLint 报错和直接相关 warning：

- `src/components/FarmCanvas.tsx`
- `src/hooks/useGameState.ts`

不处理：

- `#1` 全局快捷键开关
- `#2` license 选择
- `#4` Crops 星标说明
- npm audit 依赖升级
- Tauri Rust 行为改动

## RED 证据

在 `0e12fdf` 上已执行：

```bash
npm run lint
```

当前失败点：

- `FarmCanvas.tsx:222`：`draw` 在声明前被递归 RAF 使用，触发 `react-hooks/immutability`。
- `FarmCanvas.tsx`：`draw` 和 `handleMouseMove` 缺少 `canvasWidth/canvasHeight` hook 依赖。
- `useGameState.ts:85`：`cells` 未重赋值，应使用 `const`。
- `useGameState.ts:89`、`103`：legacy migration 使用 `any`。
- `useGameState.ts:640`：`newCropId` 未重赋值，应使用 `const`。

## 实现设计

### FarmCanvas RAF 调度

问题是 `draw` 回调内部直接把自身传给 `requestAnimationFrame(draw)`。React hooks lint 会把这视为声明前访问。改法：

- 新增 `drawRef` 保存最新 `draw`。
- 新增 `scheduleDraw`，统一执行 `requestAnimationFrame(() => drawRef.current())`。
- `draw` 内部所有递归调度改为 `scheduleDraw()`。
- `useEffect` 和鼠标事件中需要重绘的位置也复用 `scheduleDraw()`。
- `drawRef.current = draw` 放在 `draw` 声明后，确保 RAF 始终调用最新闭包。
- 补齐 `canvasWidth`、`canvasHeight` hook 依赖。

该设计不改变绘制逻辑，只改变 RAF 调度入口，降低行为风险。

### useGameState legacy migration 类型收窄

问题是旧存档兼容逻辑为了读取 `fruitType` 使用了 `any`。改法：

- 定义本地类型 `LegacyFarmCell = Partial<FarmCell> & { fruitType?: string }`。
- 在循环里用 `cell as LegacyFarmCell`。
- 删除旧字段时使用 `const migratedCell = { ...legacyCell }; delete migratedCell.fruitType;`，避免对 `FarmCell` 使用 `any`。
- 把无需重赋值的 `cells`、`newCropId` 改为 `const`。

## 验证

实现后必须执行：

```bash
npm run lint
npm run build
git diff --check
```

`cargo check` 当前本机不可用，原因是 Windows 缺 MSVC `link.exe`，不作为本轮完成门禁。

## PR 标题建议

`Fix existing ESLint failures`

## PR 描述要点

- Fix RAF redraw scheduling in `FarmCanvas` so the hook linter accepts it.
- Replace legacy migration `any` casts with a narrow legacy cell type.
- Keep behavior unchanged; this is a quality-gate fix.
- Verification: `npm run lint`, `npm run build`, `git diff --check`.
