import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const configuredEmail = (process.env.ADMIN_EMAIL || 'admin@renovra.com').trim().toLowerCase();
    const configuredPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const inputEmail = (email || '').trim().toLowerCase();
    const inputPassword = password || '';

    // If only password was sent (legacy fallback) or both email + password match
    const isEmailValid = !email || inputEmail === configuredEmail;
    const isPasswordValid = inputPassword === configuredPassword;

    if (isEmailValid && isPasswordValid) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'admin_token',
        value: 'authenticated',
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({ success: true, message: 'অ্যাডমিন লগইন সফল হয়েছে!' });
    }

    if (!isEmailValid) {
      return NextResponse.json({ success: false, message: 'ভুল অ্যাডমিন ইমেইল!' }, { status: 401 });
    }

    return NextResponse.json({ success: false, message: 'ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
