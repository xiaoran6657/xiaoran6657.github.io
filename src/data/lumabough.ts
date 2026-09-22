import type { Localized } from './profile';
export const lumabough = {
  repo: 'https://github.com/xiaoran6657/LumaBough',
  tag: 'v0.1.0-preview',
  source: 'https://github.com/xiaoran6657/LumaBough/blob/v0.1.0-preview/',
  release: 'https://github.com/xiaoran6657/LumaBough/releases/tag/v0.1.0-preview',
  summary: {"zh":"Windows / C++20 渲染工程作品集。在 D3D11 与 D3D12 上共享 RenderPacket、Render Graph 和资源生命周期设计，将实现、动态演示与可复核证据串联起来。","en":"A Windows / C++20 rendering portfolio sharing RenderPacket, Render Graph, and resource lifetime design across D3D11 and D3D12, with implementation, dynamic demonstrations, and reviewable evidence."}
};
export const topics: { title: Localized; text: Localized }[] = [
  {
    "title": {
      "zh": "一套渲染表达，两个图形后端",
      "en": "One rendering model, two graphics backends"
    },
    "text": {
      "zh": "以 RenderPacket 描述可见对象，由 Renderer 声明 pass，Render Graph 编译依赖与资源访问，再交给 D3D11 / D3D12 adapter 执行。原生 API 类型留在后端，减少共享渲染逻辑与具体图形接口的耦合。",
      "en": "RenderPacket describes visible objects; the Renderer declares passes; Render Graph compiles dependencies and resource access; D3D11 / D3D12 adapters execute the result. Native API types stay within the backends, keeping shared rendering logic separate from graphics API details."
    }
  },
  {
    "title": {
      "zh": "资源生命周期与帧边界",
      "en": "Resource lifetimes and frame boundaries"
    },
    "text": {
      "zh": "图编译管理依赖、裁剪与瞬态资源复用。CPU 提交完成并不意味着 GPU 已完成：帧资源及退休对象需要等待完成信号。演示围绕零尺寸暂停、恢复重建和 shader 候选拒绝后的继续渲染，展示这些边界如何被验证。",
      "en": "Graph compilation manages dependencies, culling, and transient resource reuse. CPU submission does not mean GPU completion: frame resources and retired objects wait for completion signals. The demos exercise zero-size suspension, restoration, and continued rendering after rejection of a shader candidate."
    }
  },
  {
    "title": {
      "zh": "确定性任务与异步资产",
      "en": "Deterministic tasks and asynchronous assets"
    },
    "text": {
      "zh": "worker 从冻结快照构建 packet，主线程在使用前等待任务组，并按稳定键合并结果，避免完成顺序改变提交语义。资产离线烘焙；运行时将专用 I/O、CPU decode 与帧点预算内的 GPU 上传分开组织。",
      "en": "Workers build packets from frozen snapshots. The main thread waits before consumption and merges results by stable keys so completion order does not change submission semantics. Assets are cooked offline; runtime loading separates dedicated I/O, CPU decoding, and GPU upload within a frame budget."
    }
  },
  {
    "title": {
      "zh": "把结论与证据一起交付",
      "en": "Shipping conclusions with evidence"
    },
    "text": {
      "zh": "源码、运行包和性能实验保留各自身份。公开预览版提供双后端视频、Windows 运行包与去标识逐帧数据；固定协议下的负结果和不确定结果同样保留，便于读者区分实现能力、运行验证与性能收益。",
      "en": "Source, runtime packages, and performance experiments retain separate identities. The public preview includes dual-backend videos, a Windows runtime package, and de-identified per-frame data. Negative and inconclusive results remain available, separating implementation, runtime validation, and performance benefits."
    }
  }
];
