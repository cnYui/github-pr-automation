# OpenTihui remote endpoints 配置文件名 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `cyyself/OpenTihui` 提交一个 doc-only PR，把 README 中错误的远程端点配置文件名从 `endpoints.json` 改为代码实际使用的 `remote-endpoints.json`。

**Architecture:** 只修正文档与现有 Swift 存储实现之间的不一致。`RemoteStore` 继续使用 `LocalStore.fileURL("remote-endpoints.json")`，不引入迁移、不改本地文件格式、不触碰运行时代码。

**Tech Stack:** Markdown、Swift 只读核验、GitHub CLI、PowerShell、git。

---

## 上游核验证据

- 核验时间：2026-06-29 15:30-15:40 JST。
- 仓库：`https://github.com/cyyself/OpenTihui`，默认分支 `master`，未归档，最近推送 `2026-06-28T17:40:31Z`。
- 当前远端 `master` HEAD：`cf34df8e40ba3f36497044a940d64012952c2c80`。
- 当前 open issue：`gh issue list --repo cyyself/OpenTihui --state open --json number,title,author,updatedAt,url` 返回 `[]`。
- 当前 open PR：`gh pr list --repo cyyself/OpenTihui --state open --json number,title,author,updatedAt,url` 返回 `[]`。
- README 当前两处写 `endpoints.json`：
  - `README.md:257`：配置文件列表包含 `endpoints.json`。
  - `README.md:260`：API keys 写入 `endpoints.json`。
- 代码实际文件名：`src/openTihui/Models/RemoteEndpoint.swift:38` 使用 `LocalStore.fileURL("remote-endpoints.json")`。

## 范围

做：

- 把 README 两处 `endpoints.json` 改为 `remote-endpoints.json`。
- 保持 `settings.json`、`shortcuts.json`、`models.json` 原样。
- 用 `rg` 和 `git diff --check` 验证文档内部一致性和空白问题。

不做：

- 不改 `src/openTihui/Models/RemoteEndpoint.swift` 或 `LocalStore`。
- 不把运行时代码改回 `endpoints.json`，因为这会改变现有用户文件名契约。
- 不新增迁移逻辑、不新增 XCTest target、不调整文件保护策略。
- 不改 README 中与本文件名无关的措辞、格式或章节结构。

## 文件结构

- Modify: `README.md`
  - 责任：公开说明 Documents/Config 下的配置文件名；本 PR 只修正远程端点配置文件名。
- Read only: `src/openTihui/Models/RemoteEndpoint.swift`
  - 责任：确认 `RemoteStore` 的实际持久化文件名是 `remote-endpoints.json`。
- Read only: `src/openTihui/Models/AppSettings.swift`
  - 责任：确认 `settings.json` 名称不变。
- Read only: `src/openTihui/Models/Shortcut.swift`
  - 责任：确认 `shortcuts.json` 名称不变。
- Read only: `src/openTihui/Models/ModelStore.swift`
  - 责任：确认 `models.json` 名称不变。

---

### Task 1: 建立干净执行目录并复查上游状态

**Files:**

- Modify: none
- Test: none

- [ ] **Step 1: 克隆并建分支**

```powershell
Set-Location 'D:\CodeWorkSpace\github-10-pr-pr-5-pr'
New-Item -ItemType Directory -Force -Path 'work' | Out-Null
git clone https://github.com/cyyself/OpenTihui.git 'work/OpenTihui-remote-endpoints-docs'
Set-Location 'work/OpenTihui-remote-endpoints-docs'
git checkout -b codex/docs-remote-endpoints-filename
git status --short
```

Expected: 当前分支为 `codex/docs-remote-endpoints-filename`，`git status --short` 无输出。

- [ ] **Step 2: 复查远端默认分支与重复 PR**

```powershell
gh repo view cyyself/OpenTihui --json defaultBranchRef,isArchived,pushedAt,url
gh issue list --repo cyyself/OpenTihui --state open --json number,title,url,updatedAt --limit 30
gh pr list --repo cyyself/OpenTihui --state open --json number,title,url,headRefName,updatedAt --limit 30
git ls-remote origin refs/heads/master
```

Expected:

- 默认分支仍是 `master`，仓库未归档。
- open issue 与 open PR 仍为空数组；如果出现同向 PR，停止执行并回到日报仓记录原因。
- `git ls-remote` 返回的 `master` HEAD 与本地 `origin/master` 对齐。

- [ ] **Step 3: 复查当前文件名证据**

```powershell
rg -n "endpoints\.json|remote-endpoints\.json|LocalStore\.fileURL" README.md src/openTihui/Models
```

