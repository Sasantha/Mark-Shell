import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.URL || 'http://localhost:3000';
const PATHS = (process.env.PATHS || '/').split(',');
const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'wide', width: 1920, height: 1080 },
  { name: 'mobile-real', width: 390, height: 664 },
  { name: 'mobile-small', width: 360, height: 640 },
  { name: 'laptop-1366', width: 1366, height: 657 },
  { name: 'laptop-1536', width: 1536, height: 730 },
];

fs.mkdirSync('.shots', { recursive: true });
const browser = await chromium.launch();
const report = [];

for (const p of PATHS) {
  const slug = p === '/' ? 'home' : p.replace(/\W+/g, '-').replace(/^-|-$/g, '');
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: 'networkidle' });

    await page.screenshot({ path: `.shots/${slug}-${vp.name}-fold.png` });
    await page.screenshot({ path: `.shots/${slug}-${vp.name}-full.png`, fullPage: true });

    const metrics = await page.evaluate((vh) => {
      const vw = document.documentElement.clientWidth;
      const ctas = [...document.querySelectorAll('a,button')]
        .filter((el) => /quotation|contact us/i.test(el.textContent))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { text: el.textContent.trim(), top: Math.round(r.top), bottom: Math.round(r.bottom), fullyInFold: r.bottom <= vh };
        });

      // Overlap check: chat toggle vs every hero <p> and CTA, as currently laid out (unscrolled = at fold).
      const rectsIntersect = (a, b) =>
        a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

      const chatBtn = document.querySelector('button.fixed.bottom-8.right-8');
      const chatRect = chatBtn ? chatBtn.getBoundingClientRect() : null;
      const heroSection = document.querySelector('section');
      const heroTargets = heroSection
        ? [...heroSection.querySelectorAll('p'), ...heroSection.querySelectorAll('a,button')]
            .filter((el) => el.textContent.trim().length > 0)
        : [];

      const chatOverlaps = chatRect
        ? heroTargets
            .map((el) => {
              const r = el.getBoundingClientRect();
              return {
                tag: el.tagName.toLowerCase(),
                text: el.textContent.trim().slice(0, 60),
                overlapsChat: rectsIntersect(chatRect, r),
              };
            })
            .filter((x) => x.overlapsChat)
        : [];

      // Tagline wrap metric: split the "Premium Quality..." <p> into its rendered
      // visual lines via a per-character Range/getClientRects walk (grouping chars
      // whose line-fragment rect shares the same top), then flag bullet-adjacent
      // wraps and single-word last lines.
      const taglineEl = heroTargets.find(
        (el) => el.tagName === 'P' && /premium quality/i.test(el.textContent)
      );

      let tagline = null;
      if (taglineEl) {
        const textNode = [...taglineEl.childNodes].find((n) => n.nodeType === Node.TEXT_NODE) || taglineEl.firstChild;
        const text = textNode ? textNode.textContent : taglineEl.textContent;
        const range = document.createRange();
        const lines = [];
        let currentLine = '';
        let currentTop = null;

        for (let i = 0; i < text.length; i++) {
          range.setStart(textNode, i);
          range.setEnd(textNode, i + 1);
          const rect = range.getClientRects()[0];
          if (!rect || (rect.width === 0 && rect.height === 0)) continue;
          const top = Math.round(rect.top);
          if (currentTop === null || Math.abs(top - currentTop) <= 2) {
            currentLine += text[i];
            currentTop = currentTop === null ? top : currentTop;
          } else {
            lines.push(currentLine);
            currentLine = text[i];
            currentTop = top;
          }
        }
        if (currentLine) lines.push(currentLine);

        const trimmedLines = lines.map((l) => l.trim()).filter((l) => l.length > 0);
        const style = getComputedStyle(taglineEl);
        const lineHeightPx = parseFloat(style.lineHeight) || null;
        const elHeight = taglineEl.getBoundingClientRect().height;

        const lastLine = trimmedLines[trimmedLines.length - 1] || '';
        const lastLineWords = lastLine.split(/\s+/).filter(Boolean);

        tagline = {
          renderedLines: trimmedLines,
          lineCountFromRects: trimmedLines.length,
          lineCountFromHeight: lineHeightPx ? Math.round(elHeight / lineHeightPx) : null,
          bulletAtLineEdge: trimmedLines.some((l) => l.startsWith('•') || l.endsWith('•')),
          singleWordLastLine: lastLineWords.length === 1,
        };
      }

      return {
        overflowX: document.documentElement.scrollWidth > vw,
        h1Count: document.querySelectorAll('h1').length,
        ctas,
        chatButtonPresent: !!chatBtn,
        chatOverlaps,
        tagline,
      };
    }, vp.height);

    report.push({ path: p, viewport: vp.name, ...metrics });
    await ctx.close();
  }
}

await browser.close();
fs.writeFileSync('.shots/report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
