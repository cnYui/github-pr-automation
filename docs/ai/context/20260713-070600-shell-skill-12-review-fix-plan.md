# shell-skill #12 评审修复计划

## 背景

`gemini-code-assist[bot]` 在 2026-07-12 对 `posidoni/shell-skill#12` 指出：仓库显式支持的 Bash 3.2 不会在 `main() ( ... )` 这种 subshell 函数退出时执行内部定义的 `EXIT` trap。因此示例结束后会残留临时目录。

## 方案

仅调整 `examples/bash/04-nullglob-empty-match.good.sh`：把临时目录创建和 `EXIT` trap 移到脚本全局作用域，保留 `main` 的 subshell 形式和示例的 glob 行为。新增或扩展与该示例直接相关的验证，确认运行后临时目录已清理，并在 Bash 3.2 兼容范围内使用既有语法。

## 验证

先复现当前脚本结束后留下的目录，再运行修改后的示例、相关仓库测试（若存在）和 `git diff --check`。只提交该示例及必要测试文件，不改主控仓应用代码。

## 风险

全局 `EXIT` trap 会在脚本任何退出路径触发，因此临时目录变量必须在 trap 注册前完成初始化，且仅删除由脚本自身创建的目录。
