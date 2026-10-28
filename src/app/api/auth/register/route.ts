import { NextRequest, NextResponse } from 'next/server';
import { dbGetUserByEmail, dbCreateUser } from '@/lib/d1';
import { hashPassword, setUserSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'নাম, ইমেইল ও পাসওয়ার্ড আবশ্যক।' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' }, { status: 400 });
    }

    // Check existing
    const existing = await dbGetUserByEmail(email);
    if (existing) {
      return NextResponse.json({ success: false, message: 'এই ইমেইল দিয়ে অলরেডি অ্যাকাউন্ট রয়েছে। লগইন করুন।' }, { status: 400 });
    }

    const password_hash = await hashPassword(password);
    const user = await dbCreateUser({
      name,
      email,
      password_hash,
      phone
    });

    await setUserSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      message: 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