Expected:

- README 命中两处 `endpoints.json`。
- `src/openTihui/Models/RemoteEndpoint.swift` 命中 `LocalStore.fileURL("remote-endpoints.json")`。

---

### Task 2: 写失败检查

**Files:**

- Modify: none
- Test: README 搜索检查

- [ ] **Step 1: 证明 README 当前仍有旧文件名**

```powershell
rg -n '(^|[^-])endpoints\.json' README.md
```

Expected: 命中 README 两处 `endpoints.json`，说明文档仍与 `RemoteStore` 不一致。

- [ ] **Step 2: 证明代码实际使用远程端点文件名**

```powershell
rg -n "remote-endpoints\.json" src/openTihui/Models/RemoteEndpoint.swift
```

Expected: 命中 `LocalStore.fileURL("remote-endpoints.json")`。

---

### Task 3: 修正 README 文件名

**Files:**

- Modify: `README.md`
- Test: README 搜索检查

- [ ] **Step 1: 替换 README 配置文件列表中的文件名**

把配置文件列表从：

```markdown
(`settings.json`, `shortcuts.json`, `endpoints.json`, `models.json`)
```

改为：

```markdown
(`settings.json`, `shortcuts.json`, `remote-endpoints.json`, `models.json`)
```

- [ ] **Step 2: 替换 README API key 说明中的文件名**

把 API key 说明从：

```markdown
API keys (`endpoints.json`) are written with complete file protection.
```

改为：

```markdown
API keys (`remote-endpoints.json`) are written with complete file protection.
```

Reason: API key 仍由 `RemoteStore` 写入，文档应指向实际持久化文件名，避免用户在 Files app 里找错文件。

---

### Task 4: 跑文档验证

**Files:**

- Modify: `README.md`
- Test: grep 与 diff check

- [ ] **Step 1: 确认 README 不再残留旧远程端点文件名**

```powershell
rg -n '(^|[^-])endpoints\.json' README.md
if ($LASTEXITCODE -eq 0) {
  throw 'README still documents the old endpoints.json filename'
}
```

Expected: `rg` 无旧文件名命中，PowerShell 不抛错。

- [ ] **Step 2: 确认 README 与 Swift 代码同名**

```powershell
rg -n "remote-endpoints\.json" README.md src/openTihui/Models/RemoteEndpoint.swift
```

Expected:

- README 命中两处 `remote-endpoints.json`。
- `RemoteEndpoint.swift` 命中一处 `LocalStore.fileURL("remote-endpoints.json")`。

- [ ] **Step 3: 检查最终 diff 范围**

```powershell
git diff -- README.md
git diff --name-only
```

Expected:

- 只修改 `README.md`。
- diff 只有两处文件名替换，没有无关格式变化。

- [ ] **Step 4: 检查空白问题**

```powershell
git diff --check
```

Expected: 无输出，退出码 0。

---

### Task 5: 提交与 PR

**Files:**

- Modify: `README.md`

- [ ] **Step 1: 提交**

```powershell
git add README.md
git commit -m "docs: correct remote endpoints config filename"
```

Expected: 生成一个单 commit。

- [ ] **Step 2: 准备 PR 描述**

```powershell
@'
## Summary

- correct the README configuration filename for remote endpoints
- align the documented API key file with `RemoteStore`'s `remote-endpoints.json`

## Tests

- `rg -n '(^|[^-])endpoints\.json' README.md` returns no matches
- `rg -n "remote-endpoints\.json" README.md src/openTihui/Models/RemoteEndpoint.swift`
- `git diff --check`
'@ | Set-Content -LiteralPath pr-body.md -Encoding utf8
```

Expected: `pr-body.md` 只声明文档验证，不声称跑过 Xcode build 或 XCTest。

- [ ] **Step 3: 推送并创建 PR**

```powershell
git push -u origin codex/docs-remote-endpoints-filename
gh pr create --repo cyyself/OpenTihui --title "docs: correct remote endpoints config filename" --body-file pr-body.md
```

Expected: PR 创建成功，base 为 `master`。

## 自检

- Spec coverage: 设计文档要求修正 README 两处远程端点配置文件名；Task 3 覆盖两处替换，Task 4 覆盖文档与代码一致性验证。
- Placeholder scan: 本计划不含占位说明、泛化测试步骤或未定义文件。
- Type consistency: 不改 Swift 类型、API、存储实现或文件保护逻辑。
- 风险控制: doc-only PR 不改变用户数据路径；如果维护者期望改代码文件名，应先转为 issue 讨论，不能在本 PR 混入迁移。
