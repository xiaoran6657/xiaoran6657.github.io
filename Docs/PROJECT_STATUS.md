# 项目状态

更新：2026-10-28

## 当前交付

个人站已公开上线：[xiaoran6657.github.io](https://xiaoran6657.github.io)。源码位于 [GitHub 仓库](https://github.com/xiaoran6657/xiaoran6657.github.io)，默认分支 main。

首页、作品索引、XUILab 概览、三个技术案例和关于页面均有中英版本；另含根路径入口与 404，包含 BattleWall、LumaBough 与 UEFogLab 双语作品页，共 22 个 HTML 页面。主题支持自动/浅色/深色。公开身份集中于 src/data/profile.ts；中英文公开显示名均为 xiaoran6657，职业定位为游戏客户端 / 渲染工程开发；电话与邮箱按用户提供信息公开，空简历不显示。

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

## LumaBough 与公开身份更新（2026-09-22）

- 首页、索引新增第三个项目及中英文详情；介绍双后端、图编译、资源生命周期、任务与资产管线，提供双视频和公开版本入口。
- 来源 tag v0.1.0-preview，提交 f26b8b98a727532081d0793bf34c54b230cd7173；运行包构建身份独立为 5d320c773c7c9943e28fde2185204d05ca9ca19c。3 份媒体原字节镜像并保留 SHA-256 与许可。
- 性能采用 lb-current-004 的 1 INCONCLUSIVE + 3 REJECTED，无当前加速声明；保留历史身份缺口、读者验证延期与运行范围限制。未运行上游引擎实验。
- 姓名、电话、邮箱与职业定位集中配置；关于页显示电话与邮箱，页脚新增联系入口。
- 本次 npm run verify 通过：20 页面、20 媒体哈希，类型检查零错误/警告，偏好脚本通过；两段视频完整解码无错误。发布由 main 工作流执行。浏览器工具因 Windows sandbox ACL 初始化错误未能启动，不宣称浏览器视觉或播放验收通过。

## 首页层级调整（2026-09-22）

- 中英文首页及根入口移除 INSIDE XUILAB 案例区，精选作品仅按项目展示；三个案例仍归属 XUILab 详情页。
- 同步用户修改的 profile.ts：公开邮箱更新为 2334399771@qq.com。
- npm run verify 通过（20 页面、20 媒体哈希与偏好脚本）；生成页面已核对首页移除、项目页案例保留与双语邮箱链接。由 main 推送触发部署。

## XUILab 案例扩写（2026-09-22）

- 三个案例的中英文 02–04 节补充问题背景、实现流程、设计取舍、实验条件、完整结果表与解释边界；内容集中于 src/data/xuilab-details.ts。
- 05 节九张原始证据图均增加图号、读图方式、观察、限制与固定 tag 来源；逐张检查实际 PNG，未改动媒体。
- 依据公开 v0.1.0-preview.1 CASE 和协调任务的公开资料核对，保留历史候选身份、quality_limited、不确定结论及未公开历史回执边界。没有运行新的 Unity 实验。
- 本次 npm run verify 通过：20 页面、20 媒体哈希、类型检查与偏好脚本；另外检查六个案例页的完整表格、图号与双语图解。未执行浏览器视觉验收。发布由 main 工作流执行。
- 与「工作流优化」只读交叉核对后，限定池计数仅适用于虚拟 fixture；说明图内累计 Created 不能作为当前池存量的一般不变量，并补明选择器累计时间的五轮中位数口径。

## LumaBough 深度扩写（2026-09-22）

- 新增技术问题、三项实现机制与取舍、三张原始架构 SVG 及逐图解读、演示事件表、完整四项性能对照和独立运行说明。中英同步，新增页面内导航与体验/复算路径。
- 图示来自 v0.1.0-preview，已查看渲染结果并按原字节镜像；媒体总数由 20 增至 23，保留 MIT 与来源。内容位于 src/data/lumabough-details.ts。
- 继续区分源码 tag、v8 构建身份与 lb-current-004；保留无 ACCEPTED、尾部 hitch、历史源码身份、读者延期等限制。未重新运行引擎或性能采样。
- npm run verify 通过：20 个页面、23 个媒体哈希、类型检查零错误/警告与偏好脚本通过；双语图解和关键结果另行检查。未进行浏览器视觉验收，发布由 main 工作流执行。
- 与「MVP9-推进」核对公开架构、代码、配方与实验后，收窄 anchor/末帧相等结论为 Demo 事件验证运行，避免覆盖普通运行与负例。

## LumaBough 软阴影展示调整（2026-10-19）

- 首页项目卡、作品页与 About 中英同步，聚焦硬阴影、PCF、PCSS 的参数对照，以及 Cornell 风格小室的一次 Lambert 漫反射反弹；没有新增路由、框架或依赖，公开身份配置未改。
- 新素材来自公开 `v0.2.0-shadow-lab` 的 `docs/showcase/shadow-lab/`，保留 9 张颜色图与 1 张 PCSS false-color 诊断图的原始字节。独立媒体清单绑定 tag commit、来源、8 个参数、尺寸与 SHA-256；网站全部媒体为 33 份。
- 方法说明限定为固定教学盒/平面上的原生 D3D12 compute 深度生成与着色，解释世界深度 bias、每阶段采样预算、逐 tap 接收平面深度校正、中心点辐射代理与 256 方向一次反弹。没有帧率、算法加速、通用 GI 或完整 mesh 场景等声明。
- `v0.1.0-preview` 架构、双后端视频与性能材料在原页面的历史折叠区保留；旧媒体和结论的身份不改写为当前实验。Agent 参与说明与个人学习边界仍可见。
- staging 预览的完整 `npm run verify` 通过：31 个 Astro 文件零错误/警告/提示，20 个 HTML 页面、33 份媒体哈希、站内锚点及偏好脚本通过。
- 实际桌面浏览器检查了中文首屏、三方法并排图、Cornell 直接光/一次反弹对照、英文切换保留锚点及浅色主题，未见遮挡或溢出。没有进行移动端或旧视频播放验收。公开源码与运行包已发布为 `v0.2.0-shadow-lab`。

- 实际网站仓库完整 `npm run verify` 同样通过。内容提交 `ceda79e64fd2df8d6fc72a6ed1b5d9dc59f32a96` 的 [GitHub Pages build/deploy](https://github.com/xiaoran6657/xiaoran6657.github.io/actions/runs/39195018502) 成功。随后无凭据 HTTP 回读 8 个中英入口、媒体清单和 10 张原图，共 19 项通过，媒体逐字节 SHA 一致。
- 浏览器视觉检查来自本地生产预览；尝试打开线上页面两次超时，未宣称线上浏览器截图或移动端/视频播放验收。此条只记账，部署内容与受验内容一致；后续部署状态以 main 的 Actions 为准。


## UEFogLab MIT local candidate (2026-10-27)

Prepared13 overlays/13 mirrors for fixed base f67076b. New zh/en routes, fourth-project entries, sitemap and checks preserve the existing public identity, three projects and language/theme code. MIT / 2026 xiaoran6657 covers original project contributions; UE/third-party rights are retained. New MIT-captioned video/poster and compact data/provenance have new SHA. Static verify and real browser results are recorded separately in PUB-01 candidate delivery; this document does not establish deployment or phone support. The source repository is not created and no source-homepage write/main push/deployment occurs in preparation.

## UEFogLab 固定源码与主页发布（2026-10-27）

- 源码已经公开：[UEFogLab](https://github.com/xiaoran6657/UEFogLab)／[v0.1.0-preview.1](https://github.com/xiaoran6657/UEFogLab/tree/v0.1.0-preview.1)，main与tag均为`e805a290fa8bc2ed94c64d85bfa02db31e256abc`，tree`f5053683a5b060e97961602273f02e645b88ce7c`。MIT／2026 xiaoran6657；UE与第三方权利保留。
- 新中英案例与第四项目入口保留XUILab／BattleWall／LumaBough、公开profile、语言与主题实现；主页静态栈和依赖锁不变。精简结果仅更新真实发布元数据，实验数值与来源身份不变；10份MIT媒体原字节镜像，总体验证为22HTML／43媒体。
- 新候选的npm verify、Edge真实浏览器与独立门禁分别记录；main发布使用[现有Pages工作流](https://github.com/xiaoran6657/xiaoran6657.github.io/actions/workflows/deploy.yml)。推送、Actions、HTTP和线上播放分别核验，当前部署结果以实际main对应运行记录为准。
- 静帧视频48秒、原生controls／preload none／无autoplay；24fps为编码属性。Full默认、Half总雾成本更高、薄遮挡反例、不同APK、whole-frame／FPS／能耗不可用及历史SIGSEGV未定保留，未重跑上游UE／手机／性能，所有者学习另记。

## 全站显示名修订（2026-10-28，历史本地验收）

- 中英文共用公开显示名更新为 `xiaoran6657`；电话、邮箱及原有联系入口按所有者选择保留，profile 其余字段保持原值。当前源码、生成 HTML、页头／页脚、title／Open Graph／aria 与关于页已检查；公开 Git 历史保留。
- 本轮 `npm run verify` 通过：34 个 Astro 文件零错误／警告／提示，22 个 HTML、43 份媒体哈希、站内链接与偏好脚本检查通过。额外私有检查确认 107 个跟踪源文件和 22 个生成 HTML 无旧显示名，双语联系入口仍存在。
- 已安装 Edge 156.0.4314.42 的真实 headless 浏览器检查了中英首页、关于与 UEFogLab 页面，共 12 个桌面／390px 视口组合：显示名、元信息、页头／页脚及关于页联系人均通过，无全页横溢出。实际查看代表截图；这不是 headed 手工或实体手机测试。
- 内置浏览器与 Computer Use 入口均在 Windows sandbox 初始化阶段失败，没有执行 UI 输入；本轮使用现有 Edge／捆绑 Playwright，不安装新软件或修改系统设置。未修改其他项目事实、媒体、主题／语言实现或依赖锁；未运行新 UE／GPU／手机／性能实验。此条保留发布前的本地检查身份；后续实际部署见下节。


## 显示名实际发布（2026-10-28）

- 已审显示名提交 `78ffa0faaaffabca305f8f2452c939dcf688126c` 正常快进 main 并推送。[Actions 40556645610](https://github.com/xiaoran6657/xiaoran6657.github.io/actions/runs/40556645610) 的 build／deploy 均 success；Pages 返回 built／workflow／HTTPS enforced。
- 本轮匿名回读 22 个线上 HTML 全部 HTTP200，旧显示名命中0，title／Open Graph／brand aria／页脚使用账号别名；双语关于页原电话／邮箱与 tel／mailto 入口保留。旧公开 Git 历史保留。冻结的本地检查记录没有改贴为线上视觉记录。

## UEFogLab 技术讲解修订（2026-10-28，本地候选）

- 中英案例按方案选择、射线／深度裁剪、单位与 S/T／源函数／预曝光、手动HG、四邻域重建、原生对照、真机分项成本、薄遮挡反例和固定 tag 动手复现重新组织。长参数／历史源码身份收在 details；原 method／quality／native／mobile／limits 锚点保留，新增章节有对应语言入口。
- 新流程和四邻域图为代码原生教学示意；没有生成或改写实验画面。原数值 JSON、43 份媒体、视频 player 标记、公开 profile／联系人、其余三个项目、主题／语言实现和依赖锁不变。成本分项直接读取原 JSON；桌面／移动权重及 fallback 分别说明。
- 作者本地类型／构建／静态验证与真实 Edge headless 检查分开记录。桌面和390px检查了全文展开布局、公式／示意图、表格／原图独立滚动、新旧语言锚点与主题。视频保留初版完整48秒播放证据身份，本轮只作一次实际播放／暂停／继续 smoke，读取总时长48秒；没有重贴为新全程测试。不是实体手机网页或 headed 手工验收。
- 此节为本地候选，B 未合 main／未部署，仍需独立审查和实际发布后核验。没有新 UE／GPU／手机／性能实验；公开渲染源码仍为 v0.1.0-preview.1，历史版本、质量／计时不同 APK 和未解决项继续保留。


## UEFogLab 成果叙事重排（2026-10-29）

- 此轮基于已上线 7aee50d（前轮 Actions40633439364 成功）。中英正文改为已有方案、本项目实现、技术方案、效果与对比、限制与讨论五段；视频仍在开头提供成果预览。
- 主页移除整个构建／Python／读回操作教程和命令块，复现只链接固定 tag 的仓库 QUICKSTART；旧 reproduce 锚点定位文档入口。原 method／lighting／quality／native／mobile／limits 等链接和对应语言切换保留。
- 主文保留 S/T 与预曝光合成、深度引导原理、原生外观对照、同模型重建、真机误差及分项成本。坐标／单位／HG／两路径权重、历史参数和完整指标默认折叠；原生模型差异、不同 APK、Full 默认、Half 成本更高和薄遮挡漏采继续说明。
- 本地 npm run verify 通过：34 Astro 文件零诊断、22 HTML／43 媒体与偏好脚本。实际 Edge156 headless 检查中英×1440／390、全部详情展开、独立横滚、新旧语言锚点、系统深色和48秒原视频的短播放／暂停／继续。浏览器结果与静态门禁分别保存；不是实体手机网页、新全程播放或新渲染实验。
- 只修改本案例与本文件；profile／联系人、其他项目、依赖、实验 JSON、原图／视频及播放器保持。原视频是静帧剪辑，24fps 不表示实测性能，Agent 参与及本人学习边界保留。
- 本节记录作者本地检查；不替代独立审查和实际部署。最终线上版本以 main 的精确 Actions／HTTPS 内容与项目独立交接记录为准。


## M6 真实动态展示本地候选（2026-10-31）

- 以36秒真实连续引擎帧替换UEFogLab案例旧静帧主片：镜头、遮挡物、局部雾刚性平移、方向光旋转和Full64/HalfB64/HalfG64近景。新影片1080帧、1920×1280、H.264/yuv420p/faststart、无音轨；30fps仅为离线时间基准。原生VF保留TR，模型差异和手动光向同步明示。
- 独立新媒体目录m6-dynamic-20261031，旧10媒体/原tag/静态数值保持原字节。新源码增量候选f1b0a55d68dcdc4e55fcdf14a6126af86f3c4bbb，父为已公开e805a29；当前尚未推送，页面将其明确标为候选。正式部署须先发布匹配源码，不能让旧tag冒称含动态驱动。
- 中英五段正文、其他项目、profile/联系人、主题/语言实现、workflow和依赖不变。播放器保持原生controls、preload none、无autoplay和邻近双语说明。本节为作者本地候选，不登记独立接纳或线上发布；作者本地verify通过：34个Astro文件零诊断、22页、45媒体哈希及偏好脚本。真实Edge156 headless已检查中英×1440/390的无预加载、可见运动、原生播放/暂停/进度条拖动/继续、主题与语言锚点，并连续播放36秒/解码1080帧；不是实体手机或headed手工检查。最终f1b0a55入口对应的页面已再次通过全部上述浏览器检查（Edge156.0.4314.50），结果绑定于作者交接。

- 最终运行代码4dcf1c8将GT/RT演员记录改成拥有自身内容的字符串快照，并使用原子激活标记；15路/3240帧已重新采集和编码。新MP4/poster与先前作者候选逐字节一致，源映射更新到新实拍身份。旧d09ee080源码候选与旧运行证据保留为历史，不作为最终发布对象。
