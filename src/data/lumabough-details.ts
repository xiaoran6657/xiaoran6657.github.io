import type { Localized } from './profile';
interface Chapter { file: string; title: Localized; question: Localized; implementation: Localized; tradeoff: Localized; reading: Localized; boundary: Localized; }
export const chapters: Chapter[] = [
  {
    "file": "context",
    "title": {
      "zh": "让两个后端共享语义，而不是共享所有实现",
      "en": "Share semantics across backends, not every implementation"
    },
    "question": {
      "zh": "D3D11 的即时上下文与 D3D12 的显式提交和资源状态不同。若过早抽象，很容易把其中一个 API 的方便行为误当成通用契约。项目选择先让两种后端实际工作，再提炼共享 RHI、adapter 与 factory。",
      "en": "D3D11 uses an immediate context while D3D12 makes submission and resource states explicit. Abstracting too early risks treating one API’s conveniences as universal contracts. The project first implemented working backends, then extracted a shared RHI, adapters, and factory."
    },
    "implementation": {
      "zh": "World 提取 RenderPacket，Renderer 声明 pass 和资源用途，Render Graph 编译依赖、裁剪及生命周期计划，最终由后端执行命令。Core 不依赖 World / Assets / Render，Tasks 负责 CPU 调度，Render Graph 只链接 public RHI；native API 类型留在后端。AssetCooker 离线处理源 glTF 和纹理，运行时读取烘焙格式，避免将完整导入解析链带入每次运行。",
      "en": "World extracts RenderPacket data, the Renderer declares passes and resource use, and Render Graph compiles dependencies, culling, and lifetime plans before backend execution. Core does not depend on World / Assets / Render; Tasks handles CPU scheduling; Render Graph links only public RHI, keeping native API types inside backends. AssetCooker handles source glTF and textures offline so runtime reads cooked formats without carrying the full import chain."
    },
    "tradeoff": {
      "zh": "共享的是资源、提交、读回和失败语义，不是“同名函数天然等价”。adapter 与部分历史 concrete 路径仍有维护成本；新增后端需要真实需求和边界测试，不能因预留接口就宣称已支持 Vulkan。",
      "en": "Resource, submission, readback, and failure semantics are shared; matching function names do not establish equivalence. Adapters and some historical concrete paths carry maintenance costs. New backends require real requirements and boundary tests, not capability claims inferred from reserved interfaces."
    },
    "reading": {
      "zh": "按蛇形箭头阅读：上排从源资产进入离线烘焙、版本化数据与运行时；右侧向下连接场景，再沿下排向左经过 graph / packets、后端和 Windows / DXGI。蓝色是项目实现，灰色为外部基础或输入，绿色为数据或生命周期边界。",
      "en": "Follow the arrows across the top from source assets through offline cooking, versioned data, and runtime; then down through the scene and left across graph/packets, backends, and Windows/DXGI. Blue denotes project code, gray external foundations or inputs, and green data/lifetime boundaries."
    },
    "boundary": {
      "zh": "图 1 是静态模块与数据流说明，不是完整 CMake 链接图，也不是所有节点之间都直接调用。它说明工具产出数据、后端执行命令的分工，不证明完整 glTF 支持或通用编辑器能力。",
      "en": "Figure 1 explains static modules and data flow, not every CMake linkage or direct call. It separates data-producing tools from command-executing backends without claiming full glTF support or a general-purpose editor."
    }
  },
  {
    "file": "frame",
    "title": {
      "zh": "并行构建 packet，保持提交顺序可重复",
      "en": "Build packets in parallel while preserving submission order"
    },
    "question": {
      "zh": "worker 的完成顺序不可预测，但渲染排序和资源访问必须稳定。同时，CPU 已经提交一帧，并不意味着 GPU 已经结束使用这帧的资源。任务同步与资源退休因此是两个不同问题。",
      "en": "Worker completion order is unpredictable, but rendering order and resource access must remain stable. Likewise, CPU submission does not mean the GPU has finished using frame resources. Task synchronization and resource retirement are separate problems."
    },
    "implementation": {
      "zh": "worker 只读冻结输入并局部构建 packet；主线程在消费前等待对应 task group，再按稳定键合并，而不是按任务完成顺序提交。Renderer 声明资源访问，图编译生成顺序与生命周期计划，执行器转换访问并调用 RHI。帧资源和退休对象等待 GPU 完成信号后才能回收；零尺寸走跳过路径，恢复后重建相关资源。",
      "en": "Workers read frozen input and construct local packets. The main thread waits for the corresponding task group before consumption and merges by stable keys rather than task completion order. Declared resource accesses become graph order and lifetime plans, which the executor translates into RHI calls. Frame resources and retired objects wait for GPU completion before reclamation. Zero-size rendering follows a skip path; restoration rebuilds affected resources."
    },
    "tradeoff": {
      "zh": "并行也付出调度、等待与合并成本。CPU packet 构建并行不等于多个线程随意调用 RHI，更不等于多 GPU queue 并行。需要通过语义/顺序验证及适合的工作负载判断收益；当前性能实验没有获得 ACCEPTED 加速结论。",
      "en": "Parallel construction adds scheduling, waiting, and merging overhead. CPU packet parallelism is neither unrestricted concurrent RHI calls nor multi-GPU-queue execution. Benefits require equivalent semantics and suitable workloads; the current experiment produced no ACCEPTED speedup."
    },
    "reading": {
      "zh": "图 2 上排从输入、可见性进入图构建与编译；下排从右向左依次是 packet 记录、确定性合并、队列提交、呈现和回收。“Compile graph”与“Present + collect”突出计划和完成边界。串行与 worker 记录是可选路径，最终执行仍由后端负责。",
      "en": "Figure 2 moves from input and visibility to graph construction and compilation along the top, then right-to-left through packet recording, deterministic merge, submission, presentation, and collection. Compile graph and Present + collect emphasize planning and completion boundaries. Serial versus worker recording is optional; execution remains backend-owned."
    },
    "boundary": {
      "zh": "图中的箭头是执行依赖，不是每阶段耗时，也不能从框的大小判断瓶颈。设备丢失会显式失败，恢复窗口尺寸不等同于自动恢复丢失的图形设备。",
      "en": "Arrows express ordering, not stage timings; box sizes do not identify bottlenecks. Device loss fails explicitly. Restoring window size is not automatic recovery of a lost graphics device."
    }
  },
  {
    "file": "assets",
    "title": {
      "zh": "分开管理请求、revision 和 GPU 使用期限",
      "en": "Separate requests, revisions, and GPU usage lifetimes"
    },
    "question": {
      "zh": "加载新资产时，旧资源可能仍在被画面使用。磁盘读完不等于解码完成，CPU 数据准备好也不等于 GPU 已可用；失败的新请求更不应该直接抹掉仍可用的旧资源。",
      "en": "An old asset may still be in use while its replacement loads. Completed disk I/O is not completed decoding, and CPU-ready data is not GPU readiness. A failed replacement request should not erase an existing usable resource."
    },
    "implementation": {
      "zh": "专用 I/O 线程读取烘焙字节，CPU worker 负责 decode，上传协调器在帧点接受预算约束，由渲染线程提交 GPU 资源创建与上传。revision 匹配才替换 Ready；缺文件、解析失败或过期请求保留旧 Ready。请求记录在终态释放，仍被 GPU 使用的资源则等 fence 完成后退休。",
      "en": "A dedicated I/O thread reads cooked bytes; CPU workers decode them; an upload coordinator applies a frame-point budget before rendering-thread resource creation and upload. Ready resources are replaced only when revisions match. Missing files, parse failures, or stale requests preserve the old Ready state. Terminal request records are released separately from GPU resources, which retire after fence completion."
    },
    "tradeoff": {
      "zh": "需要显式状态、队列、背压、取消及 shutdown 收尾。容量上限是护栏，不能代替调用方正常释放。历史瞬态池指标稳定并未覆盖全部进程记录，因而不能写成“零泄漏”；该设计也不承诺任意规模的流式场景更快。",
      "en": "Explicit states, queues, backpressure, cancellation, and shutdown cleanup are required. Capacity limits are guardrails, not substitutes for caller release. Historically stable transient-pool metrics did not cover every process record and cannot establish zero leaks; the design also does not promise faster streaming at every scale."
    },
    "reading": {
      "zh": "图 3 从请求身份出发，沿上排经过 I/O、decode 和 CPU payload；随后向下进入渲染线程提交，再向左经过上传、GPU Ready 与 fence 后退休。CPU Ready 和 GPU Ready 是两个不同绿色节点，正对应不能合并的两个就绪条件。",
      "en": "Figure 3 starts at request identity, crosses I/O, decoding, and CPU payload readiness, then descends to render-thread commit and moves left through upload, GPU readiness, and post-fence retirement. The separate green CPU Ready and GPU Ready nodes represent distinct readiness conditions."
    },
    "boundary": {
      "zh": "这是一条职责与所有权链，不是 CPU/GPU 时间线或多个 GPU 队列的并行图。图示依据公开架构与决策文档；每项故障或取消路径是否通过，仍需对应测试记录，不能由这张图推定。",
      "en": "This is a responsibility and ownership chain, not a CPU/GPU timeline or a diagram of concurrent GPU queues. It follows public architecture and decision documents; passing fault or cancellation paths still requires corresponding test records."
    }
  }
];
export const demoEvents: Localized[][] = [
  [
    {
      "zh": "固定场景与 anchor",
      "en": "Fixed scene and anchor"
    },
    {
      "zh": "先建立动作前画面；视频协议的逻辑锚点为 portfolio-capture。",
      "en": "Establish the pre-change image with the logical portfolio-capture anchor."
    },
    {
      "zh": "用于前后状态核对，不是自由相机或复杂动画演示。",
      "en": "Supports before/after checks, not free-camera navigation or animation."
    }
  ],
  [
    {
      "zh": "零尺寸暂停",
      "en": "Zero-size suspension"
    },
    {
      "zh": "程序将 RHI extent 设为 0×0，走跳过绘制路径。",
      "en": "The program sets RHI extent to 0×0 and follows the skip path."
    },
    {
      "zh": "不等同于用户最小化 OS 窗口，也不代表设备丢失。",
      "en": "Not OS-window minimization or device loss."
    }
  ],
  [
    {
      "zh": "临时尺寸与有效候选",
      "en": "Temporary size and valid candidate"
    },
    {
      "zh": "恢复到临时 extent，使用相同 shader bytecode 重建 pipeline。",
      "en": "Restore at a temporary extent and rebuild pipelines with the same shader bytecode."
    },
    {
      "zh": "展示重建合同，不是新 shader 效果；视频配方使用更明显的临时尺寸与停留。",
      "en": "Exercises rebuilding, not a new shader effect; the video recipe uses a more visible size change and holds."
    }
  ],
  [
    {
      "zh": "拒绝无效候选",
      "en": "Reject an invalid candidate"
    },
    {
      "zh": "提交空 bytecode，预期拒绝并保留原 pipeline，之后继续呈现。",
      "en": "Submit empty bytecode, reject it, retain existing pipelines, then continue presenting."
    },
    {
      "zh": "视频字幕延长停留帮助阅读，不据视频时长估算实际失败处理耗时。",
      "en": "Caption holds aid reading; their duration is not failure-handling latency."
    }
  ],
  [
    {
      "zh": "恢复与退出",
      "en": "Restore and exit"
    },
    {
      "zh": "恢复原尺寸并干净退出；记录 resizeCount=3、reloadSuccess=1、reloadRejected=1。",
      "en": "Restore the original extent and exit cleanly; records include resizeCount=3, reloadSuccess=1, and reloadRejected=1."
    },
    {
      "zh": "按同一运行的 anchor 与末帧核对；跨机器语义哈希一致不表示跨 GPU 像素逐位相同。",
      "en": "Compare anchor and final frame within the same run; cross-machine semantic hashes do not imply bit-identical pixels across GPUs."
    }
  ]
];
export const comparisons: string[][] = [
  [
    "packet-serial → packet-parallel",
    "70.158",
    "58.299",
    "−16.90%",
    "INCONCLUSIVE"
  ],
  [
    "stream-sync → stream-async",
    "35.168",
    "35.769",
    "+1.71%",
    "REJECTED"
  ],
  [
    "stream-async → stream-parallel",
    "35.769",
    "35.759",
    "−0.03%",
    "REJECTED"
  ],
  [
    "stream-sync → stream-parallel",
    "35.168",
    "35.759",
    "+1.68%",
    "REJECTED"
  ]
];
export const findings: { title: Localized; text: Localized }[] = [
  {
    "title": {
      "zh": "为什么下降 16.90%，仍不能宣称加速？",
      "en": "Why a 16.90% reduction is not an accepted speedup"
    },
    "text": {
      "zh": "packet 比较中候选运行的时间漂移为 +3.25%，超过 3% 噪声阈值；按预注册顺序先判 INCONCLUSIVE。CPU p95 下降 18.68%、GPU 变化 −0.40%、residentBytes 不变，也不能跳过这个门槛。另一个受保护的尾部 hitch 比例为 3.37%，超过允许的 1.03%。中位数更低、协议是否接受，是两个不同结论。",
      "en": "The packet candidate drifts by +3.25%, exceeding the 3% noise threshold, so the preregistered order first returns INCONCLUSIVE. A CPU p95 reduction of 18.68%, a −0.40% GPU change, and unchanged residentBytes do not override that gate. The protected tail-hitch rate is also 3.37%, above the allowed 1.03%. A lower median and an accepted result are different conclusions."
    }
  },
  {
    "title": {
      "zh": "为什么 streaming 的结果是 REJECTED？",
      "en": "Why the streaming comparisons are REJECTED"
    },
    "text": {
      "zh": "三个 streaming 比较的漂移与受保护指标通过，但主指标改善不足：异步相对同步增加 1.71%，并行相对异步只下降 0.03%。这些数据不支持默认开启异步/并行就能改善总 CPU 帧时间。它们没有否定架构用途，但要求将性能建议限定到测过的负载与成本占比。",
      "en": "The three streaming comparisons pass drift and protected-metric gates but fail to improve the primary metric sufficiently: asynchronous versus synchronous is +1.71%, and parallel versus asynchronous is only −0.03%. These data do not support enabling asynchronous/parallel work by default to reduce total CPU frame time. They do not invalidate the architecture, but constrain performance recommendations to measured workloads and cost distributions."
    }
  },
  {
    "title": {
      "zh": "有效数据不等于正结果",
      "en": "Valid data can support a negative result"
    },
    "text": {
      "zh": "前三组因前台比例或采样前就绪超时成为 INVALID；没有替换失败运行，也没有拼接不完整区组。004 的 25/25 有效运行才进入四项比较。公开证据包保留逐帧输入、协议、组记录与分析器，可复算同一结论；这是已有实验的去标识副本，不是一次新测量。",
      "en": "The first three attempts were INVALID because of foreground coverage or pre-sampling readiness timeouts; failed runs were not replaced and incomplete blocks were not stitched together. Only attempt 004’s 25 valid runs entered the four comparisons. The public package retains per-frame inputs, protocol, group records, and analyzer for recomputation. It is a de-identified copy of an existing experiment, not a new measurement."
    }
  }
];
