// Turns the built site in dist/ into a self-contained preview in preview/
// that works without a web server's clean-URL routing: every internal link
// becomes a relative link to an .html file, and the font is embedded.
// Used for sharing the review build as a Claude artifact. Not needed for
// deploying the real site.
//
// Usage: npm run build:artifact
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const out = path.join(root, 'preview');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const fontFile = path.join(dist, 'fonts', 'archivo-latin-wdth-normal.woff2');
const fontData = `data:font/woff2;base64,${fs.readFileSync(fontFile).toString('base64')}`;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

/** Map a site-absolute URL ("/team/", "/vehicles/x/#a") to a file path. */
function target(url) {
  const [pathPart, hash = ''] = url.split('#');
  let p = pathPart;
  if (p === '/' || p === '') p = 'home.html';
  else if (p.endsWith('/')) p = `${p.slice(1)}index.html`;
  else if (!path.extname(p)) p = `${p.slice(1)}/index.html`;
  else p = p.slice(1);
  return hash ? `${p}#${hash}` : p;
}

const pages = walk(dist).filter((f) => f.endsWith('.html') && !f.endsWith('404.html'));
const written = [];

for (const file of pages) {
  let rel = path.relative(dist, file).split(path.sep).join('/');
  if (rel === 'index.html') rel = 'home.html';
  const depth = rel.split('/').length - 1;
  const prefix = '../'.repeat(depth);

  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<link rel="preload"[^>]*as="font"[^>]*>/g, '');
  html = html.replace(/url\((["']?)\/fonts\/archivo-latin-wdth-normal\.woff2\1\)/g, `url("${fontData}")`);
  html = html.replace(/(href|src)="(\/(?!\/)[^"]*)"/g, (_, attr, url) => `${attr}="${prefix}${target(url)}"`);

  const dest = path.join(out, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  written.push(rel);

  if (rel === 'home.html') {
    // The artifact host wraps its entry page in its own document, so the
    // entry copy of the home page drops the outer document tags.
    const inner = html
      .replace(/<!DOCTYPE html>/i, '')
      .replace(/<html[^>]*>/i, '')
      .replace(/<\/html>/i, '')
      .replace(/<head>/i, '')
      .replace(/<\/head>/i, '')
      .replace(/<body[^>]*>/i, '')
      .replace(/<\/body>/i, '')
      .replace(/<title>[^<]*<\/title>/i, '<title>OLVT Website Prototype</title>');
    fs.writeFileSync(path.join(out, 'index.html'), inner.trim());
  }
}

fs.copyFileSync(path.join(dist, 'favicon.svg'), path.join(out, 'favicon.svg'));
written.push('favicon.svg');

// A files map for publishing: every page except the entry index.html.
const files = Object.fromEntries(written.map((r) => [r, `preview/${r}`]));
fs.writeFileSync(path.join(out, 'files.json'), JSON.stringify(files, null, 2));
console.log(`Preview written to preview/ (${written.length} files + index.html)`);
