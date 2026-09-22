import { readFile, stat, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const root = resolve('dist');
const paths = ['', 'projects/', 'projects/battlewall/', 'projects/lumabough/', 'about/', 'projects/xuilab/', 'projects/xuilab/list-lab/', 'projects/xuilab/gradient-lab/', 'projects/xuilab/benchmark-runner/'];
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
  assert(!html.includes('G:\\Programming') && !html.includes('C:\\Users'), path + ': private path leak');
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
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
for (const path of pagePaths.filter(path => /^\/(zh|en)\//.test(path))) assert(sitemap.includes('https://xiaoran6657.github.io' + path), 'Sitemap missing ' + path);
console.log('Verified ' + pages.size + ' HTML pages: routes, links, fragments, languages, metadata, image descriptions, video policy, sitemap, and 23 media hashes.');
