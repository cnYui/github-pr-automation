# headroom PR #649 本地 CI/CD 验证记录

## 背景

- 目标 PR：`https://github.com/chopratejas/headroom/pull/649`
- headroom 本地工作副本：`/Users/wujianxiang/CodeSpace/github-10-pr-pr-5-pr/work/headroom`
- 分支：`codex/sse-crlf-events`
- 已推送功能提交：`c0dc6e7 fix(proxy): parse CRLF SSE event terminators`
- 当前未提交修复：`headroom/proxy/helpers.py` 仅补 2 个空行，来自 `ruff format --check .` 的格式要求。

## 已通过的本地验证

- `ruff check .`
  - 结果：通过，输出 `All checks passed!`
- `ruff format --check .`
  - 结果：通过，输出 `776 files already formatted`
- `mypy headroom --ignore-missing-imports`
  - 结果：通过，`Success: no issues found in 346 source files`
  - 备注：保留两条现有 note，提示部分 untyped function body 默认不检查。
- `pytest tests/test_sse_utf8_split.py tests/test_streaming_usage_parser.py -q`
  - 结果：通过，`13 passed in 1.31s`
- `VIRTUAL_ENV=/tmp/headroom-ci312 PATH="/tmp/headroom-ci312/bin:$PATH" PYTHON=/tmp/headroom-ci312/bin/python CARGO_BUILD_JOBS=1 make ci-precheck-python`
  - 结果：通过。
  - Rust 扩展构建与导入验证：`headroom._core build + install + verify: OK`
  - Python 预检测试：`179 passed, 1 warning in 5.02s`
- `CARGO_BUILD_JOBS=1 make ci-precheck-rust`
  - 结果：通过。
  - 覆盖：`cargo fmt --all -- --check`、`cargo clippy --workspace -- -D warnings`、`cargo test --workspace`
  - 中途第一次失败原因：`ort-sys` 下载 Pyke 预编译 ONNX Runtime 时出现瞬时 `Network is unreachable (os error 51)`。
  - 复核：`curl -I https://cdn.pyke.io/0/pyke:ort-rs/ms@1.24.2/aarch64-apple-darwin.tar.lzma2` 返回 HTTP 200 后重跑，完整通过。

## 本机未执行的 CI 部分

- Docker e2e 未执行。
  - 原因：本机 `docker --version` 输出 `command not found`。
  - 影响：`.github/workflows/ci.yml` 中 `docker-native-e2e` 相关步骤无法本地复现。
- `act` 本地 Actions 仿真未执行。
  - 原因：本机 `act --version` 输出 `command not found`。
  - 影响：无法用 act 在本机完整模拟 GitHub Actions runner。

## 环境问题与处理

- 早期 `cargo test --workspace` 在旧路径下失败过一次，关键错误是 `errno=28`，根因是系统盘只剩约 190MiB。
- 已清理 headroom 仓库内被 `.gitignore` 排除的可再生缓存：`target/`、`.mypy_cache/`、`.ruff_cache/`、`.pytest_cache/`。
- 后续在 `/Users/wujianxiang/CodeSpace/github-10-pr-pr-5-pr/work/headroom` 重新克隆远端 PR 分支并重跑验证。

## 当前状态

- headroom PR 分支代码功能验证和本地可执行 CI gate 已通过。
- 还需要把格式空行修复提交并推送到 `cnYui/headroom:codex/sse-crlf-events`，再检查 PR #649 的远端状态。
- Docker e2e 只能等 GitHub Actions 或安装 Docker 后再验证。
