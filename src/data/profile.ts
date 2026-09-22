export type Lang = 'zh' | 'en';
export type Localized = Record<Lang, string>;

// Public identity only. Empty resume/email fields hide their links.
export const profile = {
  name: { zh: '王佳豪', en: 'Jiahao Wang' },
  role: { zh: '游戏客户端 / 渲染工程开发', en: 'Game Client / Rendering Developer' },
  bio: {
    zh: '关注 Unity 客户端、C++ 渲染架构与可复现验证。从多人游戏的输入与状态协作，到 UI 实验和双图形后端，记录实现过程、设计取舍与证据。',
    en: 'Focused on Unity client development, C++ rendering architecture, and reproducible verification. From multiplayer input and state coordination to UI experiments and dual graphics backends, I document implementation, tradeoffs, and evidence.',
  },
  github: 'https://github.com/xiaoran6657',
  email: '2334399771@qq.com',
  phone: '18326431204',
  resume: { zh: '', en: '' },
};
export const languages: Lang[] = ['zh', 'en'];
export const localized = (value: Localized, lang: Lang) => value[lang];
