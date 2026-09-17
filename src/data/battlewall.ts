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
export const contributions: { title: Localized; problem: Localized; work: Localized; tradeoff: Localized }[] = [
  {
    title: { zh: '输入系统与模式切换', en: 'Input systems & mode transitions' },
    problem: { zh: '角色、载具、建造与死亡状态共享输入时，分散的回调容易导致重复切换和输入残留。', en: 'Input shared across character, vehicle, construction, and death states can leave stale input or trigger repeated transitions when callbacks are scattered.' },
    work: { zh: '参与统一输入模式切换与状态约束，将离散操作转换为一次性 ECS 命令，并在模式切换时清理连续输入状态。', en: 'Helped consolidate mode transitions and state guards, convert discrete actions into one-shot ECS commands, and clear continuous input when switching modes.' },
    tradeoff: { zh: '输入采集、命令消费和状态切换各有边界；新增模式需要同步维护转移规则与清理逻辑。', en: 'Input collection, command consumption, and state transitions have separate responsibilities. New modes need matching transition rules and cleanup.' },
  },
  {
    title: { zh: '载具交互与权威校验', en: 'Vehicle interaction & authority' },
    problem: { zh: '玩家上下车同时涉及座位占用、角色控制、相机和 HUD，多端各自修改状态容易发生冲突。', en: 'Entering or leaving a vehicle touches seat occupancy, character control, camera, and HUD. Independent state changes on different peers can conflict.' },
    work: { zh: '参与将上下车流程整理为客户端请求、服务端校验与确认后的本地表现更新，区分驾驶员绑定和表现层状态。', en: 'Worked on a request-and-confirmation flow: the client requests entry or exit, the server validates it, and local presentation follows confirmation. Driver binding is separated from presentation state.' },
    tradeoff: { zh: '确认流程优先保证状态一致性，也需要承担网络往返带来的交互延迟。', en: 'The confirmation flow prioritizes consistent state while adding network round-trip latency to interaction.' },
  },
  {
    title: { zh: '载具联机与远端表现', en: 'Vehicle networking & remote presentation' },
    problem: { zh: '联机载具需要在移动、瞄准和驾驶状态之间保持一致，同时处理网络抖动及 Host/Client 行为差异。', en: 'Networked vehicles must keep movement, aiming, and driver state coherent while handling jitter and differences between Host and Client behavior.' },
    work: { zh: '基于 Netcode for GameObjects 参与载具同步重构：客户端提交输入意图，服务端模拟并发布状态快照，客户端通过插值呈现变化；区分 Host 的权威模拟与远端表现，避免重复写入。', en: 'Contributed to vehicle synchronization using Netcode for GameObjects: clients submit input intent, the server simulates and publishes snapshots, and clients interpolate presentation. Host authority and remote presentation are separated to avoid competing writes.' },
    tradeoff: { zh: '这里采用状态同步，不是帧同步。平滑表现会引入额外延迟；本页不将设计目标写成实测性能收益。', en: 'This uses state synchronization, not lockstep. Smoother presentation introduces latency; design goals are not presented as measured performance gains.' },
  },
  {
    title: { zh: '死亡复活与跨系统时序', en: 'Death, respawn & cross-system ordering' },
    problem: { zh: '驾驶载具时死亡，需要协调退出载具、冻结角色和切换输入，固定等待时间难以应对网络时序变化。', en: 'Dying while driving requires coordinated vehicle exit, character freezing, and input changes. Fixed delays cannot reliably accommodate changing network timing.' },
    work: { zh: '参与用待处理状态与服务端确认衔接后续切换，并通过状态守卫避免重复执行死亡和复活流程。排查问题时分别观察输入、权威状态和表现层的写入。', en: 'Worked on pending state and server confirmation to sequence subsequent transitions, with state guards against repeated death or respawn processing. Debugging separates input, authoritative state, and presentation writes.' },
    tradeoff: { zh: '确认与恢复路径需要一起考虑。本页是工作经历摘要，不是完整系统审计或对所有异常场景的通过声明。', en: 'Confirmation and recovery paths need to be considered together. This is a contribution summary, not a complete system audit or a claim that every edge case has passed.' },
  },
];
