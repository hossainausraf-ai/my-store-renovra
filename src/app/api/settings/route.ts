import { NextRequest, NextResponse } from 'next/server';
import { dbGetSettings, dbSaveSettings } from '@/lib/d1';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Cloudflare-CDN-Cache-Control': 'no-store',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET() {
  try {
    const settings = await dbGetSettings();
    return NextResponse.json({ success: true, settings }, { headers: noCacheHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: noCacheHeaders });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await dbSaveSettings(body);
    return NextResponse.json({ success: true, settings: updated }, { headers: noCacheHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: noCacheHeaders });
  }
}
