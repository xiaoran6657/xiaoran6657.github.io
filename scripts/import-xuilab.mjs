import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/import-xuilab.mjs <local-XUILab-repository>');
const upstream = resolve(input);
const manifest = JSON.parse((await readFile(join(upstream, 'Docs/Showcase/PUBLISHING_INPUTS.json'), 'utf8')).replace(/^\uFEFF/, ''));
if (manifest.version !== 'v0.1.0-preview.1') throw new Error('Review content before changing the upstream version.');
const outputs = [];
for (const item of manifest.files) {
  let from, relative;
  if (item.path.startsWith('images/') && item.path.endsWith('.png')) {
    relative = item.path.slice('images/'.length);
    from = join(upstream, 'Docs/Showcase/Media', relative);
  } else if (item.path.endsWith('.mp4')) {
    relative = item.path.split('/').pop();
    from = join(upstream, item.source);
  } else continue;
  if (relative.includes('..')) throw new Error('Unsafe asset path');
  const bytes = await readFile(from);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  if (sha256 !== item.sha256) throw new Error('Upstream hash mismatch: ' + relative);
  const to = resolve('public/media/xuilab', relative);
  await mkdir(dirname(to), { recursive: true });
  await writeFile(to, bytes);
  outputs.push({ path: '/media/xuilab/' + relative, sha256, bytes: bytes.length });
}
if (outputs.filter(x => x.path.endsWith('.png')).length !== 12 || outputs.filter(x => x.path.endsWith('.mp4')).length !== 3) throw new Error('Expected 12 images and 3 videos');
await copyFile(join(upstream, 'LICENSE'), 'public/media/xuilab/LICENSE.txt');
await writeFile('public/media/xuilab/manifest.json', JSON.stringify({
  repository: 'https://github.com/xiaoran6657/XUILab',
  version: manifest.version,
  publicSourceCommit: '231c8161175c7edd8debfe7b75ac7aa6f4a9f020',
  measuredCandidate: manifest.candidate,
  description: 'Unmodified project graphics and frame-driven demos; not real-time performance recordings.',
  files: outputs
}, null, 2) + '\n');
console.log('Imported and SHA-256 verified ' + outputs.length + ' media files.');
