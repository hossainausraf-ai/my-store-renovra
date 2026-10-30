import { NextRequest, NextResponse } from 'next/server';
import { defaultProducts } from '@/data/products';
import { dbGetProducts, dbSearchOrders } from '@/lib/d1';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.trim() || '';

  if (!query) {
    return NextResponse.json({ success: false, message: 'ফোন নম্বর বা ট্রানজাকশন আইডি লিখুন।' }, { status: 400 });
  }

  try {
    const matchedOrders = await dbSearchOrders(query);

    if (matchedOrders.length === 0) {
      return NextResponse.json({
        success: true,
        orders: [],
        message: 'কোনো অর্ডার খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক WhatsApp নম্বর বা TrxID দিন।',
      });
    }

    let allProducts = defaultProducts;
    try {
      const dynamicProducts = await dbGetProducts();
      if (dynamicProducts && dynamicProducts.length > 0) {
        allProducts = dynamicProducts as any;
      }
    } catch {
      // fallback to defaultProducts
    }

    const formattedOrders = matchedOrders.map((order) => {
      const product = allProducts.find((p) => p.id === order.package_id || p.name === order.product_name) || 
                      defaultProducts.find((p) => p.id === order.package_id || p.name === order.product_name) || {
        download_url: '',
      };

      return {
        id: order.id,
        created_at: order.created_at,
        trx_id: order.trx_id,
        user_phone: order.whatsapp || order.user_phone,
        status: order.status || 'pending',
        payment_method: order.payment_method,
        product_name: order.product_name,
        download_url: (order.status === 'approved' || order.status === 'confirmed') ? (product.download_url || '') : '',
      };
    });

    return NextResponse.json({ success: true, orders: formattedOrders });
  } catch (err: any) {
    console.error('Error tracking order:', err);
    return NextResponse.json({ success: false, message: 'ট্র্যাকিংয়ে সাময়িক সমস্যা হচ্ছে।' }, { status: 500 });
  }
}