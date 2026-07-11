# blind_watermark PR #179 提交记录

## 结果

- 目标仓库：`guofei9987/blind_watermark`
- PR：https://github.com/guofei9987/blind_watermark/pull/179
- 分支：`cnYui:codex/fix-odd-hex-text-extract`
- 提交：`9e66964 Fix odd-length hex text extraction`
- 关联 issue：#176

## 改动

- `blind_watermark/blind_watermark.py`
  - 新增内部函数 `_bits_to_text`
  - 在字符串水印提取时，如果 `int(...)->hex` 产生奇数长度 hex，左侧补 `0` 后再调用 `bytes.fromhex()`
  - 保留原有 `decode('utf-8', errors='replace')` 行为
- `tests/test_extract_text_decode.py`
  - 新增 unittest，覆盖 bit 串 `1111` 转成 odd-length hex `f` 的崩溃路径
- `.github/workflows/tests.yml`
  - 在现有 examples 后追加 `python -m unittest discover -s tests`

## 验证

已在 `work/blind_watermark-pr` 本地执行：

```powershell
python -m unittest tests.test_extract_text_decode -v
python -m unittest discover -s tests
python setup.py install
python examples/example_bit.py
python examples/example_img.py
python examples/example_no_writing.py
python examples/example_str.py
python examples/example_str_multi.py
git diff --check
```

结果：

- 新增 unittest 通过
- workflow 现有 examples 顺序通过
- `git diff --check` exit 0
- 本地 warning：`setup.py install` deprecation、OpenCV `imwrite_ Unsupported depth`、`att.cut_att` deprecation，均为现有验证噪声

## 远端状态

创建 PR 后即时回读：

- PR state：open
- mergeable：MERGEABLE
- statusCheckRollup：空
- `gh pr checks`：暂无 checks reported
