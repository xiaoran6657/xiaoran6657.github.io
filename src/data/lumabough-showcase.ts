import type { Localized } from './profile';

export interface ShowcaseParameters {
  scene: 'shadow-bench' | 'cornell';
  shadow: 'hard' | 'pcf' | 'pcss';
  lightSize: number;
  bias: number;
  samples: number;
  indirect: 'direct' | 'bounce';
  width: number;
  height: number;
}

export interface ShowcasePreset {
  file: string;
  title: Localized;
  alt: Localized;
  reading: Localized;
  boundary: Localized;
  parameters: ShowcaseParameters;
}

const baseline: ShowcaseParameters = {
  scene: 'shadow-bench', shadow: 'pcss', lightSize: 0.65, bias: 0.004,
  samples: 64, indirect: 'direct', width: 960, height: 600
};

export const showcasePresets = {
  hard: {
    file: 'shadow-hard.png',
    title: { zh: '硬阴影', en: 'Hard shadows' },
    alt: { zh: '阴影测试台的硬阴影 GPU 输出', en: 'GPU output of hard shadows in the shadow bench' },
    reading: { zh: '先看地面轮廓和盒子接触处。每个接收点进行一次深度比较，visibility 只有明暗两种结果。', en: 'Start with the floor silhouette and box contacts. Each receiver uses one depth comparison, giving binary visibility.' },
    boundary: { zh: '阴影图为 1024×1024；此路径不使用过滤采样预算。', en: 'The shadow map is 1024×1024. This path does not use the filtering sample budget.' },
    parameters: { ...baseline, shadow: 'hard' }
  },
  pcf: {
    file: 'shadow-pcf.png',
    title: { zh: 'PCF · 固定 UV 核', en: 'PCF · Fixed UV kernel' },
    alt: { zh: '阴影测试台的固定 UV PCF GPU 输出', en: 'GPU output of fixed-UV PCF in the shadow bench' },
    reading: { zh: '平均邻域中的深度比较结果，让二值边界形成过渡。所有接收点使用同一 UV 过滤半径。', en: 'Averaging neighboring depth-comparison results turns a binary edge into a transition. All receivers use the same UV filtering radius.' },
    boundary: { zh: '固定核不能表达由遮挡距离决定的半影宽度；64 个方形 Hammersley taps 也不是连续积分。', en: 'A fixed kernel cannot express distance-dependent penumbrae. Its 64 square Hammersley taps are a finite approximation.' },
    parameters: { ...baseline, shadow: 'pcf' }
  },
  pcss: {
    file: 'shadow-pcss.png',
    title: { zh: 'PCSS · 距离相关的过滤核', en: 'PCSS · Distance-dependent filtering' },
    alt: { zh: '阴影测试台的 PCSS GPU 输出，比较不同遮挡高度附近的半影', en: 'GPU output of PCSS in the shadow bench, comparing penumbrae around different occluder heights' },
    reading: { zh: '先搜索并平均 blocker 深度，再估计半影半径并执行 PCF。对照接触处和悬空遮挡物下方的阴影宽度。', en: 'Search for blockers, average their depths, estimate a penumbra radius, then run PCF. Compare contact regions with shadows beneath elevated occluders.' },
    boundary: { zh: '搜索和过滤各用 64 taps。使用平行接收平面近似，多个 blocker 的均值不能还原完整遮挡分布。', en: 'Search and filtering each use 64 taps. The parallel-receiver approximation and mean blocker depth do not reconstruct a full occluder distribution.' },
    parameters: { ...baseline }
  },
  diagnostic: {
    file: 'shadow-pcss-diagnostic.png',
    title: { zh: 'PCSS 中间量', en: 'PCSS intermediate values' },
    alt: { zh: 'PCSS 诊断图：红色编码 blocker 深度，绿色编码 UV 过滤半径，蓝色编码遮挡量', en: 'PCSS diagnostic: red encodes blocker depth, green the UV filter radius, and blue occlusion' },
    reading: { zh: 'R = 平均 blocker 深度 / 8；G = UV 过滤半径 × 50；B = 1 − visibility。分开查看通道，可以对应搜索结果、过滤范围与最终遮挡。', en: 'R = mean blocker depth / 8; G = UV filter radius × 50; B = 1 − visibility. Read the channels separately to relate blocker search, filtering, and final occlusion.' },
    boundary: { zh: '这张 8-bit 图经过 clamp 和量化，颜色混合不代表材质。定量判断应读取同次运行的线性 diagnostics 数据。', en: 'This 8-bit view is clamped and quantized; mixed colors are not materials. Quantitative checks use the linear diagnostics from the same run.' },
    parameters: { ...baseline }
  },
  lightSmall: {
    file: 'shadow-light-small.png',
    title: { zh: '较小光源 · 0.15', en: 'Smaller light · 0.15' },
    alt: { zh: 'PCSS 光源完整边长 0.15 的阴影对照', en: 'PCSS comparison with a full light edge length of 0.15' },
    reading: { zh: '与右图只改变光源完整边长，观察半影过渡范围。', en: 'Only the full light edge length differs from the paired image. Compare the penumbra transition.' },
    boundary: { zh: '尺寸用于 visibility 近似；直接光保持同一中心点代理和强度。', en: 'Size controls the visibility approximation. Direct lighting retains the same center-point proxy and intensity.' },
    parameters: { ...baseline, lightSize: 0.15 }
  },
  lightLarge: {
    file: 'shadow-light-large.png',
    title: { zh: '较大光源 · 1.20', en: 'Larger light · 1.20' },
    alt: { zh: 'PCSS 光源完整边长 1.20 的阴影对照', en: 'PCSS comparison with a full light edge length of 1.20' },
    reading: { zh: '较大的光源参数扩大搜索窗口和估计半影；留意过渡宽度与有限采样的影响。', en: 'A larger light parameter expands blocker search and the estimated penumbra. Inspect transition width and finite-sample effects.' },
    boundary: { zh: '这不是完整矩形面光源辐射积分，也不用于比较光源功率。', en: 'This is not a full rectangular-area-light integral or a comparison of light power.' },
    parameters: { ...baseline, lightSize: 1.2 }
  },
  biasHigh: {
    file: 'shadow-bias-high.png',
    title: { zh: '过大 bias · 0.30', en: 'Excessive bias · 0.30' },
    alt: { zh: 'PCSS 使用 0.30 世界单位 bias 的反例', en: 'PCSS failure case with a world-space depth bias of 0.30' },
    reading: { zh: '与基线 0.004 对照，检查接触处的阴影脱离、漏光与 blocker 分类变化。', en: 'Compare against the 0.004 baseline for detached contact shadows, leaks, and changes in blocker classification.' },
    boundary: { zh: 'bias 的单位是沿光轴的线性世界深度，不是通用 API 常量或可直接移植的经验值。', en: 'Bias is measured in linear world depth along the light axis, not a universal API constant or portable tuning value.' },
    parameters: { ...baseline, bias: 0.3 }
  },
  samplesLow: {
    file: 'shadow-samples-low.png',
    title: { zh: '较低预算 · 每阶段 8 taps', en: 'Lower budget · 8 taps per phase' },
    alt: { zh: 'PCSS 搜索和过滤各 8 taps 的采样对照', en: 'PCSS comparison with 8 taps each for search and filtering' },
    reading: { zh: '与每阶段 64 taps 的基线比较过渡带中的颗粒、条纹和小遮挡物的搜索结果。', en: 'Compare against the 64-tap-per-phase baseline for grain, banding, and blocker-search results around small occluders.' },
    boundary: { zh: '固定确定性采样，没有时间累积。静态图片不能证明运动时的稳定性，也不能证明性能收益。', en: 'Sampling is fixed and deterministic, without temporal accumulation. A still image does not establish motion stability or a speedup.' },
    parameters: { ...baseline, samples: 8 }
  },
  cornellDirect: {
    file: 'cornell-direct.png',
    title: { zh: 'Cornell 风格小室 · 直接光', en: 'Cornell-style room · Direct light' },
    alt: { zh: '程序生成红绿墙和白盒小室的直接光 GPU 输出', en: 'Direct-light GPU output of the procedural room with red and green walls and white boxes' },
    reading: { zh: '用白色方块和接收面作为参照，先查看直接照明下的亮面与暗部。', en: 'Use the white boxes and receiver surfaces as references for directly lit faces and dark regions.' },
    boundary: { zh: '程序生成的开顶盒室，采用近似 RGB 材质，不是 Cornell 标定几何与光谱测量的复现。', en: 'This is a procedural open-top room with approximate RGB materials, not a reproduction of calibrated Cornell geometry or spectral measurements.' },
    parameters: { ...baseline, scene: 'cornell' }
  },
  cornellBounce: {
    file: 'cornell-bounce.png',
    title: { zh: 'Cornell 风格小室 · 加入一次反弹', en: 'Cornell-style room · Add one bounce' },
    alt: { zh: '同一小室加入一次 Lambert 漫反射反弹后的 GPU 输出', en: 'GPU output of the same room with one Lambertian diffuse bounce added' },
    reading: { zh: '左侧矮盒的暗面出现偏红的反射光，右侧高盒靠绿墙的区域偏绿。每个可见点用 256 个固定余弦加权方向估计一次反弹。', en: 'The low box receives reddish light on its dark face, while the tall box near the green wall takes on a green tint. Each visible point estimates one bounce with 256 fixed cosine-weighted directions.' },
    boundary: { zh: '第二段到光源采用解析硬可见性；无多次反弹、镜面 GI 或时间降噪，固定样本仍有结构误差。阴影 samples 参数不控制这 256 个间接光方向。', en: 'The second segment to the light uses analytic hard visibility. There are no further bounces, specular GI, or temporal denoising; fixed samples still leave structured error. The shadow samples setting does not control these 256 indirect-light directions.' },
    parameters: { ...baseline, scene: 'cornell', indirect: 'bounce' }
  }
} satisfies Record<string, ShowcasePreset>;

export const showcaseSource = 'docs/showcase/shadow-lab/';
