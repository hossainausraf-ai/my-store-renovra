import { NextResponse } from 'next/server';
import { clearUserSession } from '@/lib/auth';

export async function POST() {
  await clearUserSession();
  return NextResponse.json({ success: true, message: 'লগআউট সম্পন্ন হয়েছে।' });
}

