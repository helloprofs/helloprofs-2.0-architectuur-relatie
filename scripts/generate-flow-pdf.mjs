import puppeteer from 'puppeteer';
import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const markdownPath = resolve(root, 'FLOW_DOCUMENTATION.md');
const pdfPath = resolve(root, 'FLOW_DOCUMENTATION.pdf');

const markdown = readFileSync(markdownPath, 'utf8');

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
      const imagePath = resolve(root, src);
      if (!existsSync(imagePath)) {
        return `<p class="missing-image">Missing image: ${escapeHtml(src)}</p>`;
      }
      const ext = imagePath.toLowerCase().endsWith('.jpg') || imagePath.toLowerCase().endsWith('.jpeg')
        ? 'jpeg'
        : 'png';
      const base64 = readFileSync(imagePath).toString('base64');
      return `<img src="data:image/${ext};base64,${base64}" alt="${escapeHtml(alt)}">`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function renderTable(lines) {
  const rows = lines
    .filter((line, index) => index !== 1)
    .map((line) => line.trim().slice(1, -1).split('|').map((cell) => inlineMarkdown(cell.trim())));

  const [header, ...body] = rows;
  return [
    '<table>',
    '<thead><tr>',
    ...header.map((cell) => `<th>${cell}</th>`),
    '</tr></thead>',
    '<tbody>',
    ...body.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`),
    '</tbody></table>',
  ].join('');
}

function renderMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const html = [];
  let list = [];
  let code = [];
  let inCode = false;
  let table = [];

  const flushList = () => {
    if (!list.length) return;
    html.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('')}</ul>`);
    list = [];
  };
  const flushCode = () => {
    if (!code.length) return;
    html.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
    code = [];
  };
  const flushTable = () => {
    if (!table.length) return;
    html.push(renderTable(table));
    table = [];
  };

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushList();
        flushTable();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      code.push(line);
      continue;
    }

    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushList();
      table.push(line);
      continue;
    }
    flushTable();

    if (!line.trim()) {
      flushList();
      continue;
    }

    if (/^#{1,4}\s/.test(line)) {
      flushList();
      const level = line.match(/^#+/)?.[0].length ?? 1;
      html.push(`<h${level}>${inlineMarkdown(line.replace(/^#{1,4}\s/, ''))}</h${level}>`);
      continue;
    }

    if (line.startsWith('- ')) {
      list.push(line.slice(2));
      continue;
    }

    if (line === '---') {
      flushList();
      html.push('<hr>');
      continue;
    }

    html.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  flushList();
  flushTable();
  flushCode();
  return html.join('\n');
}

const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>helloprofs 2.0 Flow Documentation</title>
  <style>
    @page { margin: 18mm 16mm; }
    body {
      font-family: Inter, Arial, sans-serif;
      color: #162033;
      line-height: 1.48;
      font-size: 10.5pt;
    }
    h1, h2, h3, h4 {
      color: #0f172a;
      line-height: 1.2;
      break-after: avoid;
    }
    h1 { font-size: 28pt; margin: 0 0 10pt; }
    h2 { font-size: 18pt; margin: 22pt 0 8pt; border-top: 1px solid #e2e8f0; padding-top: 14pt; }
    h3 { font-size: 13pt; margin: 16pt 0 6pt; }
    h4 { font-size: 11pt; margin: 12pt 0 4pt; }
    p { margin: 0 0 8pt; }
    ul { margin: 4pt 0 10pt 18pt; padding: 0; }
    li { margin: 2pt 0; }
    table { border-collapse: collapse; width: 100%; margin: 8pt 0 12pt; break-inside: avoid; }
    th, td { border: 1px solid #dbe3ef; padding: 6pt 7pt; vertical-align: top; }
    th { background: #f1f5f9; text-align: left; color: #334155; }
    code { font-family: Consolas, monospace; background: #f1f5f9; padding: 1pt 3pt; border-radius: 3pt; }
    pre { background: #0f172a; color: #e2e8f0; padding: 10pt; border-radius: 6pt; overflow: hidden; }
    img { max-width: 100%; border: 1px solid #dbe3ef; border-radius: 8pt; margin: 5pt 0 12pt; break-inside: avoid; }
    hr { border: 0; border-top: 1px solid #e2e8f0; margin: 16pt 0; }
  </style>
</head>
<body>${renderMarkdown(markdown)}</body>
</html>`;

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: '<div style="font-family: Arial, sans-serif; font-size: 8px; color: #64748b; width: 100%; padding: 0 16mm; display: flex; justify-content: space-between;"><span>helloprofs 2.0 Flow Documentation</span><span class="pageNumber"></span></div>',
  margin: { top: '18mm', right: '16mm', bottom: '18mm', left: '16mm' },
});
await browser.close();
console.log(`Generated ${pdfPath}`);
