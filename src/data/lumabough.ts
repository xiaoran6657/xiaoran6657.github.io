import type { Localized } from './profile';

const repo = 'https://github.com/xiaoran6657/LumaBough';
const tag = 'v0.2.0-shadow-lab';

export const lumabough = {
  repo,
  tag,
  source: `${repo}/blob/${tag}/`,
  release: `${repo}/releases/tag/${tag}`,
  showcase: 'docs/showcase/shadow-lab/',
  summary: {
    zh: '用 C++20 / HLSL 做软阴影与光照实验。在固定场景比较硬阴影、PCF 和 PCSS，逐项调整光源尺寸、bias 与采样预算；再用 Cornell 风格小室观察一次漫反射反弹。',
    en: 'Soft-shadow and lighting experiments in C++20 / HLSL. A fixed scene compares hard shadows, PCF, and PCSS while varying light size, bias, and sample budget. A Cornell-style room adds a single diffuse bounce.'
  }
};

export const lumaboughArchive = {
  repo,
  tag: 'v0.1.0-preview',
  source: `${repo}/blob/v0.1.0-preview/`,
  release: `${repo}/releases/tag/v0.1.0-preview`
};

export const topics: { title: Localized; text: Localized }[] = [
  {
    title: { zh: '阴影方法对照', en: 'Compare shadow methods' },
    text: {
      zh: '同一场景与相机下切换硬阴影、PCF、PCSS，结合 visibility、blocker 和半影诊断理解结果。',
      en: 'Compare hard shadows, PCF, and PCSS with a fixed scene and camera, supported by visibility, blocker, and penumbra diagnostics.'
    }
  },
  {
    title: { zh: '参数与失败案例', en: 'Parameters and failure cases' },
    text: {
      zh: '逐项改变光源尺寸、比较 bias 和采样预算，保留阴影悬浮与低采样噪声等对照。',
      en: 'Change light size, comparison bias, and sampling budget individually, retaining excessive-bias and low-sample comparisons.'
    }
  },
  {
    title: { zh: '一次漫反射反弹', en: 'One diffuse bounce' },
    text: {
      zh: '程序生成的 Cornell 风格小室比较直接光与一次反弹；说明红绿墙的颜色渗透和近似范围。',
      en: 'A procedural Cornell-style room compares direct lighting with one diffuse bounce and explains color bleeding and approximation limits.'
    }
  }
];
