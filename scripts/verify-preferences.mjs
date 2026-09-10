import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const pages = {
  en: await readFile('dist/en/index.html', 'utf8'),
  zh: await readFile('dist/zh/index.html', 'utf8'),
  root: await readFile('dist/index.html', 'utf8'),
};
function loadPage({ page = 'en', dark = false, saved = {}, blocked = false, language = 'en-US', hash = '#selected-work' } = {}) {
  const values = new Map(Object.entries(saved));
  const button = { attrs: {}, listeners: {}, setAttribute(k, v) { this.attrs[k] = v; }, addEventListener(k, v) { this.listeners[k] = v; } };
  const toggle = { dataset: { language: page === 'en' ? 'zh' : 'en' }, hash: '', listeners: {}, addEventListener(k, v) { this.listeners[k] = v; } };
  const label = { textContent: '' };
  const meta = { setAttribute() {} };
  const html = { lang: page === 'en' ? 'en' : 'zh-CN', dataset: {} };
  const media = { matches: dark, listener: null, addEventListener(_, fn) { this.listener = fn; } };
  const location = { pathname: page === 'root' ? '/' : '/' + page + '/', search: '?from=test', hash, redirected: null, replace(url) { this.redirected = url; } };
  const document = { documentElement: html, querySelector(selector) { return ({ '#theme-toggle': button, '#theme-label': label, '[data-language]': toggle, 'meta[name="theme-color"]': meta })[selector] || null; } };
  const localStorage = { getItem(key) { if (blocked) throw new Error('Storage denied'); return values.get(key) ?? null; }, setItem(key, value) { if (blocked) throw new Error('Storage denied'); values.set(key, value); } };
  const context = vm.createContext({ document, localStorage, matchMedia: () => media, location, navigator: { language } });
  for (const match of pages[page].matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) vm.runInContext(match[1], context);
  return { html, media, label, button, toggle, values, location };
}
const auto = loadPage({ dark: true });
assert.equal(auto.html.dataset.preference, 'system');
assert.equal(auto.html.dataset.theme, 'dark');
assert.equal(auto.label.textContent, 'Auto');
auto.button.listeners.click();
assert.equal(auto.html.dataset.theme, 'light');
assert.equal(auto.values.get('portfolio-theme'), 'light');
auto.media.matches = true; auto.media.listener();
assert.equal(auto.html.dataset.theme, 'light', 'Manual theme overrides system');
auto.button.listeners.click();
assert.equal(auto.html.dataset.theme, 'dark');
auto.button.listeners.click();
assert.equal(auto.html.dataset.preference, 'system');
auto.media.matches = false; auto.media.listener();
assert.equal(auto.html.dataset.theme, 'light', 'Auto follows live system changes');

for (const preference of ['light', 'dark']) {
  const page = loadPage({ dark: preference !== 'dark', saved: { 'portfolio-theme': preference } });
  assert.equal(page.html.dataset.theme, preference, 'Manual theme survives reload');
}
assert.equal(loadPage({ saved: { 'portfolio-theme': 'invalid' } }).html.dataset.preference, 'system');
const chinese = loadPage({ page: 'zh', dark: true });
assert.equal(chinese.label.textContent, '自动');
chinese.button.listeners.click();
assert.equal(chinese.label.textContent, '浅色');
auto.toggle.listeners.click({ currentTarget: auto.toggle });
assert.equal(auto.values.get('portfolio-language'), 'zh');
assert.equal(auto.toggle.hash, '#selected-work');

const noStorage = loadPage({ blocked: true, dark: true });
noStorage.button.listeners.click();
assert.equal(noStorage.html.dataset.theme, 'light');
noStorage.toggle.listeners.click({ currentTarget: noStorage.toggle });
assert.equal(noStorage.toggle.hash, '#selected-work');
assert.equal(loadPage({ page: 'root', language: 'zh-TW' }).location.redirected, '/zh/?from=test#selected-work');
assert.equal(loadPage({ page: 'root', language: 'fr-FR' }).location.redirected, '/en/?from=test#selected-work');
assert.equal(loadPage({ page: 'root', saved: { 'portfolio-language': 'zh' }, language: 'en-US' }).location.redirected, '/zh/?from=test#selected-work');
assert.equal(loadPage({ page: 'root', blocked: true, language: 'en-US' }).location.redirected, '/en/?from=test#selected-work');
assert.equal(loadPage({ page: 'en', saved: { 'portfolio-language': 'zh' } }).location.redirected, null, 'Explicit locale routes stay authoritative');
console.log('Verified production preference scripts: system theme, manual overrides, persistence, language selection, hash/query retention, and blocked storage fallback.');
