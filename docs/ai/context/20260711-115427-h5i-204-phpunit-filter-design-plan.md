# h5i #204 PHPUnit 输出过滤器设计与计划

## 背景与状态

- `h5i-dev/h5i#204` 当前 open、未分配，`main` 没有 `phpunit.toml`，也没有同向 PR。
- 现有 filter 由 `assets/filters/*.toml` 声明并通过内联 golden tests 验证，无需修改 Rust 核心逻辑。
- PHPUnit 的有效信号是失败/错误块、断言 diff、stack trace 和最终 summary；主要噪音是空行与带计数后缀的进度字符行。

## 设计原则

- 采用 keep-by-default，只删除已知噪音；不用 `keep_lines_matching`、`tail_lines` 或 `max_lines`，避免截断多失败场景。
- 进度规则必须带 `N / N (P%)` 后缀并整行锚定，避免误删失败正文、路径或 diff。
- 空输出使用 `phpunit: no output`，不把“没有输出”误报成测试成功。

## 最小实现

只新增 `assets/filters/phpunit.toml`：

```toml
[filters.phpunit]
description = "Compact PHPUnit output — drop progress and blank lines while preserving failures, errors, and summaries"
match_command = "^(?:phpunit(?:\\.phar)?|php\\s+(?:\\S*/)?phpunit(?:\\.phar)?)(?:\\s|$)"
strip_ansi = true
strip_lines_matching = [
  "^\\s*$",
  "^\\s*[.FEWRDNIS]+\\s+\\d+\\s*/\\s*\\d+\\s*\\(\\s*\\d+%\\)\\s*$",
]
on_empty = "phpunit: no output"
```

命令匹配覆盖 `phpunit`、`phpunit.phar`、`php vendor/bin/phpunit`、`php ./vendor/bin/phpunit`，不匹配 `phpunit-wrapper`、`my-phpunit` 或 `echo phpunit`。直接 `vendor/bin/phpunit` 会由现有命令归一化得到 basename。

## Golden tests

1. PHPUnit 12 all-pass：删除进度行和空行，保留 header、runtime、Time 和 `OK (...)`。
2. PHPUnit 10 failure：删除进度行和空行，完整保留 `There was 1 failure`、测试名、断言、stack、`FAILURES!` 和最终 summary。
3. 空输入：输出 `phpunit: no output`。

失败样本如改编自 rtk，需要在 PR 描述标注来源；仓库 `assets/filters/NOTICE` 已覆盖衍生归属。

## 验证

```powershell
cargo test builtin_golden_tests_pass
cargo test --test filter_quality
cargo clippy --all-targets --all-features -- -D warnings
cargo build --all-targets
cargo test
git diff --check
```

低内存环境可用 `cargo build -j1`。标准命令让 `build.rs` 构建 web，避免 `H5I_SKIP_WEB_BUILD` 与 rust-embed 产物缺失造成假失败。

## 提交计划

- 分支：`codex/feat-phpunit-output-filter`
- 提交：`feat(filters): add PHPUnit output filter`
- PR 目标：`h5i-dev/h5i:main`
- PR 关联：`Closes #204`
