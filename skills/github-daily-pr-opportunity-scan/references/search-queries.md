# 搜索查询

## 默认全站查询

- `topic:agent archived:false stars:>50`
- `topic:mcp archived:false stars:>50`
- `topic:cli archived:false stars:>50`
- `topic:developer-tools archived:false stars:>50`
- `"model context protocol" archived:false stars:>50`

## 时间过滤

- 计算当前 UTC 日期向前 180 天。
- 为每条查询追加 `pushed:>=计算日期`。

## 可选语言过滤

- `language:TypeScript`
- `language:JavaScript`
- `language:Python`
- `language:Go`
- `language:Rust`

## 去重与实时检查

- 按 `owner/repo` 合并重复搜索结果。
- 检查开放 Issue 和开放 PR 是否已覆盖相同方向。
- 检查问题是否已在默认分支实现。
- 检查维护者是否要求先开 Issue、认领任务或取得批准。
- 检查目标验证是否需要本机不可用的外部资源。

## 主控仓库识别

仅当以下文件全部存在时，视为主控仓库：

- `src/scanner/cli.ts`
- `src/scanner/scan-runner.ts`
- `public/reports/latest.json`
