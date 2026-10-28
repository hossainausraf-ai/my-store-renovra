import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { defaultProducts } from '@/data/products';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.trim() || '';

  if (!query) {
    return NextResponse.json({ success: false, message: 'ফোন নম্বর বা ট্রানজাকশন আইডি লিখুন।' }, { status: 400 });
  }

  try {
    const supabase = createClient();
    
    // Search in manual_payments by phone or trx_id
    const { data, error } = await supabase
      .from('manual_payments')
      .select('*')
      .or(`user_phone.ilike.%${query}%,trx_id.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error || !data || data.length === 0) {
      return NextResponse.json({
        success: true,
        orders: [],
        message: 'কোনো অর্ডার খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক ফোন নম্বর বা TrxID দিন।'
      });
    }

    // Attach product information
    const { data: dbProducts } = await supabase.from('products').select('*');
    const allProducts = [...(dbProducts || []), ...defaultProducts];

    const formattedOrders = data.map((order) => {
      const product = allProducts.find((p) => p.id === order.package_id) || {
        name: 'Premium Tool / Subscription',
        price: 0,
        download_url: '',
      };

      return {
        id: order.id,
        created_at: order.created_at,
        trx_id: order.trx_id,
        user_phone: order.user_phone,
        status: order.status || 'pending',
        payment_method: order.payment_method,
        product_name: product.name,
        download_url: order.status === 'approved' ? (product.download_url || '') : '',
      };
    });

    return NextResponse.json({ success: true, orders: formattedOrders });
  } catch (err: any) {
    console.error('Error tracking order:', err);
    return NextResponse.json({ success: false, message: 'ট্র্যাকিংয়ে সাময়িক সমস্যা হচ্ছে।' }, { status: 500 });
  }
}
