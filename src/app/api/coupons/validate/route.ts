import { NextRequest, NextResponse } from 'next/server';
import { dbValidateCoupon } from '@/lib/d1';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, productId, productType, price } = body;

    if (!code || !code.trim()) {
      return NextResponse.json({
        valid: false,
        message: 'দয়া করে একটি কুপন কোড লিখুন।',
        discountAmount: 0,
        finalPrice: Number(price) || 0
      }, { status: 400 });
    }

    const result = await dbValidateCoupon(code, {
      id: productId || '',
      product_type: productType || '',
      price: Number(price) || 0
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({
      valid: false,
      message: error?.message || 'কুপন যাচাইকরণে ত্রুটি হয়েছে।',
      discountAmount: 0,
      finalPrice: 0
    }, { status: 500 });
  }
}
