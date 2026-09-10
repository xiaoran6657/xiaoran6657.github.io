export type Lang = 'zh' | 'en';
export type Localized = Record<Lang, string>;

// Public identity only. Empty resume/email fields hide their links.
export const profile = {
  name: { zh: 'xiaoran6657', en: 'xiaoran6657' },
  role: { zh: 'Unity / UI 工程探索', en: 'Exploring Unity & UI engineering' },
  bio: {
    zh: '围绕 Unity 界面、渲染细节与性能测量，记录从问题、实现到验证的过程。这里收录我的开源项目与工程实验。',
    en: 'Exploring Unity interfaces, rendering details, and performance measurement. A collection of open-source projects and engineering experiments, from questions to implementation and verification.',
  },
  github: 'https://github.com/xiaoran6657',
  email: '',
  resume: { zh: '', en: '' },
};
export const languages: Lang[] = ['zh', 'en'];
export const localized = (value: Localized, lang: Lang) => value[lang];
