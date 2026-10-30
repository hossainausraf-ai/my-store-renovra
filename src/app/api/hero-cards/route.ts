import { NextRequest, NextResponse } from 'next/server';
import { dbGetHeroCards, dbSaveHeroCard, dbDeleteHeroCard } from '@/lib/d1';

export async function GET() {
  try {
    const cards = await dbGetHeroCards();
    return NextResponse.json({ success: true, cards });
  } catch (error: any) {
    console.error('Error fetching hero cards:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, message: 'কার্ডের নাম আবশ্যক।' }, { status: 400 });
    }
    const card = await dbSaveHeroCard(body);
    return NextResponse.json({ success: true, card });
  } catch (error: any) {
    console.error('Error saving hero card:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.name) {
      return NextResponse.json({ success: false, message: 'কার্ডের ID এবং নাম আবশ্যক।' }, { status: 400 });
    }
    const card = await dbSaveHeroCard(body);
    return NextResponse.json({ success: true, card });
  } catch (error: any) {
    console.error('Error updating hero card:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID প্যারামিটার প্রয়োজন।' }, { status: 400 });
    }
    await dbDeleteHeroCard(id);
    return NextResponse.json({ success: true, message: 'হিরো কার্ড সফলভাবে ডিলিট হয়েছে।' });
  } catch (error: any) {
    console.error('Error deleting hero card:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

