# mvanhorn/last30days-skill PR 切入角度评估

## 目标

为 `mvanhorn/last30days-skill` 找一个适合提交 PR 的低风险入口。当前只做取证和方案收敛，不 fork、不提交、不开 PR。

## 仓库事实

- 仓库：`mvanhorn/last30days-skill`
- 默认分支：`main`
- 当前 main 克隆提交：`26da1e157cc83aba5b782fd3662627535e81bbc7`
- 最近提交：`chore: remove dev artifacts from installer scan surface (#465)`
- 主语言：Python
- License：MIT
- 当前热度：约 28k star，约 2.3k fork
- 本地测试基线：
  - `uv run pytest tests/test_youtube_yt.py tests/test_youtube_relevance.py` 通过
  - `uv run python -m pytest -q --tb=short` 通过

## 排除项

- `#328 INCLUDE_SOURCES None split`：当前 main 已把 `INCLUDE_SOURCES` 默认值改为 `""`，且有 `tests/test_env_include_sources_default.py` 回归测试；不适合作为 PR。
- `#456 --github ambiguous option`、`#394/#395/#396/#440/#463`：已有开放 PR 或重复 issue，重复风险高。
- `#253/#254/#255/#256`：部分 issue 依赖或事实已与当前 main 不同步，例如提到的 `sync.sh` 不在当前文件树里；容易变成考古型 PR。
- `#384 per-source return shape`：方向正确，但横切多个 source，设计面大，不适合第一刀。
- `#158 YOUTUBE_PROXY`：没有开放重复 PR，但新增 env/config 需要同步 `CONFIGURATION.md`，并触及 YouTube 热点文件；适合作为第二候选。

## 推荐入口

推荐做 `#469 Support multi-language YouTube transcript fallback (en, es, pt)`。

原因：

- 问题明确：`skills/last30days/scripts/lib/youtube_yt.py` 的 `_fetch_transcript_ytdlp()` 仍然使用 `--sub-lang en`，非英语视频在 yt-dlp 主路径下更容易没有 transcript。
- 变更集中：只需把 yt-dlp 字幕语言从 `en` 改为 `en,es,pt`，不需要新增 env var，不需要改文档。
- 已有兼容逻辑：当前代码在读取 VTT 时会 glob `f"{video_id}*.vtt"`，因此 yt-dlp 生成 `.es.vtt` 或 `.pt.vtt` 时也能读到。
- 测试路径清楚：在 `tests/test_youtube_yt.py::TestYtDlpFlags` 增加断言，确认 transcript 命令里的 `--sub-lang` 后一个参数是 `en,es,pt`。
- 无直接开放重复 PR：搜索 `#469`、`sub-lang`、`multi-language` 未发现开放 PR。

## 风险

- 有两个 YouTube transcript 相关开放 PR：
  - `#458 fix(youtube): surface yt-dlp returncode/stderr and retry transient transcript failures`
  - `#422 fix(youtube): surface SSH errors + route transcript fetch through SSH`
- 它们不解决 `#469` 的语言 fallback 问题，但会触碰同一文件甚至同一函数，所以存在 rebase/冲突风险。
- 降风险做法：保持 PR 极小，只改当前 main 的 `--sub-lang` 参数和一条单元测试；PR 描述里说明与 `#458/#422` 互补，不改变 retry、SSH、HTTP fallback 行为。

## 备选方案

### 备选 A：`#468` YouTube transcript 项不应被 relevance pruning 丢弃

价值高，但会改变 `signals.prune_low_relevance()` 的保留策略，可能把标题弱相关但 transcript 存在的视频放进最终结果。需要更细的质量验证，不适合作为第一 PR。

### 备选 B：`#158` 增加 `YOUTUBE_PROXY`

用户价值明确，且没有开放重复 PR。缺点是会新增配置面，需要同步 `CONFIGURATION.md`，还要决定 `.env` 加载到 `os.environ` 的边界；比 `#469` 更容易引发维护者设计讨论。

## 建议 PR 形状

标题：

`fix(youtube): try Spanish and Portuguese captions in yt-dlp transcript fetch`

改动：

- `skills/last30days/scripts/lib/youtube_yt.py`
  - `_fetch_transcript_ytdlp()` 中 `--sub-lang` 从 `en` 改为 `en,es,pt`
- `tests/test_youtube_yt.py`
  - 在 `TestYtDlpFlags` 增加测试：调用 `fetch_transcript()` 后检查命令包含 `--sub-lang`，且其值为 `en,es,pt`

验证：

- `uv run pytest tests/test_youtube_yt.py tests/test_youtube_relevance.py`
- 提交 PR 前按模板跑 `uv run python -m pytest -q --tb=short`

PR 说明重点：

- Fixes `#469`
- yt-dlp 支持逗号分隔语言列表，会按顺序选择可用字幕。
- 当前 `_fetch_transcript_direct()` 已有非英语 fallback；此 PR 让 yt-dlp 主路径与 direct HTTP fallback 的意图更一致。
- 不引入配置项，避免新增文档和配置优先级讨论。
