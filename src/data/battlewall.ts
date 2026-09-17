import type { Localized } from './profile';

export const battlewall = {
  title: 'BattleWall',
  subtitle: { zh: 'Unity 多人合作 PvPvE 攻城战', en: 'A multiplayer co-op PvPvE siege game in Unity' },
  summary: {
    zh: '在团队协作开发中参与客户端 gameplay，围绕角色输入、攻城载具、联机状态与死亡复活，梳理跨系统交互的一致性。',
    en: 'Contributed to client-side gameplay in a team-developed game, working on player input, siege vehicles, networked state, and death/respawn transitions.',
  },
  notice: {
    zh: '团队协作项目 · 非开源。本页展示个人参与的工作摘要与游戏演示，不提供项目源码或可运行构建。',
    en: 'Team project · Closed source. This page presents a summary of my contributions and a gameplay demo. Project source code and playable builds are not distributed.',
  },
};
export const contributions: { title: Localized; problem: Localized; flow: Localized; details: Localized[]; example: Localized; tradeoff: Localized }[] = [
  {
    "title": {
      "zh": "输入系统与模式切换",
      "en": "Input systems & mode transitions"
    },
    "problem": {
      "zh": "角色、载具、建造和死亡模式共享设备输入。分散的回调会让一次操作触发两次切换，也可能把上一模式的持续输入带进下一模式。",
      "en": "Character, vehicle, construction, and death modes share device input. Scattered callbacks can trigger a transition twice or carry held input into the next mode."
    },
    "flow": {
      "zh": "采集输入 → 区分连续状态与离散命令 → 校验模式 → 消费并清理",
      "en": "Collect input → Separate state from commands → Validate mode → Consume and clean up"
    },
    "details": [
      {
        "zh": "参与统一模式切换入口：校验允许的状态转移，拒绝重复切换，并集中管理 Action Map、光标和相机状态。",
        "en": "Helped consolidate mode transitions: validate allowed transitions, reject redundant changes, and coordinate Action Maps, cursor state, and camera behavior."
      },
      {
        "zh": "将移动、视角等连续输入保留为状态；将上下车、瞄准等离散操作转换为一次性 ECS 命令，由对应系统消费并在帧末清理。",
        "en": "Kept movement and look input as continuous state, while routing discrete actions such as vehicle entry, exit, and aiming through one-shot ECS commands, consumed by the relevant systems and cleaned up at frame end."
      },
      {
        "zh": "切换模式时清空持续输入与射击子状态；针对输入回调阶段加入过滤和状态守卫，避免按下与松开重复触发同一次切换。",
        "en": "Cleared held input and shooting substate during mode changes. Callback-phase filtering and state guards prevent press and release callbacks from repeating the same transition."
      }
    ],
    "example": {
      "zh": "按住移动键离开载具时，旧输入不应继续驱动车辆；载具内的瞄准作为子状态管理，退出载具时一并收束。",
      "en": "When leaving a vehicle while holding a movement key, stale input should not keep driving it. Aiming is a vehicle substate that is cleared together with vehicle mode."
    },
    "tradeoff": {
      "zh": "采集层只表达操作意图，玩法系统负责执行。新增模式需要同步维护转移规则、输入映射和清理流程。",
      "en": "Input collection expresses intent; gameplay systems execute it. Each new mode needs corresponding transition rules, input mappings, and cleanup."
    }
  },
  {
    "title": {
      "zh": "载具交互与权威校验",
      "en": "Vehicle interaction & authority"
    },
    "problem": {
      "zh": "上下车同时影响单驾驶座占用、角色控制、相机和 HUD。多人请求同一载具时，客户端不能自行认定自己已获得驾驶权。",
      "en": "Vehicle entry and exit affect a single driver seat, character control, camera, and HUD. When players request the same vehicle, a client cannot assume it has acquired control."
    },
    "flow": {
      "zh": "客户端请求 → 服务端校验与绑定 → 确认结果 → 更新本地输入与表现",
      "en": "Client request → Server validation and binding → Confirmation → Local input and presentation"
    },
    "details": [
      {
        "zh": "参与将进入载具整理为请求与确认流程：服务端检查玩家与目标是否有效、载具是否可用、座位占用及交互距离，再写入驾驶员绑定。",
        "en": "Worked on request-and-confirmation entry: the server validates the player and target, vehicle availability, seat occupancy, and interaction distance before assigning the driver."
      },
      {
        "zh": "区分所有玩家需要知道的驾驶状态和仅请求方需要处理的交互确认；本地相机、输入与 HUD 在确认后切换。",
        "en": "Separated shared driver state from confirmation intended for the requesting player. Local camera, input, and HUD changes follow acceptance."
      },
      {
        "zh": "等待结果时限制重复请求，并核对返回确认对应的目标；请求被拒绝后解除等待，避免过期确认干扰当前交互。",
        "en": "Gated duplicate requests while awaiting a result and matched confirmations to their target. Rejection releases the pending state, helping prevent stale confirmations from affecting current interaction."
      },
      {
        "zh": "退出流程以当前驾驶员身份为核心校验条件，避免行驶中的位置变化使正常退出被距离判断阻断。",
        "en": "Made current driver identity central to exit validation, so movement-related position changes do not block a legitimate exit through a proximity check."
      }
    ],
    "example": {
      "zh": "两个玩家争用同一驾驶座时，由服务端决定绑定；未获确认的一端维持原有控制模式，而不是先切换再回滚。",
      "en": "When two players compete for one seat, the server decides the binding. A client without acceptance keeps its existing control mode instead of switching optimistically and rolling back."
    },
    "tradeoff": {
      "zh": "确认后再切换减少了本地表现与权威状态冲突，但交互需要等待网络往返；这里讨论的是单驾驶座流程。",
      "en": "Waiting for confirmation reduces conflicts between local presentation and authoritative state, at the cost of a network round trip. This flow concerns a single driver seat."
    }
  },
  {
    "title": {
      "zh": "载具联机与远端表现",
      "en": "Vehicle networking & remote presentation"
    },
    "problem": {
      "zh": "载具移动、瞄准与驾驶状态需要在多端呈现一致的变化。直接追随离散更新会产生跳动，Host 上重复写入又会让模拟与表现互相覆盖。",
      "en": "Vehicle movement, aiming, and driver state need coherent presentation across peers. Following discrete updates directly creates jumps, while competing writes on the Host can make simulation and presentation overwrite each other."
    },
    "flow": {
      "zh": "输入意图 → 服务端模拟 → 状态快照 → 时间缓冲 → 插值呈现",
      "en": "Input intent → Server simulation → State snapshots → Time buffer → Interpolated presentation"
    },
    "details": [
      {
        "zh": "基于 Netcode for GameObjects 参与同步重构：客户端提交移动、转向与瞄准意图，由服务端计算结果，避免以客户端最终位置作为权威输入。",
        "en": "Contributed to synchronization using Netcode for GameObjects: clients submit movement, steering, and aiming intent; the server computes the result rather than trusting a client-provided final transform."
      },
      {
        "zh": "将车体位置、朝向、瞄准和驾驶状态纳入快照；服务端发布当前状态，使新加入的客户端可以获取现有载具状态。",
        "en": "Included vehicle position, orientation, aiming, and driver state in snapshots. Server-published current state allows newly joined clients to obtain existing vehicle state."
      },
      {
        "zh": "在表现端缓存带时间信息的快照，排除过期更新，选择渲染时间前后的状态，对位置和旋转分别插值。",
        "en": "Buffered timestamped snapshots on the presentation side, rejected stale updates, and selected states around render time to interpolate position and rotation."
      },
      {
        "zh": "区分 Host 的权威模拟与客户端的插值路径，避免同一对象被两条路径同时写入；同时梳理移动贴地和瞄准范围约束。",
        "en": "Separated Host simulation from client interpolation to avoid competing writers on the same object, alongside work on ground-following movement and bounded aiming."
      }
    ],
    "example": {
      "zh": "驾驶端提交操作，另一端通过快照观察载具变化；即使网络更新不是每个渲染帧到达，也可以在已有状态之间平滑呈现。",
      "en": "The driver submits controls while the other peer observes snapshot updates. Presentation can interpolate between known states even when updates do not arrive on every rendered frame."
    },
    "tradeoff": {
      "zh": "这是状态同步，不是帧同步。缓冲插值以额外显示延迟换取平滑度；不将其描述为客户端预测、回滚校正或已经测得的性能提升。",
      "en": "This is state synchronization, not lockstep. Buffered interpolation trades display latency for smoothness; it is not presented as client prediction, reconciliation, or a measured performance improvement."
    }
  },
  {
    "title": {
      "zh": "死亡复活与跨系统时序",
      "en": "Death, respawn & cross-system ordering"
    },
    "problem": {
      "zh": "玩家在载具中瞄准时死亡，涉及瞄准退出、驾驶权释放、角色冻结和输入切换。固定等待几秒无法保证服务端确认已到达。",
      "en": "Death while aiming from a vehicle involves leaving aim mode, releasing control, freezing the character, and switching input. A fixed delay cannot ensure that server confirmation has arrived."
    },
    "flow": {
      "zh": "结束瞄准 → 请求下车 → 保留待处理死亡状态 → 确认退出 → 进入死亡模式",
      "en": "Leave aim mode → Request exit → Retain pending death state → Confirm exit → Enter death mode"
    },
    "details": [
      {
        "zh": "参与以跨帧待处理状态保存死亡意图，将后续切换连接到服务端退出确认，而不是依赖固定延时或单次回调恰好按顺序到达。",
        "en": "Helped retain death intent across frames and connect subsequent transitions to server-confirmed exit, instead of relying on fixed delays or callbacks arriving in an assumed order."
      },
      {
        "zh": "沿合法的模式转移顺序退出载具，再进入死亡模式；对重复死亡通知和重复状态切换增加守卫。",
        "en": "Sequenced vehicle exit and death through valid mode transitions, with guards against repeated death notifications and redundant transitions."
      },
      {
        "zh": "复活流程协调权威状态、生命与移动恢复、本地输入及位置更新；在完成对应步骤后再清理待处理标记。",
        "en": "Coordinated authoritative state, health and movement restoration, local input, and relocation during respawn, clearing pending markers after the relevant steps complete."
      },
      {
        "zh": "排查传送时 CharacterController 与位置写入的先后关系，以及相机、HUD、输入是否同步恢复，将问题拆成权威状态与本地表现两条线定位。",
        "en": "Investigated ordering between CharacterController handling and position writes during relocation, alongside camera, HUD, and input restoration, tracing authority and local presentation separately."
      }
    ],
    "example": {
      "zh": "退出确认较晚到达时，死亡意图仍可保留并衔接后续切换；复活不仅是恢复生命值，还需要恢复可操作的角色状态。",
      "en": "If exit confirmation arrives late, pending death intent can still drive the next transition. Respawn restores an operable character, rather than only resetting health."
    },
    "tradeoff": {
      "zh": "跨系统流程需要同时维护等待、确认和恢复路径。这里总结参与的实现思路，不宣称所有断线或异常时序均已验证。",
      "en": "Cross-system flows require waiting, confirmation, and recovery paths to be maintained together. These are implementation contributions, not a claim that every disconnect or timing edge case has been validated."
    }
  }
];
