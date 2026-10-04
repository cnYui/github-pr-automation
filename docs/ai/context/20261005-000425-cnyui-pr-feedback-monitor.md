# cnYui PR 反馈巡检（2026-10-05）

- 检查 open PR：45 个；仅 pyro-ppl/numpyro#2322 有新的人工反馈（juanitorduz CHANGES_REQUESTED）。
- 处理：按建议统一 Wishart `concentration` 文档为 ν > p-1，顺带修 `anaologous` 拼写；提交 3ec2ae9 推送到 cnYui/numpyro:doc/gh-2187-wishart；ruff check/format、py_compile 通过（本机无 jax，未跑测试）；已在 PR 回复。
- 可选项（validate_args/References/entropy/WishartCholesky）留待跟进。
- 其余 PR：stimela#614 仅 APPROVED、fluid#6187 仅 bot 评论，无需回复。
