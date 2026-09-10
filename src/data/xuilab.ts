import type { Localized } from './profile';
export const release = 'v0.1.0-preview.1';
export const repo = 'https://github.com/xiaoran6657/XUILab';
export const source = repo + '/tree/' + release;
export const docs = repo + '/blob/' + release + '/Docs/Showcase/';
export const downloads = repo + '/releases/tag/' + release;

export interface Case {
  slug: string;
  number: string;
  title: string;
  topic: Localized;
  summary: Localized;
  question: Localized;
  approach: Localized;
  result: Localized;
  limit: Localized;
  folder: string;
  video: string;
  steps: Record<'zh' | 'en', string[]>;
  images: { file: string; caption: Localized }[];
}
export const cases: Case[] = [
  {
    slug: 'list-lab', number: '01', title: 'List Lab', folder: 'ListLab', video: 'list',
    topic: { zh: '虚拟列表与更新策略', en: 'Virtual lists & update strategies' },
    summary: { zh: '从普通列表到虚拟列表，拆开数据量、可见窗口与对象池，比较整窗刷新和目标索引刷新。', en: 'Separate data size, the visible window, and pooled objects. Compare full-window refresh with a targeted index update.' },
    question: { zh: '只修改一项数据时，是否有必要刷新整个可见窗口？列表规模变大时，实例数量应如何受控？', en: 'When one item changes, does the entire visible window need a refresh? How should object counts stay bounded as the dataset grows?' },
    approach: { zh: '以固定行高列表为实验场景，分别实现普通列表、虚拟列表、对象池和滚动位置恢复。Window 与 TargetOnly 是可比较的备选更新策略；数据量、可见数量、租借实例与缓存实例分别计数。', en: 'Use fixed-height rows to compare normal and virtual lists, with pooling and scroll restoration. Window and TargetOnly are alternative update strategies; data, visible rows, rented instances, and cached instances are counted separately.' },
    result: { zh: '50 次有效独立 Player 运行，构成 5 组对照：3 组 improved，2 组 inconclusive。完整图表保留每组全部 5 轮的 p95 中位数与轮间范围。', en: '50 valid independent Player runs across five comparisons: three improved and two inconclusive. The complete chart retains the median p95 and range across all five repeats.' },
    limit: { zh: '结论限定于已测的固定行高场景，另有 6 组未测。演示画面显示 8 行，而正式采样 fixture 为 9 行，二者不能混用计数。Window 和 TargetOnly 不能合并成一条性能结论。', en: 'Results apply to the measured fixed-height scenarios; six other groups were not measured. The demo shows eight visible rows, while the sampling fixture uses nine. Window and TargetOnly must remain separate comparisons.' },
    steps: { zh: ['0–15 秒：普通列表从首滚动到尾。', '15–30 秒：虚拟列表重复滚动。', '30 秒后：TargetOnly 更新、保存与恢复位置、重新打开。'], en: ['0–15 s: scroll the normal list from start to end.', '15–30 s: repeat the scroll with the virtual list.', 'After 30 s: targeted updates, save and restore position, then reopen.'] },
    images: [
      { file: 'performance', caption: { zh: '全部已测列表对照：p95 中位数与轮间范围。', en: 'All measured list comparisons: median p95 and ranges across repeats.' } },
      { file: 'pool-contract', caption: { zh: '数据、可见窗口与对象池的计数边界。', en: 'Counting boundaries for data, the visible window, and the object pool.' } },
      { file: 'update-paths', caption: { zh: '整窗刷新与目标索引刷新是两条备选路径。', en: 'Window refresh and targeted index refresh are alternative paths.' } },
    ],
  },
  {
    slug: 'gradient-lab', number: '02', title: 'Gradient Lab', folder: 'GradientLab', video: 'gradient',
    topic: { zh: '渐变画质与网格成本', en: 'Gradient quality & mesh cost' },
    summary: { zh: '以连续误差目标选择网格细分，研究固定与自适应渐变在动态变化下的画质和运行成本。', en: 'Choose mesh subdivisions against a continuous-error target, then examine quality and runtime cost as gradients change.' },
    question: { zh: '固定细分能否覆盖极端渐变曲线？自适应选择在提升画质的同时，会引入多少运行成本？', en: 'Can fixed subdivisions handle extreme gradient curves? What runtime cost does adaptive selection add while meeting the quality target?' },
    approach: { zh: '在同一渐变语义下比较 Fixed32 与 Adaptive，覆盖缓存命中、动态 bias、方向变化及不支持类型的回退。连续误差、实际顶点数与选择器开销分别报告。', en: 'Compare Fixed32 and Adaptive with shared gradient semantics, including cache hits, changing bias, direction changes, and fallback for unsupported types. Report continuous error, actual vertex counts, and selector overhead separately.' },
    result: { zh: '80 次有效独立 Player 运行，8 组对照中 4 组 improved、4 组 inconclusive。动态 100 组件场景的帧间隔 p95 五轮中位数：Fixed32 8.445310 ms，Adaptive 4.388835 ms。', en: '80 valid independent Player runs across eight comparisons: four improved and four inconclusive. In the dynamic 100-component scenario, the median frame-interval p95 across five repeats was 8.445310 ms for Fixed32 and 4.388835 ms for Adaptive.' },
    limit: { zh: 'Fixed32 在极端 bias 下属于 quality_limited，因此这不是等画质条件下的最优性能排名。帧间隔不是主线程 CPU 时间；GC 等不可用指标没有记为零。', en: 'Fixed32 is quality_limited at extreme bias, so this is not a performance ranking at equal quality. Frame interval is not main-thread CPU time, and unavailable metrics such as GC are not recorded as zero.' },
    steps: { zh: ['0–15 秒：Fixed32 改变 bias。', '15 秒：切换为 Adaptive。', '30 秒后：改变方向，曲线持续变化。'], en: ['0–15 s: change bias with Fixed32.', 'At 15 s: switch to Adaptive.', 'After 30 s: change direction as the curve continues to vary.'] },
    images: [
      { file: 'performance', caption: { zh: '8 组渐变对照，保留全部不确定结论。', en: 'Eight gradient comparisons, including every inconclusive result.' } },
      { file: 'quality-cost', caption: { zh: '连续误差、顶点数量与选择器成本分开比较。', en: 'Continuous error, vertex count, and selector cost shown separately.' } },
      { file: 'gradient-contract', caption: { zh: '曲线语义、网格选择与回退边界。', en: 'Gradient semantics, mesh selection, and fallback boundaries.' } },
    ],
  },
  {
    slug: 'benchmark-runner', number: '03', title: 'Benchmark Runner', folder: 'AgentBenchmark', video: 'agent',
    topic: { zh: '自动测量与结果验证', en: 'Automated measurement & validation' },
    summary: { zh: '把运行完成、样本有效与性能结论分开，让自动实验保留失败，并能追溯到对应源码和数据。', en: 'Separate process completion, sample validity, and performance conclusions. Preserve failures and connect results to their source and data.' },
    question: { zh: '自动运行退出成功，是否就说明实验有效？出现失败或污染样本时，怎样保留可审查的恢复过程？', en: 'Does a successful process exit mean an experiment is valid? How can failed or contaminated runs leave an auditable recovery trail?' },
    approach: { zh: '由 Agent 协助准备、实现与审查，确定性 C# Runner 执行采样，再对导出结果做验证。Completed、Failed 与 Invalid 明确区分，退出码、样本有效性和性能判定分别处理。', en: 'Agents assist preparation, implementation, and review; a deterministic C# Runner samples data before post-export validation. Completed, Failed, and Invalid are explicit states; exit codes, sample validity, and performance judgments are handled separately.' },
    result: { zh: '公开资料提供两主题共 130 次有效运行的复算入口，并保留列表分批恢复与渐变入口失败后的重新采样记录。失败不会因为后续成功而被删除。', en: 'Public evidence provides a recalculation entry point for 130 valid runs across the two topics, alongside list recovery batches and fresh gradient sampling after an entry failure. Later success does not erase earlier failures.' },
    limit: { zh: 'Completed 不自动等于 Valid，也不代表性能改善。离线 CI 不运行 Unity 构建、Player 或性能采样；Agent 参与交付不等于个人已经独立实现或掌握全部内容。', en: 'Completed does not automatically mean Valid or improved performance. Offline CI does not build Unity, run the Player, or sample performance. Agent-assisted delivery does not imply independent mastery of every implementation detail.' },
    steps: { zh: ['0 秒：启动 normal 案例。', '16 秒：启动配置失败案例。', '18 秒：启动 pause invalid；34 秒后保留 Invalid 终态。'], en: ['At 0 s: start the normal case.', 'At 16 s: start the configuration-failure case.', 'At 18 s: start pause invalid; retain the Invalid state after 34 s.'] },
    images: [
      { file: 'pipeline', caption: { zh: '准备、确定性采样、导出后验证。', en: 'Preparation, deterministic sampling, and post-export validation.' } },
      { file: 'outcomes', caption: { zh: '成功、失败和无效样本的独立终态。', en: 'Distinct outcomes for completion, failure, and invalid samples.' } },
      { file: 'recovery', caption: { zh: '真实失败与恢复记录，而非理想化流程。', en: 'Actual failures and recovery records.' } },
    ],
  },
];
