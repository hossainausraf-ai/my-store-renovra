import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { sendTelegramOrderNotification } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const phone = formData.get('phone') as string;
    const whatsapp = (formData.get('whatsapp') as string) || phone;
    const customerName = (formData.get('customerName') as string) || '';
    const packageId = formData.get('packageId') as string;
    const packageName = (formData.get('packageName') as string) || 'Product';
    const price = Number(formData.get('price')) || 0;
    const paymentMethod = (formData.get('paymentMethod') as string) || 'bkash';
    const manualTrxId = (formData.get('trxId') as string) || '';
    const userId = (formData.get('userId') as string) || null;
    const proofFile = formData.get('proof') as File | null;

    if (!phone) {
      return NextResponse.json({ success: false, message: 'ফোন নম্বর আবশ্যক।' }, { status: 400 });
    }

    // Generate unique readable order and transaction ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `RNV-${randomSuffix}`;
    const trxId = manualTrxId.trim() || `PROOF-${randomSuffix}`;
    const finalPhone = whatsapp && whatsapp !== phone ? `${phone} (WA: ${whatsapp})` : phone;

    let proofUrl = '';
    let proofBuffer: Buffer | undefined;
    let proofFileName = 'proof.jpg';

    // 1. Process proof image if attached
    if (proofFile && typeof proofFile.arrayBuffer === 'function') {
      const arrayBuffer = await proofFile.arrayBuffer();
      proofBuffer = Buffer.from(arrayBuffer);
      proofFileName = proofFile.name || `proof-${orderId}.jpg`;

      // Try uploading to Supabase Storage if configured
      try {
        const supabase = createClient();
        const fileExt = proofFileName.split('.').pop() || 'jpg';
        const filePath = `payment-proofs/${orderId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, proofBuffer, { contentType: proofFile.type || 'image/jpeg' });

        if (!uploadError) {
          const { data: publicData } = supabase.storage.from('product-images').getPublicUrl(filePath);
          proofUrl = publicData.publicUrl;
        }
      } catch (storageErr) {
        console.warn('Supabase storage upload bypassed/failed:', storageErr);
      }
    } else if (price === 0) {
      proofUrl = 'FREE_TRIAL';
    }

    // 2. Try inserting into Supabase DB if available
    let dbSaved = false;
    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from('manual_payments').insert([
        {
          user_id: userId,
          user_phone: finalPhone,
          proof_url: proofUrl || 'LOCAL_TELEGRAM',
          trx_id: trxId,
          payment_method: paymentMethod,
          package_id: packageId,
          status: 'pending',
        },
      ]);

      if (!dbError) {
        dbSaved = true;
      } else {
        console.warn('Supabase insert warning:', dbError.message);
      }
    } catch (dbErr) {
      console.warn('Supabase connection failed (using Telegram-first model):', dbErr);
    }

    // 3. Send Telegram Notification (Primary instant alert)
    const telegramResult = await sendTelegramOrderNotification({
      orderId,
      customerName,
      phone,
      whatsapp,
      productName,
      price,
      paymentMethod,
      trxId,
      proofUrl,
      proofBuffer,
      proofFileName,
    });

    return NextResponse.json({
      success: true,
      orderId,
      trxId,
      dbSaved,
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
