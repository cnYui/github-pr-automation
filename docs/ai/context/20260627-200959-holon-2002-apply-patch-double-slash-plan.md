# holon#2002 apply_patch 双斜杠绝对路径修复计划

## 背景

- 上游仓库：`holon-run/holon`
- 工作目录：`D:\CodeWorkSpace\github-10-pr-pr-5-pr\work\holon-2002`
- Issue：`https://github.com/holon-run/holon/issues/2002`
- 目标分支：`codex/fix-apply-patch-double-slash-absolute-path`

## 问题边界

`src/tool/apply_patch.rs` 的 `strip_diff_prefix` 会处理 git diff 风格的 `a/` 和 `b/` 路径前缀。本次只修复并固定明确的双斜杠绝对路径兼容语义：

- `a/src/foo.rs` 保持普通相对路径语义，结果为 `src/foo.rs`
- `b/src/foo.rs` 保持普通相对路径语义，结果为 `src/foo.rs`
- `a//home/foo.rs` 结果为 `/home/foo.rs`
- `b//home/foo.rs` 结果为 `/home/foo.rs`
- `a/home/foo.rs` 结果为 `home/foo.rs`，不能猜测成 `/home/foo.rs`

## 设计

最小方案是在 `strip_diff_prefix` 层写直接单元测试，并把实现改为显式检查 `a//`、`b//`、`a/`、`b/` 的顺序。这样行为和 issue 限制在字符串前缀层表达清楚，不依赖 Windows 或 Unix 的绝对路径判定差异，也不触碰 `resolve_patch_path`、patch parser 或文件系统写入逻辑。

不采用在 `resolve_patch_path` 中根据 `home/...` 猜绝对路径的方案，因为 `a/home/...` 无法和真实相对路径区分，且会破坏标准 `patch -p1` 语义。

## TDD 计划

1. 在 `src/tool/apply_patch.rs` 的测试模块中新增最小测试 `strip_diff_prefix_preserves_only_double_slash_absolute_paths`。
2. RED：测试先期望 `a//home/foo.rs`、`b//home/foo.rs` 保留为 `/home/foo.rs`，并固定 `a/home/foo.rs` 仍为 `home/foo.rs`。
3. GREEN：把 `strip_diff_prefix` 改成显式匹配 `a//`、`b//`、`a/`、`b/`，仅恢复明确 double slash absolute path。
4. 运行目标测试：`cargo test tool::apply_patch::tests::strip_diff_prefix_preserves_only_double_slash_absolute_paths`。
5. 运行相关测试：`cargo test tool::apply_patch::tests::apply_patch_preserves_relative_path_semantics tool::apply_patch::tests::apply_patch_supports_absolute_path_headers tool::apply_patch::tests::apply_patch_strips_prefixed_absolute_add_paths`，必要时改用逐条命令。
6. 运行目标仓要求验证：`cargo fmt --all -- --check`、`RUSTFLAGS="-D warnings" cargo check --all-targets`、`make test`、`git diff --check`。

## 风险

当前上游 main 的简单 `strip_prefix("a/")` 对 `a//home/...` 字符串本身已经会返回 `/home/...`。如果新增测试无法形成 RED，说明 issue 目标行为已被现有实现满足；届时不硬造行为改动，只提交更清晰的边界测试和等价显式实现，或在无可提交价值时停止并报告阻塞。
