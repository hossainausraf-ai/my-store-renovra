import { NextRequest, NextResponse } from 'next/server';
import { dbGetUserByEmail } from '@/lib/d1';
import { verifyPassword, setUserSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'ইমেইল ও পাসওয়ার্ড প্রদান করুন।' }, { status: 400 });
    }

    const user = await dbGetUserByEmail(email);
    if (!user) {
      return NextResponse.json({ success: false, message: 'ভুল ইমেইল বা পাসওয়ার্ড!' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'ভুল ইমেইল বা পাসওয়ার্ড!' }, { status: 401 });
    }

    await setUserSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      message: 'লগইন সফল হয়েছে!'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

