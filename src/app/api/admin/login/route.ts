import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;

  // In a real app, verify against database or env variable
  if (password === 'admin123') {
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'admin_token',
      value: 'authenticated',
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
}
