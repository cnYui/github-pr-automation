# OpenTihui PR #1 提交记录

日期：2026-06-29

## 结果

已提交 `cyyself/OpenTihui` PR #1：

https://github.com/cyyself/OpenTihui/pull/1

PR 标题：`docs: correct remote endpoints config filename`

分支：`cnYui:codex/docs-remote-endpoints-filename` -> `cyyself:master`

提交：`c0d2f44310713a7010813aacf586201826fc0477`

## 改动范围

只修改 `README.md` 两处远程端点配置文件名：

- 配置文件列表：`endpoints.json` -> `remote-endpoints.json`
- API key 文件说明：`endpoints.json` -> `remote-endpoints.json`

未修改 Swift 代码、存储文件名、迁移逻辑、XCTest target 或文件保护策略。

## 执行目录

`D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\OpenTihui-remote-endpoints-docs`

该目录是本轮从上游新克隆的独立执行目录。提交后本地工作区干净。

## 上游状态

执行前复查：

- `gh repo view cyyself/OpenTihui --json defaultBranchRef,isArchived,primaryLanguage,pushedAt,url`
  - 默认分支：`master`
  - 未归档
  - 主语言：Swift
  - 最近推送：`2026-06-28T17:40:31Z`
- `gh issue list --repo cyyself/OpenTihui --state open ...`
  - 返回 `[]`
- `gh pr list --repo cyyself/OpenTihui --state open ...`
  - 返回 `[]`

执行后回读：

- PR #1 状态：`OPEN`
- `mergeable`：`MERGEABLE`
- `statusCheckRollup`：`[]`
- commit 作者：`cnYui <xiaobianfuai@gmail.com>`

## 验证

提交前后均执行了关键验证：

```powershell
if (rg -n '(^|[^-])endpoints\.json' README.md) { Write-Output 'README still documents the old endpoints.json filename'; exit 1 }
```

结果：退出码 0，无旧独立文件名命中。

```powershell
rg -n "remote-endpoints\.json" README.md src/openTihui/Models/RemoteEndpoint.swift
```

结果：

- `README.md:257` 命中 `remote-endpoints.json`
- `README.md:260` 命中 `remote-endpoints.json`
- `src/openTihui/Models/RemoteEndpoint.swift:38` 命中 `LocalStore.fileURL("remote-endpoints.json")`

```powershell
git diff --check HEAD^ HEAD
```

结果：退出码 0，无输出。

## 备注

- 本次是 doc-only PR，未运行 Xcode build 或 XCTest。
- `git diff` 在 Windows 下提示 `README.md` 下次触碰会 LF -> CRLF，这是本机 Git 行尾提示；提交 diff 实际只有两行文件名替换。
