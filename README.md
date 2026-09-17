# xiaoran6657.github.io

中英双语个人技术作品集。首个作品是 [XUILab](https://github.com/xiaoran6657/XUILab)，展示 Unity UGUI 列表、渐变和确定性 Benchmark 的实现、演示与实验边界。

**Website:** https://xiaoran6657.github.io
**Stack:** Astro 7 · TypeScript · 原生 CSS · 静态 HTML · GitHub Pages

## 本地开发

要求 Node.js 22.12+（CI 使用 Node.js 24）与 npm。

```powershell
npm ci
npm run dev
```

终端会显示实际预览地址。Astro 7 在后台运行开发服务，可用 `npx astro dev status` 查看状态，用 `npx astro dev stop` 停止。

```powershell
npm run verify
npm run preview
```

`verify` 执行 Astro 类型检查、生产构建、18 个 HTML 页面与站内资源/锚点检查、17 份媒体哈希校验，以及生产脚本的主题和语言偏好测试。它不等同于真实浏览器视觉/视频播放验收。

## 修改公开身份

编辑 **`src/data/profile.ts`**：

- `name.zh/en`：公开名字。
- `role.zh/en`：职业定位。
- `bio.zh/en`：简介。
- `github`：GitHub 联系入口。
- `email`：公开邮箱；空字符串时不显示。
- `resume.zh/en`：简历链接；空字符串时不显示。可以填 HTTPS 链接，或把自己的 PDF 放进 `public/` 后填 `/resume.pdf`。

默认名字为 xiaoran6657，定位为“Unity / UI 工程探索”，只公开 GitHub。没有自动取用本地简历、姓名或私人联系方式。

## 修改作品内容

- `src/data/xuilab.ts`：案例中英文文案及固定版本源码链接。
- `src/components/ProjectFeature.astro`：XUILab 首页展示。
- `src/pages/[lang]/projects/xuilab/`：概览与三个案例路由。
- `src/styles/global.css`：布局、配色和响应式规则。

新作品可先增加自己的结构化数据、项目卡片和详情页，同时更新 sitemap 与验证脚本的路由清单。不要用空白占位作品填充页面。

## 语言与主题

- `/zh/` 和 `/en/` 为独立静态页面，深层链接可直接访问。
- 根地址按已保存偏好或浏览器语言跳转；无 JavaScript 时保留可阅读的中文首页。
- 切换语言保留当前页面及锚点。显式语言地址优先于保存偏好。
- 主题按钮依次切换“自动 → 浅色 → 深色”；默认随系统/浏览器，手动选择保存在当前浏览器。
- 存储不可用时仍可阅读和切换，不会阻断页面。
- 原始证据图片保留英文标注；网站文案与视频文字说明提供中英文。

## XUILab 素材

媒体来自公开版本 `v0.1.0-preview.1`，本地镜像保留原始字节，网页不依赖 XUILab 本机目录或外部媒体热链接。12 张 PNG 和 3 段 MP4 都有 SHA-256 清单。

如需从原仓库重新导入同版本素材：

```powershell
node scripts/import-xuilab.mjs 'G:\Programming\XUILab'
npm run verify
```

这只读取上游，且先核对版本和每项文件哈希。更新到新版本前必须同步审查文案、测量边界、许可与清单。

参见 [素材与许可](Docs/THIRD_PARTY_NOTICES.md)。视频为 45 秒无音轨、帧驱动技术演示，不能当成实时性能录像。

## 自动发布

`main` 的推送触发 `.github/workflows/deploy.yml`，在 Ubuntu + Node.js 24 中执行 `npm ci` 和全部验证，再发布 `dist/`。PR 只验证，不发布。

GitHub 仓库 Settings → Pages → Source 使用 **GitHub Actions**。站点以用户根域部署，Astro 不设置子目录 `base`。站内无后台、无表单收集、无分析追踪。

## 项目资料

- [项目范围](Docs/PROJECT_BRIEF.md)
- [设计与路由](Docs/DESIGN.md)
- [当前状态与后续维护](Docs/PROJECT_STATUS.md)

## BattleWall（非开源团队作品）

第二个作品入口为 /zh/projects/battlewall/ 与 /en/projects/battlewall/。内容配置在 src/data/battlewall.ts，首页卡片为 src/components/BattleWallFeature.astro。

仅公开个人贡献摘要、裁切压缩的游戏演示与封面。原始技术资料含实现代码，面试准备材料也不适合直接发布，因此均未复制或提交。游戏及媒体不适用 XUILab 的 MIT 许可，权利归各自权利人所有。网页视频保留完整时长和原速，裁去编辑器、工程目录与日志区域；不作为性能或联机正确性证据。
