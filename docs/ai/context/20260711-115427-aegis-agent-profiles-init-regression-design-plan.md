# Aegis agent_profiles 初始化回归设计与计划

## 背景

- 原候选 `Justin0504/Aegis#2` 的缺表问题已由上游提交 `cfdde2f2` 在 2026-03-25 修复；当前 `main` 的 `initializeDatabase()` 已创建 `agent_profiles`。
- issue 仍 open，但再次添加 DDL 会是重复实现。
- 现有 store parity 测试只验证 `SqliteAgentProfilesStore.init()`，没有验证 gateway 的主初始化器与 `ProfileManager` 的启动契约。

## 必须解决的问题

补一条能直接捕获历史回归的测试：全新 gateway 数据库经过主初始化后，`ProfileManager.initialize()` 必须成功并看到空 profile 集合。

## 方案

- 只修改 `packages/gateway-mcp/src/__tests__/api-smoke.test.ts`。
- 复用现有 `initializeDatabase(':memory:')` harness。
- 创建 `ProfileManager`，等待 `initialize()` 成功并断言 `size === 0`。
- 在 `finally` 中调用 `shutdown()`，避免定时器泄漏。
- 不修改 DDL、store、CI 或生产代码；测试锁定运行时契约，不绑定具体 SQL 文本。

## 边界与 PR 表述

- 开放 PR #3/#5 与该测试无关，未发现 `ProfileManager` / `agent_profiles` 同向 PR。
- PR 写作“regression coverage for #2”，不使用 `Fixes #2`，因为生产修复已在 main。
- 测试改动无迁移风险。

## 验证

```powershell
cd packages/gateway-mcp
npm test -- --runInBand api-smoke
npm run build
npm test -- --runInBand
git diff --check
```

## 提交计划

- 分支：`codex/test-agent-profiles-startup`
- 提交：`test(gateway): cover agent profile startup on fresh database`
- PR 目标：`Justin0504/Aegis:main`
