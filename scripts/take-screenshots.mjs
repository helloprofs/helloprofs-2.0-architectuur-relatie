import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'screenshots');
mkdirSync(outDir, { recursive: true });

const BASE = 'https://helloprofs-2-0-architectuur-relatie.vercel.app';
const VP = { width: 1440, height: 900 };

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', `--window-size=${VP.width},${VP.height}`],
  defaultViewport: VP,
});

const delay = ms => new Promise(r => setTimeout(r, ms));

async function shot(page, name) {
  await delay(800);
  const filePath = join(outDir, name + '.png');
  await page.screenshot({ path: filePath, fullPage: false });
  console.log('saved', name);
}

async function goto(page, path) {
  await page.goto(BASE + path, { waitUntil: 'networkidle0', timeout: 30000 });
  await delay(1000);
}

async function clickByText(page, text) {
  const found = await page.evaluate((t) => {
    const els = Array.from(document.querySelectorAll('button, a, [role="tab"]'));
    const el = els.find(e => e.textContent?.trim() === t || e.textContent?.includes(t));
    if (el instanceof HTMLElement) { el.click(); return true; }
    return false;
  }, text);
  if (found) await delay(800);
  return found;
}

// ── SECTION 1: Relations list ─────────────────────────────────────────────────

const relPage = await browser.newPage();
await goto(relPage, '/client/relations');

// 1a. Full relations list
await shot(relPage, '01-relations-list');

// 1b. Invite modal – WhatsApp (default tab)
await clickByText(relPage, 'Relatie Uitnodigen');
await shot(relPage, '02-invite-whatsapp');

// 1c. Invite modal – Email tab
await clickByText(relPage, 'Via E-mail');
await shot(relPage, '03-invite-email');

// Close modal by pressing Escape
await relPage.keyboard.press('Escape');
await delay(500);

// 1d. Dienst Toewijzen – Step 1 (open from list)
await relPage.evaluate(() => {
  const btns = Array.from(document.querySelectorAll('button'));
  const btn = btns.find(b => b.textContent?.trim() === 'Dienst Toewijzen' && !b.disabled);
  if (btn) btn.click();
});
await delay(800);
await shot(relPage, '04-assign-service-step1');

// Fill description so we can advance
const textarea = await relPage.$('textarea');
if (textarea) { await textarea.type('Spoeddienst kozijnen kavel 5'); await delay(300); }

// 1e. Bellen flow → Step 2
await clickByText(relPage, 'Bellen & Vastleggen');
await shot(relPage, '05-assign-service-step2-call');

await relPage.close();

// 1f. WhatsApp channel outcome (fresh page)
const waPage = await browser.newPage();
await goto(waPage, '/client/relations');
await waPage.evaluate(() => {
  const btns = Array.from(document.querySelectorAll('button'));
  const btn = btns.find(b => b.textContent?.trim() === 'Dienst Toewijzen' && !b.disabled);
  if (btn) btn.click();
});
await delay(800);
const ta2 = await waPage.$('textarea');
if (ta2) { await ta2.type('Spoeddienst kozijnen kavel 5'); await delay(300); }
await clickByText(waPage, 'WhatsApp & Vastleggen');
await shot(waPage, '06-assign-service-whatsapp');
await waPage.close();

// ── SECTION 2: Jan de Bouwer detail ──────────────────────────────────────────

const detPage = await browser.newPage();
await goto(detPage, '/client/relations/R-001');

// 2a. Header + default tab (Overzicht & Compliance)
await shot(detPage, '07-jan-detail-header');

// 2b. Scroll down to show compliance passport
await detPage.evaluate(() => window.scrollTo(0, 350));
await shot(detPage, '08-jan-compliance-passport');

// ── Tab: Inkoopopdrachten ─────────────────────────────────────────────────────

await clickByText(detPage, 'Inkoopopdrachten');
await shot(detPage, '09-jan-po-list');

// Open first dossier card
await detPage.evaluate(() => {
  const btn = document.querySelector('button.group');
  if (btn instanceof HTMLElement) btn.click();
});
await delay(900);
await shot(detPage, '10-dossier-open');

// Dossier sub-tabs
const dossierTabs = [
  ['Inkoopopdracht', '11-dossier-tab-inkoopopdracht'],
  ['Aanbod',         '12-dossier-tab-aanbod'],
  ['Facturen',       '13-dossier-tab-facturen'],
  ['Contract',       '14-dossier-tab-contract'],
  ['Bijlagen',       '15-dossier-tab-bijlagen'],
  ['Keten-Inzicht',  '16-dossier-tab-keten'],
  ['Tijdlijn',       '17-dossier-tab-tijdlijn'],
];

for (const [label, name] of dossierTabs) {
  await clickByText(detPage, label);
  await shot(detPage, name);
}

// ── Tab: Tijdlijn (relation level) ────────────────────────────────────────────

await clickByText(detPage, 'Tijdlijn');
await shot(detPage, '18-jan-timeline');

// ── Audit Export modal ────────────────────────────────────────────────────────

await clickByText(detPage, 'Audit Export');
await shot(detPage, '19-audit-export');

await detPage.close();

// ── Done ──────────────────────────────────────────────────────────────────────

await browser.close();
console.log('all done');
