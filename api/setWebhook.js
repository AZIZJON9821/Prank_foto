// Vercel Serverless Function: Telegram Webhook-ni bir bosishda ulash
const BOT_TOKEN = process.env.BOT_TOKEN || '8397655004:AAHz1xBd0vNNLRe9H-8krdFjZNi9btJW4GA';

module.exports = async (req, res) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = process.env.APP_URL || (host ? `${protocol}://${host}` : '');
  const webhookUrl = `${baseUrl}/api/bot`;

  try {
    const tgResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
    const data = await tgResponse.json();

    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    if (data.ok) {
      return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="uz">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Webhook muvaffaqiyatli ulandi</title>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #f3f4f6;
              padding: 20px;
            }
            .card {
              background: #ffffff;
              border-radius: 20px;
              padding: 36px;
              max-width: 520px;
              width: 100%;
              text-align: center;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            }
            .icon {
              font-size: 54px;
              margin-bottom: 12px;
            }
            h1 {
              color: #15803d;
              font-size: 22px;
              margin: 0 0 12px;
            }
            p {
              color: #4b5563;
              font-size: 15px;
              line-height: 1.6;
              margin: 0 0 16px;
            }
            .code-box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
              padding: 12px;
              font-family: monospace;
              font-size: 13px;
              color: #0f172a;
              word-break: break-all;
              margin-bottom: 24px;
            }
            .btn {
              display: inline-block;
              background: #2563eb;
              color: white;
              padding: 12px 28px;
              border-radius: 10px;
              text-decoration: none;
              font-weight: 600;
              transition: background 0.2s;
            }
            .btn:hover {
              background: #1d4ed8;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">✅</div>
            <h1>Telegram Webhook Ulandi!</h1>
            <p>Bot muvaffaqiyatli Vercel serveringiz bilan bog'landi.</p>
            <div class="code-box"><b>Webhook:</b><br>${webhookUrl}</div>
            <p>Endi Telegram botingizga kiring va <b>/start</b> buyrug'ini bosing!</p>
            <a href="https://t.me" class="btn">Telegramni ochish</a>
          </div>
        </body>
        </html>
      `);
    } else {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html lang="uz">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Webhook xatoligi</title>
          <style>
            body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff5f5; margin: 0; padding: 20px; }
            .card { background: white; border-radius: 16px; padding: 30px; max-width: 500px; width: 100%; border: 1px solid #fecaca; }
            h1 { color: #dc2626; margin-top: 0; }
            pre { background: #fef2f2; padding: 12px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>❌ Xatolik yuz berdi</h1>
            <p>Telegram Webhook ulashda xatolik qaytdi:</p>
            <pre>${JSON.stringify(data, null, 2)}</pre>
            <p>Iltimos, bot tokeni to'g'ri ekanligini tekshiring.</p>
          </div>
        </body>
        </html>
      `);
    }
  } catch (err) {
    return res.status(500).send(`Server xatosi: ${err.message}`);
  }
};
