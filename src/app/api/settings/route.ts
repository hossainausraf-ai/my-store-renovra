import { NextRequest, NextResponse } from 'next/server';
import { dbGetSettings, dbSaveSettings } from '@/lib/d1';

export async function GET() {
  try {
    const settings = await dbGetSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await dbSaveSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
