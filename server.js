const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

const API_KEY = process.env.API_KEY || 'SECRET123';

app.post('/scrape-attt', async (req, res) => {

  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
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

    await page.goto('https://www.attt.com.tn', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    await page.waitForTimeout(4000);

    const data = await page.$$eval('a', els =>
      els
        .filter(a => a.innerText.trim())
        .map(a => ({
          text: a.innerText.trim(),
          link: a.href
        }))
    );

    await browser.close();

    res.json({ success: true, count: data.length, data });

  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log('🚀 Playwright API running')
);
app.get('/scrape-attt', (req, res) => {
  res.send('✅ API Playwright OK – utilisez POST');
});

