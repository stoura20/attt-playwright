const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

const API_KEY = process.env.API_KEY || 'SECRET123';

app.post('/scrape-attt', async (req, res) => {

  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  const { url } = req.body;

  if (
    !url ||
    !url.startsWith('https://www.attt.com.tn/')
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
        '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    // Optionnel : attendre un élément précis si nécessaire
    // await page.waitForSelector('table');

    // Récupérer le HTML complet de la page
    const html = await page.content();

    await browser.close();

    res.json({
      success: true,
      url,
      html
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
