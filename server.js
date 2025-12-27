const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

const API_KEY = process.env.API_KEY || 'SECRET123';

/* 🔎 Test */
app.get('/', (req, res) => {
  res.send('✅ API Playwright ATTT OK');
});

/* 🚀 Scraper ATTT avec URL dynamique */
app.post('/scrape-attt', async (req, res) => {

  // 🔐 Sécurité API
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  const { url } = req.body;

  // 🔐 Validation URL
  if (
    !url ||
    !url.startsWith('https://www.attt.com.tn/') ||
    !url.startsWith('https://attt.com.tn/')
  ) {
    return res.json({
      success: false,
      error: 'URL invalide ou non autorisée'
    });
  }

  try {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1366, height: 768 }
    });

    const page = await context.newPage();

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // attendre contenu réel
    await page.waitForSelector('table', { timeout: 15000 });
    await page.waitForTimeout(3000);

    /* 🧠 Extraction générique (table ATTT) */
    const results = await page.evaluate(() => {
      const data = [];
      const table = document.querySelector('table');
      if (!table) return data;

      const rows = table.querySelectorAll('tr');

      rows.forEach((row, index) => {
        if (index === 0) return;

        const cols = row.querySelectorAll('td');
        if (cols.length < 2) return;

        const item = {
          col1: cols[0]?.innerText.trim() || '',
          col2: cols[1]?.innerText.trim() || '',
          col3: cols[2]?.innerText.trim() || '',
          link: cols[2]?.querySelector('a')?.href || null
        };

        if (item.col1) data.push(item);
      });

      return data;
    });

    await browser.close();

    res.json({
      success: true,
      url,
      count: results.length,
      data: results
    });

  } catch (err) {
    res.json({
      success: false,
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 Playwright ATTT scraper running');
});
