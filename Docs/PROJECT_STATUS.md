# 项目状态

更新：2026-09-17

## 当前交付

个人站已公开上线：[xiaoran6657.github.io](https://xiaoran6657.github.io)。源码位于 [GitHub 仓库](https://github.com/xiaoran6657/xiaoran6657.github.io)，默认分支 main。

首页、作品索引、XUILab 概览、三个技术案例和关于页面均有中英版本；另含根路径入口与 404，新增 BattleWall 双语作品页，共 18 个 HTML 页面。主题支持自动/浅色/深色。公开身份集中于 src/data/profile.ts；使用已确认的默认名称、职业定位及 GitHub 联系入口，空邮箱/简历不显示。

已镜像 XUILab v0.1.0-preview.1 的 12 张原图和 3 段视频，源文件 SHA-256 均通过核对。原始素材清单的 Git blob 与公开 tag 一致。XUILab 本地仓库未被修改。

## 初版交付验证（2026-09-11）

初版 XUILab 站点源码基线：`696955408a68f8ef55847f871f540eec1c6e22d1`。最新 main 的运行状态以 [Actions](https://github.com/xiaoran6657/xiaoran6657.github.io/actions/workflows/deploy.yml) 为准。

- 本地 Astro 类型检查：0 errors / warnings / hints。
- 生产构建：16 HTML 页面与 sitemap。
- 静态验证：路由、站内资源/锚点、页面语言、元数据、图片描述/尺寸、视频非自动播放策略、15 个媒体哈希。
- 生产脚本测试：系统主题、手动覆盖、持久化、中英切换、锚点/根入口查询保留与存储禁用回退。
- 独立只读检查后，修复了修改 profile.github 时可见联系地址仍为旧值的问题。
- GitHub Actions 首次 [build 和 deploy 均成功](https://github.com/xiaoran6657/xiaoran6657.github.io/actions/runs/34501257928)，使用 Ubuntu 与 Node.js 24 从 npm 锁文件构建。
- 在线 HTTP：根页面、14 个语言页面、404.html、sitemap.xml 与 robots.txt 均返回 200；不存在路径返回自定义 404。
- 在线 15 份媒体全部匹配本地 SHA-256；视频 Range 请求返回 206，具备分段传输能力。
- 本地与线上预览已交付。真实浏览器的验收范围见下方。

## BattleWall 增补（2026-09-17）

- 首页及作品列表增加第二个作品；/zh/projects/battlewall/ 与 /en/projects/battlewall/ 展示团队项目与个人参与的客户端 gameplay 工作。
- 明确非开源、团队协作及权利归属；不附源码或构建下载，不发布原始技术文档、代码片段、面试材料与简历草稿。
- 原录屏包含编辑器和日志，网页视频现并排保留两个本地连接编辑器中的可见游戏区域，保持完整时长、顺序、速度与原音轨。网页文件 37,529,505 字节，约 2 分 45 秒；原文件未改动、未提交。
- 原视频与最终裁切视频进行少量抽帧核对，最终视频全程解码无错误。封面取自演示本身，没有生成游戏画面。
- 本地 npm run verify 通过：18 个 HTML、17 项媒体哈希、路由/链接/元信息/语言和偏好脚本检查。BattleWall 媒体目录有独立白名单检查。
- 详细公开范围见 BATTLEWALL_PUBLICATION.md。发布沿用 main 自动部署，运行结果以对应 Actions 为准。

## 发布配置

GitHub Pages 使用 GitHub Actions（`build_type=workflow`），HTTPS 已启用。main 推送自动验证、构建和发布；PR 只验证。

首次推送时 GitHub 自动启用了 legacy Pages，系统生成的旧版构建失败；本站工作流成功部署后，已将发布源切换为 workflow，避免继续触发旧版构建。

## 验证边界

尚未执行真实浏览器截图、移动端布局、键盘交互和视频播放/拖动验收；构建、脚本模拟测试和 HTTP 分段检查不能替代这些。源码已实现响应式布局与减少动态效果支持，但没有声称浏览器视觉验收通过。本站没有重新运行 XUILab 实验。

## 后续维护

1. 个性化内容只改 src/data/profile.ts 中希望公开的字段。简历可放 public/，使用对应站内路径或公开 HTTPS 链接。
2. 编辑案例时同步维护中英文和来源；升级上游版本时重新核对媒体与结论。
3. npm run verify 通过后提交；main 推送将自动部署。README.md 记录了本地开发、停止预览服务和添加作品的方法。

## BattleWall 展示修订（2026-09-17）

- 恢复同一录屏的双端同时展示，页面标注同机双编辑器、本地连接；两端可见区域受原窗口重叠限制。媒体使用新文件名避免旧缓存。
- 扩充四项中英贡献：问题、流程、实现细节、场景与取舍，保持团队参与归属和非开源边界。
- 本次 npm run verify 通过：18 页面、17 媒体哈希及偏好脚本；新视频全程解码无错误，抽样核对双端画面。未执行真实浏览器播放验收。提交后由 main 工作流部署，具体结果见 Actions。
