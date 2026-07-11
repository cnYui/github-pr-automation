# blind_watermark #176 PR 设计

## 背景

目标仓库：`guofei9987/blind_watermark`

当前仓库状态：

- 默认分支：`master`
- 主要语言：Python
- open PR：4 个，未发现覆盖 `bytes.fromhex` 奇数长度容错的 PR
- 相关 open issue：#176、#133、#129 都指向字符串水印提取时 `bytes.fromhex()` 崩溃或提取失败

## 问题

`WaterMark.extract(..., mode='str')` 当前把提取出的 bit 串转成整数，再转成 hex：

```python
bytes.fromhex(hex(int(byte, base=2))[2:]).decode('utf-8', errors='replace')
```

当攻击、裁剪、平移或误码导致 hex 字符串长度为奇数时，`bytes.fromhex()` 会直接抛 `ValueError`。裁剪后的水印内容可能仍然是乱码，但库不应该因为 hex 长度不满足格式要求而崩溃。

## 备选方案

1. 只在 hex 长度为奇数时左侧补 `0`
   - 优点：最小改动，直接覆盖 #176，保持原有返回字符串行为。
   - 缺点：不能修复裁剪后内容不准确的问题，只避免崩溃。

2. 重写字符串水印编码/解码，让 bit 长度按 8 位对齐
   - 优点：更系统。
   - 缺点：可能改变历史行为，影响已有水印兼容性，风险偏大。

3. 捕获 `ValueError` 并返回空字符串或错误提示
   - 优点：不会崩溃。
   - 缺点：吞掉可恢复内容，行为不如补零直观。

## 选择

采用方案 1：增加一个小的内部转换函数，把 bit 串转文本前的 hex 长度补齐到偶数。这个 PR 只解决解码格式崩溃，不宣称提升裁剪、旋转、AI 去水印等攻击鲁棒性。

## 测试设计

- 新增 `tests/test_extract_text_decode.py`
- 用 `unittest`，避免引入 pytest 依赖
- 构造 `WaterMark`，替换 `extract_decrypt` 和 `bwm_core.extract_with_kmeans`，让 `extract(..., mode='str')` 走真实字符串解码路径
- 回归用例：bit 串 `1111` 会转成 hex `f`，旧代码抛 `ValueError`，新代码返回 `'\x0f'`

## 计划

1. 新建分支 `codex/fix-odd-hex-text-extract`
2. 写失败测试并确认旧代码失败
3. 最小实现 hex 奇数长度左补零
4. 运行目标 unittest
5. 运行现有示例级验证中成本较低的 `examples/example_str.py`
6. 提交、推送并创建 PR，PR 描述注明 `Fixes #176`
