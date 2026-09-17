import type { APIRoute } from 'astro';
import { cases } from '../data/xuilab';
import { languages } from '../data/profile';
export const GET: APIRoute = ({ site }) => {
  const paths = ['', 'projects/', 'projects/battlewall/', 'about/', 'projects/xuilab/', ...cases.map(item => 'projects/xuilab/' + item.slug + '/')];
  const urls = languages.flatMap(lang => paths.map(path => '<url><loc>' + new URL('/' + lang + '/' + path, site).href + '</loc></url>'));
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.join('') + '</urlset>', { headers: { 'Content-Type': 'application/xml' } });
};
