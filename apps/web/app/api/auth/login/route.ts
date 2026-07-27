import { NextResponse, type NextRequest } from 'next/server';
import { verifyPassword, createSession } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return NextResponse.redirect(new URL('/auth/login?error=missing_fields', request.url));
    }

    const { user, error } = await verifyPassword(email, password);
    if (error || !user) {
      return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(error ?? 'Invalid credentials')}`, request.url));
    }

    const { token, error: sessionError } = await createSession(user.user_id);
    if (sessionError || !token) {
      return NextResponse.redirect(new URL('/auth/login?error=session_error', request.url));
    }

    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.redirect(new URL('/auth/login?error=server_error', request.url));
  }
}
