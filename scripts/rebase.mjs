// Prepares dist/ for hosting under a subpath, like a GitHub Pages project
// site (https://<user>.github.io/<repo>/). Every site-absolute link
// ("/team/") gets the base path in front ("/<repo>/team/").
//
// Env:
//   BASE_PATH  the subpath, e.g. "/TempOLVTSite". Empty or "/" leaves links alone.
//   NOINDEX=1  adds <meta name="robots" content="noindex"> so search engines
//              don't index a temporary copy of the site.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');
const base = (process.env.BASE_PATH ?? '').replace(/\/+$/, '');
const noindex = process.env.NOINDEX === '1';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

let count = 0;
for (const file of walk(dist).filter((f) => f.endsWith('.html'))) {
  let html = fs.readFileSync(file, 'utf8');
  if (base) {
    html = html.replace(/(href|src)="\/(?!\/)/g, `$1="${base}/`);
    html = html.replace(/url\((["']?)\/(?!\/)/g, `url($1${base}/`);
  }
  if (noindex && !html.includes('name="robots"')) {
    html = html.replace(/<head>/i, '<head><meta name="robots" content="noindex">');
  }
  fs.writeFileSync(file, html);
  count++;
}

// Cloudflare-only file; GitHub Pages ignores it.
fs.rmSync(path.join(dist, '_redirects'), { force: true });

console.log(`Rebased ${count} pages to "${base || '/'}"${noindex ? ', noindex added' : ''}`);
