import type { Localized } from './profile';
interface Block { title: Localized; text: Localized; }
interface FigureReading { reading: Localized; finding: Localized; limit: Localized; }
interface CaseDetails { questions: Block[]; flow: Localized; implementation: Block[]; protocol: Localized; rule: Localized; headers: Localized[]; rows: string[][]; tableCaption: Localized; results: Block[]; figures: Record<string, FigureReading>; }
export const caseDetails: Record<string, CaseDetails> = {
  "list-lab": {
    "questions": [
      {
        "title": {
          "zh": "把三个问题分开",
          "en": "Separate three questions"
        },
        "text": {
          "zh": "数据多，不代表同时需要很多 UI 对象；对象可复用，也不代表一次更新只会访问目标行。本案例分别研究对象池（减少创建与销毁）、虚拟化（约束活跃窗口）和刷新策略（决定扫描与绑定范围）。实验将范围固定为 1000 条数据、固定行高与约 9 行可见窗口，避免把这些机制混成一个“列表优化”。",
          "en": "A large dataset does not require equally many UI objects, and reusable objects do not guarantee targeted updates. This case separates pooling, which reduces creation and destruction; virtualization, which bounds the active window; and refresh policy, which controls scanning and binding. The measured fixture fixes 1,000 records, constant row height, and about nine visible rows."
        }
      },
      {
        "title": {
          "zh": "先保证显示正确，再减少工作",
          "en": "Correctness before reducing work"
        },
        "text": {
          "zh": "修改可见项后应立即显示新值；修改离屏项后数据必须保留，重新入屏时不能显示旧文本。文本绑定回调可能重入列表，绑定异常又可能留下错误的租借关系。这里的问题因此不只是“少做几次 Bind”，还包括更新、滚动、清空与重新打开之后的一致性。",
          "en": "A visible update must display the new value, while an offscreen update must persist and appear correctly when scrolled into view. Binding callbacks may reenter the list, and exceptions may leave inconsistent leases. Reducing Bind calls therefore also requires consistency across updates, scrolling, clearing, and reopening."
        }
      }
    ],
    "flow": {
      "zh": "验证输入 → 发布数据 → Window / TargetOnly 分支 → 入屏时补齐 pending → 结束变更",
      "en": "Validate input → Publish data → Window / TargetOnly branch → Reconcile pending data on entry → End mutation"
    },
    "implementation": [
      {
        "title": {
          "zh": "更新是两条备选路径",
          "en": "Two alternative refresh paths"
        },
        "text": {
          "zh": "ListView.UpdateItem 先进入变更边界，校验索引并发布数据。Window 扫描当前 Cell 并刷新可见窗口；TargetOnly 查找目标索引，仅对需要同步的可见目标绑定。它们是同一输入下的替代策略，不是先执行 Window 再执行 TargetOnly。普通后端可能扫描 1000 个 Cell，虚拟后端约扫描 13 个租借 Cell。",
          "en": "ListView.UpdateItem enters a mutation boundary, validates the index, and publishes the data. Window scans current cells and refreshes the visible window; TargetOnly looks up the affected index and binds visible targets that require synchronization. These are alternative policies for the same input, not consecutive steps. The normal backend may scan 1,000 cells, while the virtual backend scans roughly 13 leased cells."
        }
      },
      {
        "title": {
          "zh": "离屏更新与批量输入",
          "en": "Offscreen updates and batches"
        },
        "text": {
          "zh": "离屏数据先保留在数据模型中，待可见范围真正变化时，通过 pending 对账补齐显示。批量更新先复制并验证全部输入，拒绝重复索引后才发布，避免一半输入已经写入才发现另一半无效；这种输入校验的原子性不意味着后续派发异常具有事务回滚能力。",
          "en": "Offscreen changes remain in the data model; pending reconciliation synchronizes presentation when the visible range changes. A batch copies and validates all input, rejecting duplicate indices before publishing. This avoids discovering invalid input after partially publishing a batch, but input-validation atomicity is not transactional rollback for later dispatch failures."
        }
      },
      {
        "title": {
          "zh": "把对象归属与显示状态一起维护",
          "en": "Maintain ownership and presentation together"
        },
        "text": {
          "zh": "CellPool 通过 Rent、Rebind、Return 管理租借与缓存，Cell 的 Bind / Unbind 重置视觉并记录索引与计数。虚拟后端的正式 fixture 为 9 行可见加 4 行 overscan，共 13 个 leased Cell；普通后端则租借全表 1000 个。累计创建数 Created 与当前存量 UniqueTotal 不同，当前拥有实例应按 UniqueTotal 与 leased / cached 核对。局部更新节省工作量的代价，是额外维护 pending、归属检查、重入与异常清理。",
          "en": "CellPool manages leases and cached cells through Rent, Rebind, and Return; Bind / Unbind resets presentation and records indices and counters. The virtual backend in the measured fixture has nine visible rows plus four overscan rows, totaling 13 leases; the normal backend leases all 1,000 cells. Cumulative Created differs from current ownership, UniqueTotal, which must be checked against leased and cached counts. Targeted updates trade reduced work for pending-state bookkeeping, ownership checks, reentrancy handling, and exception cleanup."
        }
      }
    ],
    "protocol": {
      "zh": "正式实验使用 Unity 2022.3.45f1c1、Windows 10、Ryzen 5 5600G / RX 9070、D3D11、960×540、Mono Development Player，关闭 Editor、VSync=0。每次独立进程预热 300 帧、采样 1800 帧；每组两策略交错运行 5 对。先计算每次运行的帧间隔 p95，再比较五轮 p95 的中位数。p95 表示约 95% 的采样帧间隔不超过该值，并不是平均帧耗时。",
      "en": "Formal measurements used Unity 2022.3.45f1c1, Windows 10, Ryzen 5 5600G / RX 9070, D3D11, 960×540, and Mono Development Players, with the Editor closed and VSync off. Each independent process warmed up for 300 frames and measured 1,800 frames; each comparison interleaved five pairs of runs. Per-run frame-interval p95 values were calculated first, then their median across five repeats. A p95 is a value at or below which roughly 95% of sampled intervals fall, not an average frame time."
    },
    "rule": {
      "zh": "improved 要求至少 5 对中 4 对同方向，且差值超过 max（基线 p95 中位数的 5%，两策略 p95 全距中较大者的一半）。这是预先固定的工程判据，不是统计显著性检验。inconclusive 表示当前协议不足以支持明确改善，不能解释为两个实现完全等价。图中范围是五次重复的最小值到最大值，不是置信区间。",
      "en": "An improved result requires at least four of five pairs to agree in direction and a difference exceeding max(5% of the baseline median p95, half the larger of the two repeat ranges). This is a predefined engineering decision rule, not a statistical significance test. Inconclusive means this protocol does not establish a clear improvement, not that the implementations are equivalent. Ranges show the minimum and maximum of five repeats, not confidence intervals."
    },
    "headers": [
      {
        "zh": "场景",
        "en": "Scenario"
      },
      {
        "zh": "Window p95（ms）",
        "en": "Window p95 (ms)"
      },
      {
        "zh": "Target p95（ms）",
        "en": "Target p95 (ms)"
      },
      {
        "zh": "变化",
        "en": "Change"
      },
      {
        "zh": "判定",
        "en": "Verdict"
      }
    ],
    "rows": [
      [
        "normal-high-fps-1",
        "28.755965",
        "4.343835",
        "−84.89%",
        "improved"
      ],
      [
        "normal-batch-fps-1",
        "28.813529",
        "4.824315",
        "−83.26%",
        "improved"
      ],
      [
        "virtual-high-fps-1",
        "0.927415",
        "0.667820",
        "−27.99%",
        "improved"
      ],
      [
        "virtual-batch-fps-1",
        "1.005620",
        "1.006910",
        "+0.13%",
        "inconclusive"
      ],
      [
        "virtual-high-fps60",
        "17.002206",
        "17.002000",
        "≈ 0%",
        "inconclusive"
      ]
    ],
    "tableCaption": {
      "zh": "5 组已测对照；每个数值是五次独立运行 p95 的中位数。fps-1 为不设目标帧率上限，fps60 为单独的 60 FPS 协议组。",
      "en": "Five measured comparisons; each value is the median of five independent per-run p95 values. fps-1 has no target frame-rate cap; fps60 is a separate 60 FPS protocol group."
    },
    "results": [
      {
        "title": {
          "zh": "计数解释机制，不完成耗时归因",
          "en": "Counters explain mechanisms, not timing attribution"
        },
        "text": {
          "zh": "高频单项组在 1800 个采样帧内，Window 记录 16200 次 Bind，Target 为 1800 次，对应每次操作 9 次与 1 次。批量组双方都是 16200 次 Bind，普通列表仍有差异，说明扫描范围也值得关注；但没有独立 CPU marker，不能把帧间隔差值全部归因于绑定、遍历或 Canvas。",
          "en": "Across 1,800 sampled frames in the high-frequency single-item workload, Window records 16,200 Bind calls and Target 1,800: nine versus one per action. Both batch variants record 16,200 calls, yet the normal backend still differs, making traversal scope relevant. Without separate CPU markers, frame-interval differences cannot be allocated entirely to binding, traversal, or Canvas work."
        }
      },
      {
        "title": {
          "zh": "哪些结果仍然没有答案",
          "en": "What remains unresolved"
        },
        "text": {
          "zh": "虚拟批量组约 1 ms，差异只有 +0.13%；60 FPS 组两者均约 17 ms，当前协议不支持明确改善。另有 6 组未测，不能外推到其他数据规模、idle / sparse / burst、冷启动或全部帧率。演示的 8 行与测量的 9 行是不同 fixture；coldBuildMs 也不是应用冷启动耗时。",
          "en": "The virtual batch comparison is around 1 ms with a +0.13% difference; both 60 FPS variants are around 17 ms. Neither establishes an improvement under this protocol. Six other groups remain unmeasured, so results do not extend to other dataset sizes, idle / sparse / burst workloads, cold starts, or all frame rates. The eight-row demo and nine-row measured fixture differ; coldBuildMs is not application cold-start time."
        }
      }
    ],
    "figures": {
      "performance": {
        "reading": {
          "zh": "五个子图各对应一个协议组。蓝柱是 Window，绿柱是 Target；柱高为五轮 p95 的中位数，黑点保留全部五轮，须线为最小值至最大值。各子图纵轴从零起但刻度不同，应先读 ms 数值，再比较组内两策略。",
          "en": "Each panel is a protocol group. Blue is Window and green is Target. Bars show the median of five p95 values, dots retain all repeats, and whiskers show min–max. Axes start at zero but use different scales: read the milliseconds and compare within each panel."
        },
        "finding": {
          "zh": "上排三组支持 improved；下排虚拟批量与 60 FPS 两组保留 inconclusive。普通高频与批量组下降幅度大，不能因此抹去虚拟化场景中不明确的结果。右下角列出 50 次独立运行与 6 组未测，交代样本覆盖。",
          "en": "The three top-row comparisons are improved; the virtual batch and 60 FPS comparisons remain inconclusive. Large reductions in the normal backend do not erase uncertain virtual-list results. The lower-right annotation states the 50-run coverage and six unmeasured groups."
        },
        "limit": {
          "zh": "这些是 Development Player 的帧间隔，不是函数或主线程 CPU 时间。须线不是置信区间；60 FPS 组不能与无限制组混合计算一个总提升。",
          "en": "These are Development Player frame intervals, not function or main-thread CPU times. Whiskers are not confidence intervals, and the capped group must not be pooled with uncapped groups into one speedup."
        }
      },
      "pool-contract": {
        "reading": {
          "zh": "从左到右区分数据模型、虚拟后端的可见窗口和 Cell 池：1000 条数据拥有稳定索引；该虚拟窗口含 9 行可见与 4 行 overscan；池负责创建、租借、绑定、重置和归还。下方是该虚拟 fixture 的观测，不是普通后端的对象数量。",
          "en": "Read left to right: 1,000 indexed records, the virtual backend window with nine visible plus four overscan rows, and a pool managing creation, leasing, binding, resetting, and return. The lower counters describe this virtual fixture, not the normal backend object count."
        },
        "finding": {
          "zh": "该虚拟 fixture 观测到 created=13、leased=13、cached=0，清理后 cleanupUnique=0。图内 Created=leased+cached 在本次无销毁观测中数值成立，不能当作一般池不变量：Created 是累计创建数，当前拥有实例应按 UniqueTotal 与 leased / cached 核对。13 个租借对象既不是 13 条可见行，也不是数据总量。",
          "en": "This virtual fixture observes created=13, leased=13, and cached=0, followed by cleanupUnique=0. The pictured Created=leased+cached equality holds numerically for this observation without destruction; it is not a general pool invariant. Created is cumulative, while current ownership must be checked using UniqueTotal against leased and cached counts. Thirteen leases are neither thirteen visible rows nor the dataset size."
        },
        "limit": {
          "zh": "这是固定 N=1000 fixture 的合同与观察，不是对所有 N 测出的扩展曲线，也不能从一次清理计数推导进程零泄漏。演示封面中的可见行数另算。",
          "en": "This is a contract and observation for the fixed N=1,000 fixture, not a measured scaling curve for every N or proof of a leak-free process. The demo cover uses a different visible-row count."
        }
      },
      "update-paths": {
        "reading": {
          "zh": "左框是共同的数据变更入口；中框 Window 和右框 Target 是可选择的派发范围。high 一行比较每次操作的 Bind，batch 一行比较每帧批量绑定，不能把两行当成同一种工作负载。",
          "en": "The left block is the shared mutation entry; the middle Window and right Target blocks are alternative dispatch scopes. The high row counts bindings per action, while batch counts bindings per frame. They describe different workloads."
        },
        "finding": {
          "zh": "高频更新从 9 Bind 缩为 1 Bind；批量更新双方仍是 9 Bind。图解释为什么局部刷新不总能只靠 Bind 数量预测收益，也说明离屏数据保留和旧归属失效是减少派发的前提。",
          "en": "High-frequency updates reduce nine bindings to one, whereas batch updates retain nine for both policies. Bind counts alone therefore do not predict every benefit. Preserving offscreen data and invalidating stale ownership are prerequisites for narrower dispatch."
        },
        "limit": {
          "zh": "这是路径与工作量说明，不是带计时的调用图。下方列出的三个 improved 与两个 inconclusive 必须结合图 1 阅读，不能把 Window→Target 画成必然更快的连续步骤。",
          "en": "This is a path and workload diagram, not a timed call graph. Its three improved and two inconclusive outcomes should be read alongside Figure 1; Window and Target are not sequential steps in a universally faster pipeline."
        }
      }
    }
  },
  "gradient-lab": {
    "questions": [
      {
        "title": {
          "zh": "端点相同，曲线内部仍可能有误差",
          "en": "Matching endpoints does not match the curve"
        },
        "text": {
          "zh": "UGUI 网格在顶点之间线性插值，而 Schlick bias 颜色函数可以在局部快速变化。只保证首尾颜色正确，不能保证曲线中间正确。均匀增加段数会同时增加平缓区的顶点，极端 bias 仍可能超出误差目标，因此需要将“在哪里加截面”与“增加多少段”分开。",
          "en": "UGUI interpolates between vertices linearly, while a Schlick-bias color function can change sharply in a localized region. Correct endpoint colors do not guarantee accuracy between them. Uniform subdivision adds geometry even in flat regions and can still miss the target at extreme bias, so placement matters as well as segment count."
        }
      },
      {
        "title": {
          "zh": "质量、几何和时间是三个指标",
          "en": "Quality, geometry, and time are separate metrics"
        },
        "text": {
          "zh": "实验要求受支持矩形、uniform white base 与指定 RGBA / Schlick 输入，使用 4097 个连续参考点检查最大绝对误差，目标为 0.01。连续颜色误差、Color32 量化与屏幕像素误差不混为一个指标；顶点减少和选择器耗时也需要独立记录。",
          "en": "For supported rectangles, uniform white base color, and the specified RGBA / Schlick inputs, 4,097 continuous reference points check maximum absolute error against a 0.01 target. Continuous color error, Color32 quantization, and pixel error are distinct. Geometry reduction and selection overhead also need separate measurements."
        }
      }
    ],
    "flow": {
      "zh": "归一化颜色函数 → 检查矩形拓扑 → 固定 / 自适应截面 → 生成网格 → 量化颜色；不支持类型走 fallback",
      "en": "Normalize the color function → Check rectangle topology → Fixed / adaptive sections → Generate mesh → Quantize color; unsupported types use fallback"
    },
    "implementation": [
      {
        "title": {
          "zh": "先定义函数，再判断能否细分",
          "en": "Define the function, then validate subdivision"
        },
        "text": {
          "zh": "GradientFunction 负责权重、RGBA 插值、输入约束与 8 位量化。GradientEffect 检查轴对齐四角、6 个索引、绕序、对角线和 UV 仿射关系，满足 StrictRectangle 后才沿边界插值生成截面。Unsupported Image 保留拓扑并着色回退；能显示颜色不代表已达到完整曲线质量目标。",
          "en": "GradientFunction defines weights, RGBA interpolation, input constraints, and 8-bit quantization. GradientEffect checks axis-aligned corners, six indices, winding, diagonals, and affine UV relationships before subdividing a StrictRectangle. Unsupported images retain their topology and use color fallback; displaying a color does not establish full-curve quality."
        }
      },
      {
        "title": {
          "zh": "把预算花在误差最大的区间",
          "en": "Refine the interval with the greatest error"
        },
        "text": {
          "zh": "选择器从配置的最小段数开始，本实验为 1 段。每轮计算分段误差，找到最坏区间，同误差取最左，再插入中点，直到达到容差或段数上限。这是确定性的贪心选择，不是对所有网格的全局最优求解；达到上限仍超标时必须报告质量受限。",
          "en": "The selector starts from the configured minimum, one segment in this experiment. Each iteration evaluates segment error, chooses the worst interval, breaks ties to the left, and inserts its midpoint until tolerance or the segment cap is reached. This deterministic greedy method is not a global optimum over all meshes; exceeding the target at the cap must remain a quality-limited result."
        }
      },
      {
        "title": {
          "zh": "缓存选择，单独处理几何映射",
          "en": "Cache selection separately from geometry mapping"
        },
        "text": {
          "zh": "颜色、bias、曲线、最小/最大段数与容差决定选择缓存；尺寸或方向改变可复用归一化截面，只重新映射几何。TransitionController 只推进 bias，不直接绘制。动态输入使缓存和重建成本进入实验，因此同时报告选择累计时间与整体帧间隔。",
          "en": "Colors, bias, curve, minimum/maximum segment counts, and tolerance determine the selection cache. Size or direction changes can reuse normalized sections and remap geometry. TransitionController advances bias without drawing. Dynamic input exposes selection and rebuild costs, so cumulative selection time and frame intervals are reported separately."
        }
      }
    ],
    "protocol": {
      "zh": "正式实验使用 Unity 2022.3.45f1c1、Windows 10、Ryzen 5 5600G / RX 9070、D3D11、960×540、Mono Development Player，关闭 Editor、VSync=0。每次独立进程预热 300 帧、采样 1800 帧；每组两策略交错运行 5 对。先计算每次运行的帧间隔 p95，再比较五轮 p95 的中位数。p95 表示约 95% 的采样帧间隔不超过该值，并不是平均帧耗时。",
      "en": "Formal measurements used Unity 2022.3.45f1c1, Windows 10, Ryzen 5 5600G / RX 9070, D3D11, 960×540, and Mono Development Players, with the Editor closed and VSync off. Each independent process warmed up for 300 frames and measured 1,800 frames; each comparison interleaved five pairs of runs. Per-run frame-interval p95 values were calculated first, then their median across five repeats. A p95 is a value at or below which roughly 95% of sampled intervals fall, not an average frame time."
    },
    "rule": {
      "zh": "improved 要求至少 5 对中 4 对同方向，且差值超过 max（基线 p95 中位数的 5%，两策略 p95 全距中较大者的一半）。这是预先固定的工程判据，不是统计显著性检验。inconclusive 表示当前协议不足以支持明确改善，不能解释为两个实现完全等价。图中范围是五次重复的最小值到最大值，不是置信区间。",
      "en": "An improved result requires at least four of five pairs to agree in direction and a difference exceeding max(5% of the baseline median p95, half the larger of the two repeat ranges). This is a predefined engineering decision rule, not a statistical significance test. Inconclusive means this protocol does not establish a clear improvement, not that the implementations are equivalent. Ranges show the minimum and maximum of five repeats, not confidence intervals."
    },
    "headers": [
      {
        "zh": "场景",
        "en": "Scenario"
      },
      {
        "zh": "Fixed32 p95（ms）",
        "en": "Fixed32 p95 (ms)"
      },
      {
        "zh": "Adaptive64 p95（ms）",
        "en": "Adaptive64 p95 (ms)"
      },
      {
        "zh": "变化",
        "en": "Change"
      },
      {
        "zh": "判定",
        "en": "Verdict"
      }
    ],
    "rows": [
      [
        "large-static-05",
        "0.621510",
        "0.621805",
        "+0.05%",
        "inconclusive"
      ],
      [
        "large-static-50",
        "0.621300",
        "0.622810",
        "+0.24%",
        "inconclusive"
      ],
      [
        "large-static-95",
        "0.617900",
        "0.623615",
        "+0.92%",
        "inconclusive"
      ],
      [
        "grid-static-05",
        "0.615605",
        "0.569105",
        "−7.55%",
        "improved"
      ],
      [
        "grid-static-50",
        "0.614525",
        "0.563405",
        "−8.32%",
        "improved"
      ],
      [
        "grid-static-95",
        "0.613310",
        "0.566125",
        "−7.69%",
        "improved"
      ],
      [
        "large-dynamic",
        "0.622205",
        "0.609605",
        "−2.03%",
        "inconclusive"
      ],
      [
        "grid-dynamic",
        "8.445310",
        "4.388835",
        "−48.03%",
        "improved"
      ]
    ],
    "tableCaption": {
      "zh": "8 组完整对照；large 为 1 个组件，grid 为 100 个组件；05 / 50 / 95 分别为 bias 0.05 / 0.50 / 0.95。数值为五轮 p95 的中位数。",
      "en": "All eight comparisons. large uses one component and grid uses 100; 05 / 50 / 95 denote bias 0.05 / 0.50 / 0.95. Values are medians of five per-run p95 values."
    },
    "results": [
      {
        "title": {
          "zh": "收益随工作负载变化",
          "en": "Benefits depend on the workload"
        },
        "text": {
          "zh": "四个 improved 全部来自 100 组件组：三个静态组约下降 7.55%–8.32%，绝对差约 0.046–0.051 ms；动态组从 8.445310 降到 4.388835 ms。单组件的三个静态组和动态组均为 inconclusive，不能将动态网格的 −48.03% 写成所有 UI 的收益。",
          "en": "All four improved outcomes come from the 100-component workloads: static reductions of 7.55%–8.32% correspond to roughly 0.046–0.051 ms, while the dynamic workload falls from 8.445310 to 4.388835 ms. All three static and the dynamic single-component comparisons are inconclusive; −48.03% is not a universal UI benefit."
        }
      },
      {
        "title": {
          "zh": "误差目标达标不等于等画质性能排名",
          "en": "Meeting the target is not an equal-quality ranking"
        },
        "text": {
          "zh": "Fixed32 在极端 bias 的最大连续误差约 0.0384221，超过 0.01，属于 quality_limited。Adaptive64 的 64 是上限，本轮实际只用 1–12 段，动态最大误差约 0.00994192，极端静态约 0.00723906。较少顶点与更低误差在本轮同时出现，但不证明任意输入或材质上的全局最优。",
          "en": "Fixed32 reaches about 0.0384221 maximum continuous error at extreme bias, exceeding 0.01 and making it quality_limited. Adaptive64 names a cap, not a fixed count: actual use was 1–12 segments, with dynamic maximum error around 0.00994192 and extreme static error around 0.00723906. Fewer vertices and lower error coexist here, without proving global optimality for arbitrary inputs or materials."
        }
      },
      {
        "title": {
          "zh": "累计选择时间不能直接扣除 p95",
          "en": "Do not subtract cumulative selection time from p95"
        },
        "text": {
          "zh": "动态 100 组件中，每次运行统计 1800 个采样帧的选择器累计时间；五次独立运行的这些累计值之中位数约为 158.5597 ms。该开销已经包含在整体帧间隔里，不是单帧 p95，不能从 4.388835 ms 再扣除。Main Thread、GC、内存和 GPU 分项不可用，因此不能据此宣称零分配或给出 CPU/GPU 成本拆分。",
          "en": "In the dynamic 100-component case, each run totals selector time over 1,800 sampled frames. The median of those totals across five independent runs is about 158.5597 ms. This overhead is already included in overall frame intervals; it is not a per-frame p95 and cannot be subtracted from 4.388835 ms. Main Thread, GC, memory, and GPU breakdowns are unavailable, so neither zero allocation nor a CPU/GPU cost breakdown is established."
        }
      }
    ],
    "figures": {
      "performance": {
        "reading": {
          "zh": "八个子图覆盖单组件/100 组件、三个静态 bias 与动态输入。蓝色 Fixed32、绿色 Adaptive；柱是五轮 p95 中位数，点是每次运行，须线是最小至最大。注意右下角动态 100 组件纵轴约为 10 ms，其他图约为 0.6 ms 量级。",
          "en": "Eight panels cover one versus 100 components, three static biases, and dynamic input. Blue is Fixed32 and green Adaptive; bars show median p95, dots individual repeats, and whiskers min–max. The lower-right panel uses an approximately 10 ms scale, whereas the others are around 0.6 ms."
        },
        "finding": {
          "zh": "100 组件动态组从 8.445310 降至 4.388835 ms；三个 100 组件静态组也通过改善判据。四个单组件组全部不明确，说明组件规模与输入变化会影响可观测收益。",
          "en": "The dynamic 100-component group falls from 8.445310 to 4.388835 ms, and its three static counterparts also meet the improvement rule. All four single-component groups are inconclusive, showing that scale and changing input affect observable benefits."
        },
        "limit": {
          "zh": "必须连同图 2 的质量指标阅读：Fixed32 在极端和动态输入上质量受限，两柱并非等画质最优方案竞赛。不同主题的构建不同，不与 List Lab 的绝对毫秒横比。",
          "en": "Read this alongside Figure 2: Fixed32 is quality-limited for extreme and dynamic input, so the bars do not rank equally accurate optimal solutions. Different topics use different builds; do not compare absolute milliseconds with List Lab."
        }
      },
      "quality-cost": {
        "reading": {
          "zh": "左图的红虚线是连续 RGBA 误差 0.01 目标；中图是每组件最大顶点数；右图横轴为 5 次独立重复，纵轴是 1800 帧内选择器累计毫秒。三个面板单位不同，应分别读取。",
          "en": "The left panel marks the 0.01 continuous RGBA error target with a red dashed line. The middle panel reports maximum vertices per component. The right panel plots cumulative selector milliseconds over 1,800 frames for five independent repeats. These panels use different units."
        },
        "finding": {
          "zh": "极端 bias 下，Fixed32 误差约 0.0384，高于目标；Adaptive 约 0.00724。中图 Fixed32 为 66 顶点，Adaptive 极端/动态最多 26、中心 4 顶点，对应实际 1–12 段。右图显示 100 组件选择器有明显累计成本，这份成本没有被隐藏。",
          "en": "At extreme bias, Fixed32 error is about 0.0384, above target, versus about 0.00724 for Adaptive. Fixed32 uses 66 vertices; Adaptive peaks at 26 for extreme/dynamic input and uses four at the center, corresponding to 1–12 segments. The right panel makes the cumulative selection cost of 100 components visible."
        },
        "limit": {
          "zh": "连续误差不包括 Color32 量化或屏幕像素误差；右图累计成本已包含在帧间隔内，不能与单帧 p95 直接相减。64 是段数上限，不是图中实际网格规模。",
          "en": "Continuous error excludes Color32 quantization and pixel error. Cumulative selector time is already included in frame intervals and cannot be subtracted directly from per-frame p95. Sixty-four is the segment cap, not the measured mesh size."
        }
      },
      "gradient-contract": {
        "reading": {
          "zh": "按“输入合同 → 网格选择 → 质量/回退”阅读。左侧规定方向、RGBA 与 Schlick bias；中间分别列 Fixed32 和上限 64 的自适应；右侧把连续误差目标与像素/量化误差区分。",
          "en": "Follow input contract → mesh choice → quality/fallback. The left block defines direction, RGBA, and Schlick bias. The middle distinguishes Fixed32 from capped adaptive selection. The right separates continuous-error targets from pixel and quantization error."
        },
        "finding": {
          "zh": "两种策略共享颜色函数，改变的是近似曲线的截面位置与数量，而不是偷偷改了目标颜色。底部把适用范围约束为矩形 Image、均匀白色底色与规定输入，并注明 600 个动态 bias 值。",
          "en": "Both policies share the color function; they change the number and placement of sections approximating it rather than changing the target color. The lower block limits the result to rectangular images, uniform white base color, specified inputs, and 600 dynamic bias values."
        },
        "limit": {
          "zh": "Unsupported 类型安全回退，只说明保留了可用的着色路径，不表示通过同一连续质量验收。该图是机制与适用范围说明，不是额外的一组性能实验。",
          "en": "Safe fallback for unsupported types preserves a usable coloring path, not acceptance under the same continuous-quality test. This diagram explains mechanisms and scope; it is not another performance experiment."
        }
      }
    }
  },
  "benchmark-runner": {
    "questions": [
      {
        "title": {
          "zh": "一个 PASS 无法回答四件事",
          "en": "One PASS cannot answer four questions"
        },
        "text": {
          "zh": "程序是否退出、功能是否正确、样本是否有效、性能是否改善，是四个独立问题。自动化只确认进程结束，会把未就绪场景、半截样本或失焦后的数据当成成功。Runner 的目标是把这些状态显式记录，使失败可以定位，而不是让每次启动都显示绿色。",
          "en": "Process exit, functional correctness, measurement validity, and performance improvement are separate questions. Checking only termination can accept an unready scene, incomplete samples, or unfocused execution. The Runner makes these states explicit so failures can be diagnosed, rather than making every launch look successful."
        }
      },
      {
        "title": {
          "zh": "一次运行必须有可核对的身份",
          "en": "Every run needs a verifiable identity"
        },
        "text": {
          "zh": "同一截图或同一文件名不能证明数据来自当前代码。每次运行绑定 candidateId、buildId、sourceRevision、runId、场景和采样参数；原始数据与导出摘要也需要对应。运行前的配置准备、Player 内采样和运行后的核验因此被拆成三个阶段。",
          "en": "A screenshot or matching filename does not prove that data came from current code. Each run binds candidateId, buildId, sourceRevision, runId, scenario, and sampling settings, with matching raw data and summaries. Configuration, in-Player sampling, and post-run verification are therefore separate phases."
        }
      }
    ],
    "flow": {
      "zh": "Idle → Prepare → Warmup → Measure → Validate → Export → Cleanup → 终态核验",
      "en": "Idle → Prepare → Warmup → Measure → Validate → Export → Cleanup → Verify terminal outcome"
    },
    "implementation": [
      {
        "title": {
          "zh": "配置先拒绝歧义",
          "en": "Reject ambiguity in configuration"
        },
        "text": {
          "zh": "命令行解析 case、run-id、输出根和故障参数，再校验未知协议、不安全路径与占位身份。Prepare 等待场景准备，Warmup 排除预热，Measure 按固定帧数采样。Host 将 Time.unscaledDeltaTime 转为毫秒，并记录应用失焦和暂停。正式采样窗口内不截图、录像、逐帧 MCP、重度 Profiler 捕获或导出文件，减少测量干扰。",
          "en": "Command-line parsing supplies the case, run ID, output root, and fault settings; validation rejects unknown protocols, unsafe paths, and placeholder identities. Prepare waits for readiness, Warmup excludes warmup frames, and Measure samples a fixed frame count. The Host converts Time.unscaledDeltaTime to milliseconds and records focus loss and pause. Formal sampling excludes screenshots, video, per-frame MCP, heavy profiler captures, and file export to reduce interference."
        }
      },
      {
        "title": {
          "zh": "校验和故障注入各有职责",
          "en": "Validation and fault injection have distinct roles"
        },
        "text": {
          "zh": "Validate 分别检查案例正确性、样本数量、必需指标与外部无效状态。确定性故障注入覆盖准备失败、就绪超时、样本不足、案例异常、导出失败、失焦和暂停，用可重复的负例测试错误路径。缺失的可选 CPU、GC 或内存指标记录为 unavailable；缺失必需指标则影响有效性。",
          "en": "Validate checks case correctness, sample count, required metrics, and external invalidation separately. Deterministic fault injection exercises preparation failure, readiness timeout, sample shortage, case exceptions, export failure, focus loss, and pause. Missing optional CPU, GC, or memory metrics remain unavailable; missing required metrics affects validity."
        }
      },
      {
        "title": {
          "zh": "产物链比单个退出码更完整",
          "en": "Artifacts carry more evidence than an exit code"
        },
        "text": {
          "zh": "导出保留 config、environment、identity、samples.csv、summary、report 和 events.log，将输入、原始采样、统计与事件关联。运行后还要核对产物、清理及终态，再做跨运行比较。Agent 负责授权范围内的准备、构建、启动与审查；采样动作由确定性 C# Runner 执行，Agent 不凭截图或退出码制造样本。",
          "en": "Exports preserve config, environment, identity, samples.csv, summary, report, and events.log, linking input, raw samples, statistics, and events. Artifacts, cleanup, and terminal outcomes are checked before cross-run comparisons. Agents assist authorized preparation, builds, launches, and review; deterministic C# executes sampling, and agents cannot create evidence from screenshots or exit codes."
        }
      }
    ],
    "protocol": {
      "zh": "三种展示终态来自独立 Release 诊断；正式 List / Gradient 数据来自各自的 Development Player，仍使用每次 300 帧预热、1800 帧采样和五轮成对协议。公开 CASE 报告 Core 32/32、Runner 8/8，以及展示 smoke 的 32 checks；这些门禁可能重叠，不相加冒充独立测试总数。",
      "en": "The three displayed outcomes come from separate Release diagnostics. Formal List and Gradient data use their respective Development Players with 300 warmup frames, 1,800 samples, and five paired repeats. The public CASE reports Core 32/32, Runner 8/8, and 32 showcase smoke checks; overlapping gates must not be added into a claimed independent test total."
    },
    "rule": {
      "zh": "下面各行是并列的预设诊断案例。外层展示验证 exit 0，表示它正确识别了所有预期终态，不表示内部 fail / invalid 样本可以进入性能统计。",
      "en": "Rows below are parallel preset diagnostic cases. An outer showcase-validation exit of zero means it recognized every expected outcome, not that the internal failed or invalid samples are eligible for performance statistics."
    },
    "headers": [
      {
        "zh": "预设案例",
        "en": "Preset case"
      },
      {
        "zh": "运行终态",
        "en": "Terminal state"
      },
      {
        "zh": "正确性",
        "en": "Correctness"
      },
      {
        "zh": "测量有效性",
        "en": "Validity"
      },
      {
        "zh": "退出码",
        "en": "Exit code"
      }
    ],
    "rows": [
      [
        "normal",
        "Completed",
        "Pass",
        "Valid",
        "0"
      ],
      [
        "fail",
        "Failed",
        "NotRun",
        "NotAssessed",
        "1"
      ],
      [
        "invalid",
        "Completed",
        "Pass",
        "Invalid",
        "3"
      ]
    ],
    "tableCaption": {
      "zh": "公开案例报告的诊断终态。Completed 与 Valid 是不同字段。",
      "en": "Diagnostic outcomes reported in the public case. Completed and Valid are separate fields."
    },
    "results": [
      {
        "title": {
          "zh": "130 次有效样本之外，失败仍然可见",
          "en": "Failures remain visible outside the 130 valid runs"
        },
        "text": {
          "zh": "正式矩阵共有 List 50 次与 Gradient 80 次有效运行。列表在完成前 14 次后，第 15 次启动等待 180 秒超时且没有 raw；保留原尝试后，在新根目录仅补剩余 36 次。渐变首次因误入默认 ListLab 场景而 exit 2、无 raw；修正主题构建入口后执行完整 80 次矩阵。",
          "en": "The formal matrix contains 50 valid List runs and 80 valid Gradient runs. After 14 accepted List runs, the fifteenth launch timed out after 180 seconds without raw samples; the attempt was preserved and only the remaining 36 runs were completed under a new root. The initial Gradient entry used the default ListLab scene, exiting with code 2 and no raw samples; a corrected topic-specific build then ran the full 80-run matrix."
        }
      },
      {
        "title": {
          "zh": "恢复不是删除不喜欢的样本",
          "en": "Recovery is not removing inconvenient samples"
        },
        "text": {
          "zh": "两次真实编排失败与故障注入展示是不同记录。没有 raw 的尝试不能补造 samples，也不计为一次有效运行；已有有效数据按真实路径核对并保留。公开 CASE 与图表给出了恢复经过，但部分原始 smoke 回执、计划和操作日志被标为历史记录未公开，不能暗示读者可下载全部原始记录。",
          "en": "The two real orchestration failures are distinct from injected showcase faults. Attempts without raw data cannot acquire invented samples or count as valid runs; existing valid data is verified against its actual path and retained. Public case documents and figures describe recovery, but some original smoke receipts, plans, and operation logs are marked as unpublished historical records."
        }
      },
      {
        "title": {
          "zh": "自动化验证的能力边界",
          "en": "Limits of automated validation"
        },
        "text": {
          "zh": "离线 CI 核对公开资料和数据合同，不运行 Unity 构建、Player 或正式性能采样。Runner 的帧间隔也不是 Profiler CPU Timeline 或 GPU capture。Completed / Pass / Valid 仍要经过独立 A/B 比较，才能讨论 improved；不能由此推导 Agent 能力排名、零 GC 或个人已独立掌握全部实现。",
          "en": "Offline CI checks public artifacts and data contracts; it does not build Unity, run Players, or perform formal sampling. Frame intervals are not CPU Timeline or GPU captures. Even Completed / Pass / Valid requires a separate A/B comparison before an improved verdict; it establishes no agent ranking, zero-GC claim, or independent personal mastery."
        }
      }
    ],
    "figures": {
      "pipeline": {
        "reading": {
          "zh": "按从左到右读取三个责任阶段：运行前冻结源码、构建、配置并做预检；中间由 C# Runner 执行预热与采样；运行后导出、清理、绑定原始数据哈希并核验终态。箭头表达责任交接，不是 Agent 每帧驱动 UI。",
          "en": "Read three responsibility stages left to right: freeze source/build/config and preflight; let C# perform warmup and sampling; then export, clean up, bind raw-data hashes, and verify termination. Arrows indicate handoffs, not an agent driving the UI every frame."
        },
        "finding": {
          "zh": "中间明确 300 帧预热与 1800 帧采样。下方“正式采样期间不做额外工作”解释为何媒体录制和正式实验分离：截图、录像、逐帧工具调用和文件导出会改变被观察的运行。",
          "en": "The middle states 300 warmup and 1,800 measured frames. The lower exclusion block explains why media capture and formal experiments are separate: screenshots, recording, per-frame tool calls, and export can perturb execution."
        },
        "limit": {
          "zh": "流程图描述实验合同，不代表单凭流程存在就证明全部运行有效。构建/测试日志、Player 启动记录与 raw 数据需要分别核对；只有核验过的运行才进入统计。",
          "en": "The diagram specifies a protocol, not automatic proof that every run is valid. Build/test journals, Player launch records, and raw data require separate checks before a run enters statistics."
        }
      },
      "outcomes": {
        "reading": {
          "zh": "三列分别是 normal、注入 fail 和注入 invalid，不是一次运行的三个先后阶段。逐行比较 State、Correctness、Validity 和 exit：右列与左列同为 Completed / Pass，但有效性和退出码不同。",
          "en": "The three columns are normal, injected failure, and injected invalidity, not successive phases. Compare State, Correctness, Validity, and exit: the right and left columns both show Completed / Pass, but differ in validity and exit code."
        },
        "finding": {
          "zh": "normal 为 Valid / exit 0；fail 尚未运行正确性检查，得到 NotRun / NotAssessed / exit 1；invalid 可以完成工作和导出，却是 Invalid / exit 3。这正是“运行完成不等于测量有效”的具体反例。",
          "en": "Normal is Valid / exit 0. Failure has not run correctness checks and reports NotRun / NotAssessed / exit 1. Invalidity can finish work and export while reporting Invalid / exit 3: a concrete counterexample to completion implying valid measurement."
        },
        "limit": {
          "zh": "底部外层诊断通过，只表示正确识别三个预期结果。不能把 fail / invalid 纳入正式性能对照，也不能将此图视为 improved 的证据；它验证的是错误分类。",
          "en": "Passing the outer diagnostic means recognizing the three expected outcomes. Failed or invalid runs cannot enter formal comparisons, and this is evidence of error classification, not improved performance."
        }
      },
      "recovery": {
        "reading": {
          "zh": "左框记录列表前 14 次有效运行与下一次超时；中框只补剩余 36 次；右框是另一个主题的入口错误以及之后全新的 80 次渐变矩阵。列表恢复与渐变重跑不能拼成同一构建的连续实验。",
          "en": "The left block records 14 accepted List runs and a subsequent timeout; the middle completes only the remaining 36; the right describes a separate topic entry failure followed by a fresh 80-run Gradient matrix. These are not one continuous experiment on one build."
        },
        "finding": {
          "zh": "底部 14+36=50 与 80 共同解释正式 130 次有效运行的来历。原列表尝试的 185 个文件保留，最终 50 次形成 650 个精确文件；失败尝试无 raw，故保留启动/日志/终态而不虚构采样。",
          "en": "The 14+36=50 List runs and 80 Gradient runs explain the 130 valid total. The original List attempt retains 185 files, and the final 50 runs comprise 650 exact files. Failures without raw data retain launch/log/terminal records rather than fabricated samples."
        },
        "limit": {
          "zh": "这些是公开图表报告的历史恢复事实，不表示所有底层日志均公开。恢复证明了记录保留和身份核对过程，不构成“失败可以任意删除再跑”的统计许可。",
          "en": "These are historical recovery facts reported by public figures, not a claim that every underlying log is published. Recovery documents preservation and identity checks; it does not license arbitrary deletion and rerunning of failed observations."
        }
      }
    }
  }
};
