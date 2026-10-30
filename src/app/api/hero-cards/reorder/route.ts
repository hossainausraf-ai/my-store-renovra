import { NextRequest, NextResponse } from 'next/server';
import { dbReorderHeroCards } from '@/lib/d1';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderedIds } = body;
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ success: false, message: 'orderedIds must be an array' }, { status: 400 });
    }

    const success = await dbReorderHeroCards(orderedIds);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

