import { NextRequest, NextResponse } from 'next/server';
import { dbGetProducts, dbSaveProduct, dbDeleteProduct } from '@/lib/d1';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || undefined;
    const products = await dbGetProducts(type);
    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || body.price === undefined || !body.product_type) {
      return NextResponse.json({ success: false, message: 'Name, price, and product_type are required' }, { status: 400 });
    }

    const saved = await dbSaveProduct({
      id: body.id,
      product_type: body.product_type,
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      category: body.category || '',
      image_url: body.image_url || '',
      features: body.features || [],
      badge_text: body.badge_text || '',
      color_from: body.color_from || 'from-blue-500/50',
      color_to: body.color_to || 'to-blue-500/10',
      is_popular: Boolean(body.is_popular),
      validity: body.validity || '',
      download_url: body.download_url || '',
    });

    return NextResponse.json({ success: true, product: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing product ID' }, { status: 400 });
    }

    const success = await dbDeleteProduct(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
