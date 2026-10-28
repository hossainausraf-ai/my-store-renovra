export interface TelegramOrderPayload {
  orderId: string;
  customerName?: string;
  phone: string;
  whatsapp?: string;
  productName: string;
  price: number;
  paymentMethod: string;
  trxId: string;
  proofUrl?: string;
  proofBuffer?: Buffer;
  proofFileName?: string;
  notes?: string;
}

export async function sendTelegramOrderNotification(payload: TelegramOrderPayload) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://renovra.com';

  if (!botToken || !chatId) {
    console.warn(
      '⚠️ Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in environment variables.'
    );
    return { success: false, reason: 'Credentials missing' };
  }

  const cleanPhone = payload.phone.replace(/[^0-9+]/g, '');
  const cleanWa = (payload.whatsapp || payload.phone).replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${cleanWa.startsWith('88') ? cleanWa : `88${cleanWa}`}`;
  const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });

  // Safe HTML message
  const caption = `
🚨 <b>নতুন অর্ডার এসেছে! (New Order)</b>
━━━━━━━━━━━━━━━━━━━━━━
📦 <b>পণ্য/প্যাকেজ:</b> ${escapeHtml(payload.productName)}
💵 <b>মূল্য:</b> ৳ ${payload.price}
💳 <b>পেমেন্ট মেথড:</b> ${escapeHtml(payload.paymentMethod.toUpperCase())}
🔢 <b>TrxID:</b> <code>${escapeHtml(payload.trxId)}</code>

👤 <b>কাস্টমার তথ্য:</b>
📱 <b>ফোন:</b> <code>${escapeHtml(cleanPhone)}</code>
💬 <b>WhatsApp:</b> <code>${escapeHtml(payload.whatsapp || payload.phone)}</code>
${payload.customerName ? `🧑 <b>নাম:</b> ${escapeHtml(payload.customerName)}\n` : ''}
🆔 <b>Order ID:</b> <code>${escapeHtml(payload.orderId)}</code>
⏰ <b>সময়:</b> ${now}
━━━━━━━━━━━━━━━━━━━━━━
<i>অর্ডারটি যাচাই করে গ্রাহককে অ্যাক্সেস দিন।</i>
`.trim();

  // Telegram Inline Keyboard Buttons
  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: '💬 কাস্টমারকে WhatsApp-এ মেসেজ দিন',
          url: `${waLink}?text=${encodeURIComponent(
            `Hello, we received your order #${payload.orderId} for "${payload.productName}". Payment is being verified.`
          )}`,
        },
      ],
      [
        {
          text: '🌐 অ্যাডমিন প্যানেল খুলুন',
          url: `${siteUrl}/admin`,
        },
      ],
    ],
  };

  try {
    // 1. If we have image buffer (from direct form upload)
    if (payload.proofBuffer) {
      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append('caption', caption);
      formData.append('parse_mode', 'HTML');
      formData.append('reply_markup', JSON.stringify(replyMarkup));

      // Append image as a Blob
      const blob = new Blob([payload.proofBuffer]);
      formData.append('photo', blob, payload.proofFileName || 'payment_proof.jpg');

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!result.ok) {
        console.error('Telegram API error (sendPhoto with buffer):', result);
        // Fallback to text message
        return await sendTextMessage(botToken, chatId, caption, replyMarkup);
      }
      return { success: true };
    }

    // 2. If we have public proof URL (from Supabase/ImgBB)
    if (payload.proofUrl && payload.proofUrl !== 'FREE_TRIAL') {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: payload.proofUrl,
          caption: caption,
          parse_mode: 'HTML',
          reply_markup: replyMarkup,
        }),
      });

      const result = await response.json();
      if (!result.ok) {
        console.error('Telegram API error (sendPhoto with URL):', result);
        return await sendTextMessage(botToken, chatId, caption, replyMarkup);
      }
      return { success: true };
    }

    // 3. Text only (e.g. Free trial or no image)
    return await sendTextMessage(botToken, chatId, caption, replyMarkup);
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return { success: false, error };
  }
}

async function sendTextMessage(botToken: string, chatId: string, text: string, replyMarkup: any) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        reply_markup: replyMarkup,
      }),
    });
    const data = await res.json();
    return { success: data.ok };
  } catch (err) {
    console.error('Error sending Telegram text fallback:', err);
    return { success: false, error: err };
  }
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
