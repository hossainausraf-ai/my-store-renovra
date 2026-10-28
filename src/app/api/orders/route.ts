import { NextRequest, NextResponse } from 'next/server';
import { addOrder, getAllOrders, updateOrderStatus, deleteOrder } from '@/lib/orders-store';
import { sendTelegramOrderNotification } from '@/lib/telegram';

export async function GET() {
  const orders = getAllOrders();
  return NextResponse.json({ success: true, orders });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const phone = formData.get('phone') as string;
    const whatsapp = (formData.get('whatsapp') as string) || phone;
    const customerName = (formData.get('customerName') as string) || '';
    const packageId = (formData.get('packageId') as string) || '';
    const packageName = (formData.get('packageName') as string) || 'Product';
    const price = Number(formData.get('price')) || 0;
    const paymentMethod = (formData.get('paymentMethod') as string) || 'bkash';
    const manualTrxId = (formData.get('trxId') as string) || '';
    const proofFile = formData.get('proof') as File | null;

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
    let proofUrl = '';

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
    });

    // 2. Send Telegram Notification (Primary instant alert)
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
