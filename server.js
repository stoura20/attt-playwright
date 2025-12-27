const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

app.post('/scrape-attt', async (req, res) => {
  const { url } = req.body;
  if (!url || !url.startsWith('https://www.attt.com.tn/')) {
    return res.status(400).json({ success: false, error: 'URL invalide ou non autorisée' });
  }

  try {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });

    const html = await page.content();

    await browser.close();

    res.json({ success: true, url, html });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
