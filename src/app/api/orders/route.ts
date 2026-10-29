import { NextRequest, NextResponse } from 'next/server';
import { addOrder, getAllOrders, updateOrderStatus, deleteOrder } from '@/lib/orders-store';
import { sendTelegramOrderNotification } from '@/lib/telegram';
import { dbIncrementCouponUsage } from '@/lib/d1';

export async function GET() {
  const orders = getAllOrders();
  return NextResponse.json({ success: true, orders });
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

    if (contentType.includes('application/json')) {
      const json = await req.json();
      phone = json.phone || '';
      whatsapp = json.whatsapp || phone;
      customerName = json.customerName || '';
      packageId = json.packageId || '';
      packageName = json.packageName || 'Product';
      price = Number(json.price) || 0;
      paymentMethod = json.paymentMethod || 'bkash';
      manualTrxId = json.trxId || '';
      proofUrl = json.proofUrl || '';
      couponCode = (json.couponCode || json.coupon_code || '').trim().toUpperCase();
      discountAmount = Number(json.discountAmount || json.discount_amount) || 0;
      originalPrice = Number(json.originalPrice || json.original_price) || price;
    } else {
      const formData = await req.formData();
      phone = (formData.get('phone') as string) || '';
      whatsapp = (formData.get('whatsapp') as string) || phone;
      customerName = (formData.get('customerName') as string) || '';
      packageId = (formData.get('packageId') as string) || '';
      packageName = (formData.get('packageName') as string) || 'Product';
      price = Number(formData.get('price')) || 0;
      paymentMethod = (formData.get('paymentMethod') as string) || 'bkash';
      manualTrxId = (formData.get('trxId') as string) || '';
      proofFile = formData.get('proof') as File | null;
      couponCode = ((formData.get('couponCode') || formData.get('coupon_code') || '') as string).trim().toUpperCase();
      discountAmount = Number(formData.get('discountAmount') || formData.get('discount_amount')) || 0;
      originalPrice = Number(formData.get('originalPrice') || formData.get('original_price')) || price;
    }

    if (!phone) {
      return NextResponse.json({ success: false, message: 'ফোন নম্বর আবশ্যক।' }, { status: 400 });
    }

    // Generate unique readable order and transaction ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `RNV-${randomSuffix}`;
    const trxId = manualTrxId.trim() || `PROOF-${randomSuffix}`;
    const finalPhone = whatsapp && whatsapp !== phone ? `${phone} (WA: ${whatsapp})` : phone;

    let proofBuffer: Buffer | undefined;
    let proofFileName = 'proof.jpg';
    if (!proofUrl) proofUrl = '';

    if (proofFile && typeof proofFile.arrayBuffer === 'function') {
      const arrayBuffer = await proofFile.arrayBuffer();
      proofBuffer = Buffer.from(arrayBuffer);
      proofFileName = proofFile.name || `proof-${orderId}.jpg`;
      // Convert small preview to base64 data URL for web admin view
      if (proofBuffer.length < 2 * 1024 * 1024) {
        proofUrl = `data:${proofFile.type || 'image/jpeg'};base64,${proofBuffer.toString('base64')}`;
      }
    } else if (price === 0) {
      proofUrl = 'FREE_TRIAL';
    }

    // 1. Save order into local orders store
    const storedOrder = addOrder({
      id: orderId,
      created_at: new Date().toISOString(),
      user_phone: finalPhone,
      trx_id: trxId,
      payment_method: paymentMethod,
      package_id: packageId,
      product_name: packageName,
      price,
      status: 'pending',
      proof_url: proofUrl,
      customer_name: customerName,
      whatsapp,
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
      phone,
      whatsapp,
      productName: packageName,
      price,
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
    const updated = updateOrderStatus(id, status);
    return NextResponse.json({ success: updated });
  } catch (err: any) {
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
    const deleted = deleteOrder(id);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
