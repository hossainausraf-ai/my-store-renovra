import { NextRequest, NextResponse } from 'next/server';
import { dbReorderProducts } from '@/lib/d1';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderedIds } = body;
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ success: false, message: 'orderedIds must be an array' }, { status: 400, headers: noCacheHeaders });
    }

    const success = await dbReorderProducts(orderedIds);
    return NextResponse.json({ success }, { headers: noCacheHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: noCacheHeaders });
  }
}
