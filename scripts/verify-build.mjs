import { readFile, stat, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const root = resolve('dist');
const paths = ['', 'projects/', 'projects/battlewall/', 'projects/lumabough/', 'projects/uefoglab/', 'about/', 'projects/xuilab/', 'projects/xuilab/list-lab/', 'projects/xuilab/gradient-lab/', 'projects/xuilab/benchmark-runner/'];
const pagePaths = ['/','/404.html', ...['zh','en'].flatMap(lang => paths.map(path => '/' + lang + '/' + path))];
const pages = new Map();
for (const path of pagePaths) {
  const html = await readFile(join(root, path.endsWith('/') ? path + 'index.html' : path), 'utf8');
  pages.set(path, html);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, path + ': one h1');
  assert.match(html, /<meta name="description"/, path + ': description');
  assert.match(html, /<link rel="canonical"/, path + ': canonical');
  const lang = path.startsWith('/en/') ? 'en' : 'zh-CN';
  assert.match(html, new RegExp('<html lang="' + lang + '"'), path + ': document language');
  assert(!/[A-Za-z]:[\\/](?:Programming|Users)[\\/]/i.test(html), path + ': private path leak');
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(match[0], /\balt="[^"]+"/, path + ': image alt');
    assert.match(match[0], /\bwidth="/, path + ': image dimensions');
    assert.match(match[0], /\bheight="/, path + ': image dimensions');
  }
  for (const match of html.matchAll(/<video\b[^>]*>/g)) {
    assert.match(match[0], /\bcontrols\b/, path + ': video controls');
    assert.match(match[0], /preload="none"/, path + ': no automatic video transfer');
    assert(!/\bautoplay\b/.test(match[0]), path + ': no autoplay');
  }
}
for (const [path, html] of pages) {
  for (const match of html.matchAll(/(?:href|src|poster)="([^"]*)"/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (!value || /^(https?:|mailto:|tel:|data:)/.test(value)) continue;
    const url = new URL(value, 'https://local.test' + path);
    const target = decodeURIComponent(url.pathname);
    const file = join(root, target.endsWith('/') ? target + 'index.html' : target);
    assert((await stat(file)).isFile(), path + ': missing ' + target);
    if (url.hash && pages.has(target)) {
      assert(pages.get(target).includes('id="' + decodeURIComponent(url.hash.slice(1)) + '"'), path + ': missing anchor ' + value);
    }
  }
}
const manifest = JSON.parse(await readFile(join(root, 'media/xuilab/manifest.json'), 'utf8'));
assert.equal(manifest.files.length, 15);
for (const asset of manifest.files) {
  const bytes = await readFile(join(root, asset.path));
  assert.equal(bytes.length, asset.bytes, asset.path + ': length');
  assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, asset.path + ': hash');
}

const battlewallManifest = JSON.parse(await readFile(join(root, 'media/battlewall/manifest.json'), 'utf8'));
assert.equal(battlewallManifest.files.length, 2);
assert.deepEqual((await readdir(join(root, 'media/battlewall'))).sort(), ['NOTICE.txt', 'demo-dual.mp4', 'manifest.json', 'poster-dual.jpg']);
for (const asset of battlewallManifest.files) {
  const bytes = await readFile(join(root, asset.path));
  assert.equal(bytes.length, asset.bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256);
}
for (const lang of ['zh', 'en']) {
  const html = pages.get('/' + lang + '/projects/battlewall/');
  assert(!/InterviewQA|ResumeBullets|Assets\/Script|PersonalKnowledgeBase|<code[ >]|<pre[ >]/.test(html), 'Private preparation or implementation must not leak');
  assert(html.includes(lang === 'zh' ? '非开源' : 'Closed source'), 'Closed-source label required');
}
const lb = JSON.parse(await readFile(join(root, 'media/lumabough/manifest.json'), 'utf8'));
assert.equal(lb.files.length, 6);
for (const asset of lb.files) { const bytes = await readFile(join(root, asset.path)); assert.equal(bytes.length, asset.bytes); assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256); }

