import results from './uefoglab-results.json';
export const uefoglab = {
  results,
  dynamic: {
    commit: "9cffcfaab575903e5e472d29de3b260b8508d284",
    guide: "https://github.com/xiaoran6657/UEFogLab/blob/9cffcfaab575903e5e472d29de3b260b8508d284/docs/DYNAMIC-SHOWCASE.md",
    published: true,
  },
  source: {
    repository: 'https://github.com/xiaoran6657/UEFogLab',
    tag: 'https://github.com/xiaoran6657/UEFogLab/tree/v0.1.0-preview.1',
    version: 'v0.1.0-preview.1',
    commit: 'e805a290fa8bc2ed94c64d85bfa02db31e256abc',
    quickstart: 'https://github.com/xiaoran6657/UEFogLab/blob/v0.1.0-preview.1/docs/QUICKSTART.md',
    license: 'https://github.com/xiaoran6657/UEFogLab/blob/v0.1.0-preview.1/LICENSE',
    notice: 'https://github.com/xiaoran6657/UEFogLab/blob/v0.1.0-preview.1/NOTICE.md',
  },
  summary: {
    zh: '局部雾积分、S/T 重建与可复现的质量和成本。固定真机场景中，Half 积分更便宜，但重建使总雾成本更高；Full64 保持默认。',
    en: 'Local fog integration, S/T reconstruction, and reproducible quality and cost. Half integration is cheaper in the measured mobile fixture, while reconstruction raises total fog cost. Full64 stays the default.',
  },
  subtitle: { zh: '局部雾积分与深度引导重建', en: 'Local fog integration & depth-guided reconstruction' },
  status: { zh: 'MIT · 固定夹具实验', en: 'MIT · Fixed-fixture study' },
};
