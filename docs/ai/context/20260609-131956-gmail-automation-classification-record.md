# Gmail 通知分类巡检自动化记录

## 背景

用户要求创建一个每 2 小时检查 Gmail 新通知和未读通知的定时任务，并先用简单规则落地，再通过 Chrome 只读查看实际邮箱结构后修正分类规则。

已创建并更新 Codex automation：

- automation id：`gmail`
- 名称：`Gmail 通知分类巡检`
- 频率：`FREQ=HOURLY;INTERVAL=2`
- 执行环境：`local`
- 工作目录：`D:\CodeWorkSpace\github-10-pr-pr-5-pr`

## 只读抽样观察

Chrome 中 Gmail 已登录，抽样只读取列表层面的发件人、主题、时间和 Gmail 标签，不打开附件、不点击外链、不发送或修改邮件。

观察到的邮箱结构：

- 收件箱未读量很大，抽样时显示约 2792 封未读。
- Gmail 顶部标签有「主要 / 推广 / 社交 / 动态」，抽样时分别出现推广 5 个新会话、社交 1 个新会话、动态 2 个新会话。
- 左侧还有「购物」标签，抽样时显示 47 封未读。
- GitHub、CI、PR、review bot、CLA、Vercel 等工作流邮件会混在「主要」和其他 Gmail 标签里，不能依赖 Gmail 自带标签分类。
- 其他高频类型包括：Google/账号安全提醒、GitHub token 到期、学校/合同/网络服务通知、LinkedIn/Instagram/note/Reddit 社交通知、AI/开发 newsletter、活动/hackathon/webinar、购物和广告促销。

## 分类决策

定时任务改为按业务含义分类，而不是按 Gmail 标签分类：

- P0 账号/安全/权限：登录提醒、数据共享、token 到期、验证码、异常登录、权限或支付安全。
- P0 GitHub/PR/CI 需要动作：review/comment、CI failed、CLA、Vercel 授权、auto-closed、merged/closed、maintainer 回复。
- P1 学校/合同/生活行政：学校、Sun-Net、PayPay、合同到期、账单、申请未完成。
- P1 直接消息/潜在合作：LinkedIn 私信、个人直接来信、招聘/合作/商务邀约。
- P2 活动/机会：Devpost、Hugging Face、Luma、NVIDIA/Red Hat/Neo4j 等活动或 hackathon。
- P2 技术产品更新/行业资讯：Supabase、Anaconda、Product Hunt、AI newsletter、WSJ/技术新闻。
- P3 创作者/社交互动：note 点赞、Instagram、Reddit 等普通通知。
- P3 促销/购物/广告：Spotify、Mercari、Adobe、购物促销、赞助商广告；只有账单、订单、到期或异常时才提升优先级。

## 边界与取舍

- 任务只读执行，不发送邮件、不删除/归档、不标记已读、不打开附件、不点击外链。
- 如果遇到登录、验证码、CAPTCHA 或权限页面，停止并报告需要用户处理。
- automation 没有可靠持久状态时，不假装知道“上次运行后新增”；报告中要明确按当前可见新邮件、近期未读或 Gmail 新会话提示判断。
- 同一线程、同一 PR 或同一 CI 事件需要去重，避免重复噪声。
