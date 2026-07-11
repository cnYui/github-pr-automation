# blind_watermark #176 实施计划

## 目标

给 `guofei9987/blind_watermark` 提交一个小 PR，修复字符串水印提取时 odd-length hex 导致的 `bytes.fromhex()` 崩溃。

## 文件范围

- 修改：`blind_watermark/blind_watermark.py`
  - 增加内部函数，把 bit 串安全转换为文本
  - `mode == 'str'` 分支调用该函数
- 新增：`tests/test_extract_text_decode.py`
  - 用 `unittest` 覆盖旧崩溃路径
- 修改：`.github/workflows/tests.yml`
  - 在现有 examples 后增加 `python -m unittest discover -s tests`

## 步骤

1. 在 `work/blind_watermark-pr` 创建分支：

   ```powershell
   git switch -c codex/fix-odd-hex-text-extract
   ```

2. 新增失败测试：

   ```python
   import unittest
   import numpy as np

   from blind_watermark.blind_watermark import WaterMark


   class ExtractTextDecodeTest(unittest.TestCase):
       def test_extract_str_pads_odd_length_hex(self):
           bwm = WaterMark(password_img=1, password_wm=1)
           bwm.extract_decrypt = lambda wm_avg: wm_avg
           bwm.bwm_core.extract_with_kmeans = lambda img, wm_shape: np.array([1, 1, 1, 1])

           wm = bwm.extract(embed_img=np.zeros((4, 4, 3)), wm_shape=4, mode='str')

           self.assertEqual(wm, '\x0f')


   if __name__ == '__main__':
       unittest.main()
   ```

3. 运行失败测试，预期旧代码抛 `ValueError`：

   ```powershell
   python -m unittest tests.test_extract_text_decode -v
   ```

4. 实现最小修复：

   ```python
   def bits_to_text(bits):
       byte = ''.join(str((i >= 0.5) * 1) for i in bits)
       hex_str = hex(int(byte, base=2))[2:]
       if len(hex_str) % 2:
           hex_str = '0' + hex_str
       return bytes.fromhex(hex_str).decode('utf-8', errors='replace')
   ```

5. `WaterMark.extract()` 的 `mode == 'str'` 分支改为：

   ```python
   wm = bits_to_text(wm)
   ```

6. 工作流追加 unittest：

   ```yaml
   python -m unittest discover -s tests
   ```

7. 验证：

   ```powershell
   python -m unittest tests.test_extract_text_decode -v
   python examples/example_str.py
   git diff --check
   ```

8. 提交并推送：

   ```powershell
   git add blind_watermark/blind_watermark.py tests/test_extract_text_decode.py .github/workflows/tests.yml
   git commit -m "Fix odd-length hex text extraction"
   git push -u origin codex/fix-odd-hex-text-extract
   ```

9. 创建 PR：

   - 标题：`Fix odd-length hex text extraction`
   - 正文说明：
     - Fixes #176
     - odd-length hex 左补零，避免 `bytes.fromhex()` 崩溃
     - 不改变裁剪后水印内容准确性语义
     - 附本地验证命令
