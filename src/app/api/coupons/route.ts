import { NextRequest, NextResponse } from 'next/server';
import { dbGetCoupons, dbSaveCoupon, dbUpdateCoupon, dbDeleteCoupon } from '@/lib/d1';

export async function GET() {
  try {
    const coupons = await dbGetCoupons();
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ success: false, message: error?.message || 'কুপন লোড ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, discount_type, discount_value } = body;

    if (!code || !code.trim()) {
      return NextResponse.json({ success: false, message: 'কুপন কোড আবশ্যক।' }, { status: 400 });
    }

    if (discount_value === undefined || Number(discount_value) <= 0) {
      return NextResponse.json({ success: false, message: 'সঠিক ডিসকাউন্টের পরিমাণ দিন।' }, { status: 400 });
    }

    if (discount_type === 'percentage' && Number(discount_value) > 100) {
      return NextResponse.json({ success: false, message: 'শতকরা ডিসকাউন্ট ১০০% এর বেশি হতে পারবে না।' }, { status: 400 });
    }

    const savedCoupon = await dbSaveCoupon(body);
    return NextResponse.json({ success: true, coupon: savedCoupon, message: 'কুপন সফলভাবে সংরক্ষিত হয়েছে!' });
  } catch (error: any) {
    console.error('Error saving coupon:', error);
    return NextResponse.json({ success: false, message: error?.message || 'কুপন সেভ করতে ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'কুপন আইডি আবশ্যক।' }, { status: 400 });
    }

    const updated = await dbUpdateCoupon(id, updates);
    return NextResponse.json({ success: updated, message: updated ? 'কুপন আপডেট হয়েছে!' : 'কুপন পাওয়া যায়নি।' });
  } catch (error: any) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ success: false, message: error?.message || 'কুপন আপডেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'কুপন আইডি আবশ্যক।' }, { status: 400 });
    }

    const deleted = await dbDeleteCoupon(id);
    return NextResponse.json({ success: deleted, message: deleted ? 'কুপন মুছে ফেলা হয়েছে!' : 'কুপন মুছে ফেলা সম্ভব হয়নি।' });
  } catch (error: any) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ success: false, message: error?.message || 'কুপন মুছতে সমস্যা হয়েছে।' }, { status: 500 });
  }
}
