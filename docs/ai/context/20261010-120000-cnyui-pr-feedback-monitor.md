# cnYui PR 反馈巡检（2026-10-10）

- 检查 open PR 共 46 个（gh search，跨仓）。
- 新反馈仅 1 条需处理：pyro-ppl/numpyro#2336（juanitorduz 已 APPROVE，附 4 条非阻塞 docs nit）。
  - 自动修复：cac7537 推送到 cnYui/numpyro:doc/projected-normal-math；ruff check/format、git diff --check、log_prob 冒烟均通过；未重跑 Sphinx/全量测试。
  - 已在 PR 回复：https://github.com/pyro-ppl/numpyro/pull/2336#issuecomment-6091422523
- caracal-pipeline/stimela#614：JSKenyon 已 APPROVE（无评论）；build 3.9–3.13 失败（旧 run，约 13s，疑似基础设施/上游问题），未处理。
- 其余 PR 无 cnYui 最后回复之后的新人类反馈。无已合并/关闭。
