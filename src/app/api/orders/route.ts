import { NextRequest, NextResponse } from 'next/server';
import { dbGetOrders, dbSaveOrder, dbUpdateOrderStatus, dbDeleteOrder, dbIncrementCouponUsage } from '@/lib/d1';
import { sendTelegramOrderNotification } from '@/lib/telegram';

export async function GET() {
  const orders = await dbGetOrders();
  return NextResponse.json(
    { success: true, orders },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let phone = '';
    let whatsapp = '';
    let customerName = '';
    let packageId = '';
    let packageName = 'Product';
    let price = 0;
    let paymentMethod = 'bkash';
    let manualTrxId = '';
    let proofFile: File | null = null;
    let proofUrl = '';
    let couponCode = '';
    let discountAmount = 0;
    let originalPrice = 0;
    let currency = 'BDT';
    let convertedPrice = 0;

    if (contentType.includes('application/json')) {
      const json = await req.json();
      whatsapp = (json.whatsapp || json.phone || '').trim();
      phone = (json.phone || whatsapp).trim();
      customerName = (json.customerName || '').trim();
      packageId = json.packageId || '';
      packageName = json.packageName || 'Product';
      price = Number(json.price) || 0;
      currency = (json.currency || 'BDT').trim().toUpperCase();
      convertedPrice = Number(json.convertedPrice) || price;
      paymentMethod = json.paymentMethod || 'bkash';
      manualTrxId = (json.trxId || '').trim();
      proofUrl = (json.proofUrl || json.proof_url || '').trim();
      couponCode = (json.couponCode || json.coupon_code || '').trim().toUpperCase();
      discountAmount = Number(json.discountAmount || json.discount_amount) || 0;
      originalPrice = Number(json.originalPrice || json.original_price) || price;
    } else {
      const formData = await req.formData();
      whatsapp = ((formData.get('whatsapp') as string) || (formData.get('phone') as string) || '').trim();
      phone = ((formData.get('phone') as string) || whatsapp).trim();
      customerName = ((formData.get('customerName') as string) || '').trim();
      packageId = ((formData.get('packageId') as string) || '').trim();
      packageName = ((formData.get('packageName') as string) || 'Product').trim();
      price = Number(formData.get('price')) || 0;
      currency = (((formData.get('currency') as string) || 'BDT')).trim().toUpperCase();
      convertedPrice = Number(formData.get('convertedPrice')) || price;
      paymentMethod = ((formData.get('paymentMethod') as string) || 'bkash').trim();
      manualTrxId = ((formData.get('trxId') as string) || '').trim();
      proofFile = formData.get('proof') as File | null;
      proofUrl = ((formData.get('proofUrl') || formData.get('proof_url') || '') as string).trim();
      couponCode = (((formData.get('couponCode') || formData.get('coupon_code') || '') as string)).trim().toUpperCase();
      discountAmount = Number(formData.get('discountAmount') || formData.get('discount_amount')) || 0;
      originalPrice = Number(formData.get('originalPrice') || formData.get('original_price')) || price;
    }

    if (!customerName) {
      return NextResponse.json({ success: false, message: 'দয়া করে আপনার নাম লিখুন।' }, { status: 400 });
    }

    const contactPhone = whatsapp || phone;
    if (!contactPhone) {
      return NextResponse.json({ success: false, message: 'WhatsApp নম্বর আবশ্যক।' }, { status: 400 });
    }

    if (price > 0 && !proofFile && !proofUrl) {
      return NextResponse.json({ success: false, message: 'পেমেন্টের স্ক্রিনশট আপলোড করা আবশ্যক।' }, { status: 400 });
    }

    // Generate unique readable order and transaction ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `RNV-${randomSuffix}`;
    const trxId = manualTrxId || `PROOF-${randomSuffix}`;

    let proofBuffer: Buffer | undefined;
    let proofFileName = `proof-${orderId}.jpg`;

    // Process uploaded file if available
    if (proofFile && typeof proofFile.arrayBuffer === 'function') {
      try {
        const arrayBuffer = await proofFile.arrayBuffer();
        proofBuffer = Buffer.from(arrayBuffer);
        proofFileName = proofFile.name || `proof-${orderId}.jpg`;
        // If proofUrl was not provided from client, create base64 data url
        if (!proofUrl || !proofUrl.startsWith('data:')) {
          proofUrl = `data:${proofFile.type || 'image/jpeg'};base64,${proofBuffer.toString('base64')}`;
        }
      } catch (err) {
        console.warn('Error reading proof file arrayBuffer:', err);
      }
    }

    // If proofUrl was sent as a data URL from client, create Buffer for Telegram attachment if not set
    if (!proofBuffer && proofUrl && proofUrl.startsWith('data:')) {
      try {
        const matches = proofUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches[2]) {
          proofBuffer = Buffer.from(matches[2], 'base64');
          const ext = matches[1]?.includes('webp') ? 'webp' : (matches[1]?.includes('png') ? 'png' : 'jpg');
          proofFileName = `proof-${orderId}.${ext}`;
        }
      } catch (err) {
        console.warn('Error decoding base64 proofUrl into Buffer:', err);
      }
    }

    if (price === 0) {
      proofUrl = 'FREE_TRIAL';
    }

    // 1. Save order into Cloudflare D1 (and local store fallback)
    const storedOrder = await dbSaveOrder({
      id: orderId,
      created_at: new Date().toISOString(),
      user_phone: contactPhone,
      trx_id: trxId,
      payment_method: paymentMethod,
      package_id: packageId,
      product_name: packageName,
      price,
      status: 'pending',
      proof_url: proofUrl,
      customer_name: customerName,
      whatsapp: contactPhone,
      coupon_code: couponCode || undefined,
      discount_amount: discountAmount || undefined,
      original_price: originalPrice || undefined,
    });

    // 2. Increment coupon usage count if applied
    if (couponCode) {
      try {
        await dbIncrementCouponUsage(couponCode);
      } catch (err) {
        console.warn('Failed to increment coupon usage:', err);
      }
    }

    // 3. Send Telegram Notification (Primary instant alert)
    const telegramResult = await sendTelegramOrderNotification({
      orderId,
      customerName,
      phone: contactPhone,
      whatsapp: contactPhone,
      productName: packageName,
      price,
      currency,
      convertedPrice,
      paymentMethod,
      trxId,
      proofBuffer,
      proofFileName,
      couponCode: couponCode || undefined,
      discountAmount: discountAmount || undefined,
      originalPrice: originalPrice || undefined,
    });

    return NextResponse.json({
      success: true,
      orderId,
      trxId,
      telegramSent: telegramResult.success,
      message: 'আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে!',
    });
  } catch (error: any) {
    console.error('Order processing error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'অর্ডার প্রসেসিং ব্যর্থ হয়েছে।' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
    }
    const updated = await dbUpdateOrderStatus(id, status);
    return NextResponse.json({ success: updated });
  } catch (err: any) {
    console.error('PATCH /api/orders error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing order id' }, { status: 400 });
    }
    const deleted = await dbDeleteOrder(id);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    console.error('PATCH /api/orders error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