const shadowRoot = 'media/lumabough/shadow-lab';
const shadow = JSON.parse(await readFile(join(root, shadowRoot, 'manifest.json'), 'utf8'));
const shadowNames = ['shadow-hard.png', 'shadow-pcf.png', 'shadow-pcss.png', 'shadow-pcss-diagnostic.png', 'shadow-light-small.png', 'shadow-light-large.png', 'shadow-bias-high.png', 'shadow-samples-low.png', 'cornell-direct.png', 'cornell-bounce.png'];
assert.equal(shadow.tag, 'v0.2.0-shadow-lab');
assert.match(shadow.tagCommit, /^[0-9a-f]{40}$/);
assert.equal(shadow.files.length, shadowNames.length);
assert.deepEqual((await readdir(join(root, shadowRoot))).sort(), ['manifest.json', ...shadowNames].sort());
assert.deepEqual(shadow.files.map(asset => asset.path).sort(), shadowNames.map(name => '/' + shadowRoot + '/' + name).sort());
const shadowBase = { scene: 'shadow-bench', shadow: 'pcss', lightSize: 0.65, bias: 0.004, samples: 64, indirect: 'direct', width: 960, height: 600 };
const shadowOverrides = {
  'shadow-hard.png': { shadow: 'hard' },
  'shadow-pcf.png': { shadow: 'pcf' },
  'shadow-light-small.png': { lightSize: 0.15 },
  'shadow-light-large.png': { lightSize: 1.2 },
  'shadow-bias-high.png': { bias: 0.3 },
  'shadow-samples-low.png': { samples: 8 },
  'cornell-direct.png': { scene: 'cornell' },
  'cornell-bounce.png': { scene: 'cornell', indirect: 'bounce' }
};
for (const asset of shadow.files) {
  const name = asset.path.split('/').at(-1);
  assert.equal(asset.sourcePath, 'docs/showcase/shadow-lab/media/' + name);
  const bytes = await readFile(join(root, asset.path));
  assert.equal(bytes.length, asset.bytes, asset.path + ': length');
  assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, asset.path + ': hash');
  assert.equal(bytes.subarray(0, 16).toString('hex'), '89504e470d0a1a0a0000000d49484452', asset.path + ': PNG IHDR');
  assert.equal(bytes.readUInt32BE(16), 960, asset.path + ': PNG width');
  assert.equal(bytes.readUInt32BE(20), 600, asset.path + ': PNG height');
  assert.equal(asset.width, 960);
  assert.equal(asset.height, 600);
  const expected = { ...shadowBase, ...shadowOverrides[name] };
  assert.deepEqual(Object.keys(asset.parameters).sort(), Object.keys(expected).sort(), asset.path + ': parameter allowlist');
  for (const [key, value] of Object.entries(expected)) {
    const actual = asset.parameters[key];
    if (key === 'lightSize' || key === 'bias') {
      assert.equal(typeof actual, 'number');
      assert(Number.isFinite(actual) && Math.abs(actual - value) <= Math.max(1e-7, Math.abs(value) * 1e-6), asset.path + ': ' + key);
    } else {
      assert.equal(actual, value, asset.path + ': ' + key);
    }
  }
}
const fog = JSON.parse(await readFile(join(root, 'media/uefoglab/manifest.json'), 'utf8'));
assert.equal(fog.files.length, 10);
for (const asset of fog.files) {
  const bytes = await readFile(join(root, asset.path));
  assert.equal(bytes.length, asset.bytes, asset.path + ': length');
  assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, asset.path + ': hash');
}
const fogSourceData = await readFile('src/data/uefoglab-results.json');
const fogPublicData = await readFile(join(root, 'media/uefoglab/results.json'));
assert.equal(createHash('sha256').update(fogSourceData).digest('hex'), createHash('sha256').update(fogPublicData).digest('hex'), 'UEFogLab source/public data drift');
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
for (const path of pagePaths.filter(path => /^\/(zh|en)\//.test(path))) assert(sitemap.includes('https://xiaoran6657.github.io' + path), 'Sitemap missing ' + path);
const mediaCount = manifest.files.length + battlewallManifest.files.length + lb.files.length + shadow.files.length + fog.files.length + 2;
console.log('Verified ' + pages.size + ' HTML pages: routes, links, fragments, languages, metadata, image descriptions, video policy, sitemap, and ' + mediaCount + ' media hashes.');

// Actual public UEFogLab source identity and pinned links.
const fogResults = JSON.parse(fogPublicData.toString('utf8'));
assert.equal(fogResults.sourcePublication.sourcePublished, true);
assert.equal(fogResults.sourcePublication.commit, 'e805a290fa8bc2ed94c64d85bfa02db31e256abc');
assert.equal(fogResults.sourcePublication.tag, 'v0.1.0-preview.1');
assert.equal(fog.sourcePublication.commit, 'e805a290fa8bc2ed94c64d85bfa02db31e256abc');
for (const lang of ['zh', 'en']) {
  const html = await readFile(join(root, lang, 'projects/uefoglab/index.html'), 'utf8');
  for (const url of ['https://github.com/xiaoran6657/UEFogLab', 'https://github.com/xiaoran6657/UEFogLab/tree/v0.1.0-preview.1', 'https://github.com/xiaoran6657/UEFogLab/blob/v0.1.0-preview.1/docs/QUICKSTART.md', 'https://github.com/xiaoran6657/UEFogLab/blob/v0.1.0-preview.1/LICENSE', 'https://github.com/xiaoran6657/UEFogLab/blob/v0.1.0-preview.1/NOTICE.md']) assert(html.includes('href="' + url + '"'), 'Missing pinned source link ' + url);
  assert(!html.includes('source repository has not been created') && !html.includes('源码仓库尚未创建'));
}

// M6 is a new motion edition; retain the ten historical media bindings above.
const motion = JSON.parse(await readFile(join(root, 'media/uefoglab/m6-dynamic-20261031/manifest.json'), 'utf8'));
assert.equal(motion.files.length, 2);
assert.equal(motion.source.commit, 'f1b0a55d68dcdc4e55fcdf14a6126af86f3c4bbb');
assert.equal(motion.frames, 1080);
assert.equal(motion.durationSeconds, 36);
for (const asset of motion.files) {
  const bytes = await readFile(join(root, asset.path));
  assert.equal(bytes.length, asset.bytes, asset.path + ': motion bytes');
  assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, asset.path + ': motion SHA');
  if (asset.path.endsWith('.png')) {
    assert.equal(bytes.readUInt32BE(16), 1920);
    assert.equal(bytes.readUInt32BE(20), 1280);
  }
}
for (const lang of ['zh','en']) {
  const html = await readFile(join(root,lang,'projects/uefoglab/index.html'),'utf8');
  assert(html.includes('/media/uefoglab/m6-dynamic-20261031/dynamic-showcase.mp4'));
  assert(html.includes('/media/uefoglab/m6-dynamic-20261031/dynamic-poster.png'));
  assert(html.includes(motion.source.guide));
  assert(!html.includes('src="/media/uefoglab/showcase.mp4"'));
  assert(!html.includes('48-second still-image edit') && !html.includes('48 秒静帧剪辑'));
  assert.equal([...html.matchAll(/<video\b/g)].length, 1);
}
console.log('Verified M6 continuous-motion edition, source identity, 2 media hashes and bilingual single-player replacement.');
