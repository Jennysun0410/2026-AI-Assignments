#!/usr/bin/env node
// Generates index.html gallery from submissions/*/
// Run from repo root: node scripts/build-gallery.js
// No npm install required — Node.js built-ins only.

const fs = require('fs');
const path = require('path');

const SUBMISSIONS_DIR = path.join(__dirname, '..', 'submissions');
const OUTPUT_FILE = path.join(__dirname, '..', 'index.html');

function extractTitle(htmlPath) {
  try {
    const content = fs.readFileSync(htmlPath, 'utf8');
    const match = content.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match ? match[1].trim() : '(無標題)';
  } catch {
    return '(無標題)';
  }
}

function findThumbnail(dirPath) {
  for (const name of ['thumbnail.png', 'thumbnail.jpg', 'thumbnail.jpeg']) {
    if (fs.existsSync(path.join(dirPath, name))) return name;
  }
  return null;
}

// Collect and sort submissions alphabetically by directory name
const entries = fs.readdirSync(SUBMISSIONS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== 'EXAMPLE-範例')
  .map(d => d.name)
  .sort();

// Include EXAMPLE at the end if present (for smoke-test visibility)
const exampleExists = fs.existsSync(path.join(SUBMISSIONS_DIR, 'EXAMPLE-範例'));

const allDirs = exampleExists ? [...entries, 'EXAMPLE-範例'] : entries;

function readUrlTxt(dirPath) {
  try {
    const lines = fs.readFileSync(path.join(dirPath, 'url.txt'), 'utf8')
      .split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const url = lines[0] || null;
    const title = lines[1] || null;   // optional second line
    return url ? { url, title } : null;
  } catch {
    return null;
  }
}

function buildCard(dirName) {
  const dirPath = path.join(SUBMISSIONS_DIR, dirName);
  const thumbFile = findThumbnail(dirPath);
  const thumbSrc = thumbFile ? `submissions/${dirName}/${thumbFile}` : null;

  const urlInfo = readUrlTxt(dirPath);
  const isExternal = urlInfo !== null;
  const linkHref = isExternal ? urlInfo.url : `submissions/${dirName}/index.html`;
  // Title priority: url.txt second line → html <title> → directory name
  const title = isExternal
    ? (urlInfo.title || dirName)
    : extractTitle(path.join(dirPath, 'index.html'));
  const badge = isExternal ? `<span style="font-size:11px;color:#7eb8f7;margin-left:6px;">🔗 外部連結</span>` : '';

  const thumbnail = thumbSrc
    ? `<img src="${thumbSrc}" alt="${title}" style="width:100%;height:180px;object-fit:cover;display:block;">`
    : `<div style="width:100%;height:180px;background:#ccc;display:flex;align-items:center;justify-content:center;color:#666;font-size:14px;">No Thumbnail</div>`;

  return `
    <div style="border:1px solid #ddd;border-radius:8px;overflow:hidden;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,.08);">
      <a href="${linkHref}" target="_blank" rel="noopener" style="display:block;text-decoration:none;color:inherit;">
        ${thumbnail}
        <div style="padding:12px 14px;">
          <div style="font-size:15px;font-weight:600;margin-bottom:4px;color:#222;">${title}${badge}</div>
          <div style="font-size:12px;color:#888;">${dirName}</div>
        </div>
      </a>
    </div>`;
}

const cards = allDirs.map(buildCard).join('\n');
const count = allDirs.length;

const html = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>DITLDESIGN 2026 AI 訓練課程 — 作業展示</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f5f5f7; color: #333; min-height: 100vh; }
    header { background: #1a1a2e; color: #fff; padding: 20px 24px; }
    header .header-inner { display: flex; align-items: center; gap: 18px; }
    header .logo { width: 52px; height: 52px; border-radius: 6px; flex-shrink: 0; }
    header .header-text h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
    header .header-text p { font-size: 13px; color: #aaa; }
    header nav { margin-top: 10px; }
    header nav a { color: #7eb8f7; font-size: 13px; text-decoration: none; margin-right: 20px; }
    header nav a:hover { text-decoration: underline; }
    main { max-width: 1100px; margin: 32px auto; padding: 0 20px; }
    .meta { font-size: 13px; color: #888; margin-bottom: 20px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
    .empty { text-align: center; padding: 60px 20px; color: #aaa; font-size: 15px; }
    footer { text-align: center; padding: 32px 20px; font-size: 12px; color: #bbb; }
  </style>
</head>
<body>
  <header>
    <div class="header-inner">
      <img src="assets/logo.jpg" alt="DITLDESIGN" class="logo">
      <div class="header-text">
        <h1>DITLDESIGN 2026 AI 訓練課程 — 作業展示</h1>
        <p>共 ${count} 件作業</p>
      </div>
    </div>
    <nav>
      <a href="git-guide.html">繳交作業流程說明</a>
    </nav>
  </header>
  <main>
    <p class="meta">依學號排序 · 點擊卡片在新分頁開啟作業</p>
    ${count === 0
      ? '<div class="empty">尚無作業。學生提交並審核通過後將自動出現於此。</div>'
      : `<div class="grid">${cards}\n    </div>`}
  </main>
  <footer>drhhtang-pixel / 2026-AI-Assignments · GitHub Pages</footer>
</body>
</html>`;

fs.writeFileSync(OUTPUT_FILE, html, 'utf8');
console.log(`✓ Gallery built: ${count} submission(s) → index.html`);
