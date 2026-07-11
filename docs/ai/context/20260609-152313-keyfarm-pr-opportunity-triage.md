# keyfarm PR 机会筛选记录

时间：2026-06-09 15:23 JST

目标仓库：`t42ji2ji/keyfarm`

## 当前远端状态

- 仓库：`https://github.com/t42ji2ji/keyfarm`
- 默认分支：`main`
- 当前 HEAD：`0e12fdf`
- 语言与技术栈：TypeScript、React、Vite、Tauri v2、Rust
- 开放 issue：
  - `#1`：`Super+Shift+K` 全局快捷键与 IDE 快捷键冲突，希望能开关
  - `#2`：询问是否添加开源许可证
  - `#4`：询问 Crops 面板里的星标含义
- 开放 PR：
  - `#3`：Linux X11 keyboard support，和本次可选切口无直接重复

## 本地只读检查

本地克隆目录：`work/keyfarm-triage`

已执行：

- `git ls-remote https://github.com/t42ji2ji/keyfarm.git HEAD refs/heads/main`
- `gh issue list --repo t42ji2ji/keyfarm --state open`
- `gh pr list --repo t42ji2ji/keyfarm --state open`
- `gh issue view 1/2/4 --repo t42ji2ji/keyfarm`
- `npm ci`
- `npm run build`
- `npm run lint`
- `cargo check`

验证结果：

- `npm ci` 成功，但报告 5 个 npm audit 风险；不建议作为本轮 PR，因为依赖升级容易扩大范围。
- `npm run build` 成功。
- `npm run lint` 在 main 上失败，集中在：
  - `src/components/FarmCanvas.tsx`：`draw` 在声明前被递归 RAF 使用，另有 `canvasWidth/canvasHeight` hook 依赖警告。
  - `src/hooks/useGameState.ts`：`prefer-const` 和 `no-explicit-any`。
- `cargo check` 在本机失败，原因是 Windows 缺少 MSVC `link.exe`，不是代码错误；该项不能作为当前机器的有效代码验证证据。

## 候选切口评估

### 推荐：修复 `npm run lint` 失败

价值：

- 仓库自带 `lint` 脚本当前在 main 失败，这是明确、可验证的质量缺口。
- 没有开放 issue/PR 覆盖 `lint`、`eslint`、`FarmCanvas` 或 `useGameState` 方向。
- 改动范围预计只涉及 2 个前端文件，不需要改产品行为。

建议范围：

- `FarmCanvas.tsx`：把递归 `requestAnimationFrame(draw)` 改成不触发 React hooks immutability 规则的调度方式，并补齐 hook 依赖。
- `useGameState.ts`：用更窄的 legacy cell 类型替代 `any`，把无需重赋值的变量改为 `const`。

可验证项：

- `npm run lint`
- `npm run build`
- `git diff --check`

风险：

- `FarmCanvas.tsx` 的 RAF 循环涉及动画绘制，必须保持调度语义不变；实现时应避免顺手重构渲染逻辑。
- 仓库没有测试，不能用单测覆盖行为；需要靠 lint、build 和必要的人工代码审查控制范围。

### 可选：为 `#1` 增加全局快捷键开关

价值：

- 直接解决用户报告的 IDE 快捷键冲突。
- 冲突来源明确：`src-tauri/src/lib.rs` 启动时硬编码注册 `Super+Shift+K`。

风险：

- 需要新增 tray 菜单状态、注册/注销 global shortcut，并最好持久化用户选择。
- 涉及 Tauri/Rust 运行时行为，本机缺 MSVC linker，当前无法完整 `cargo check` 或桌面验证。
- 相比 lint 修复，今天下午提交的确定性较低。

结论：适合作为后续功能 PR，不建议作为本轮首选。

### 可选：补充 Crops 星标说明，回应 `#4`

价值：

- 低风险，星标含义在代码中对应 `goldenHarvests`，README 当前没有解释。
- 可以用 README 或 StatsPanel 微文案解释 `✨N` 表示该作物的 golden harvest 次数。

风险：

- `#4` 本质上是用户提问，维护者可能只需要 issue 回复，不一定需要 PR。
- 如果只改 README，价值偏小；如果改 UI 文案，又需要谨慎处理紧凑面板布局。

结论：可作为备选小 PR，但优先级低于修复仓库自带 lint 失败。

### 不建议：添加许可证

`#2` 需要仓库作者决定授权条款。外部贡献者不应代替作者选择 MIT、Apache-2.0 或其他许可证。

## 推荐下一步

如果今天下午要提交一个成功率高、范围清晰的 PR，建议推进：

> Fix existing ESLint failures so `npm run lint` passes.

预计改动范围：`src/components/FarmCanvas.tsx`、`src/hooks/useGameState.ts`。

执行前需要先写短 plan，确认只修 lint 失败，不处理快捷键开关、许可证、依赖审计和 UI 文案。
