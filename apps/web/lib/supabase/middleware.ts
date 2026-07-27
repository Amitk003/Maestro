import { NextResponse, type NextRequest } from 'next/server';

interface SessionUser {
  id: string;
  role: string;
}

async function fetchSessionUser(token: string): Promise<SessionUser | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const res = await fetch(
    `${url}/rest/v1/user_sessions?token=eq.${encodeURIComponent(token)}&select=user_id,expires_at`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) return null;

  const sessions = await res.json();
  if (!sessions || sessions.length === 0) return null;

  const session = sessions[0];
  if (new Date(session.expires_at) < new Date()) {
    await fetch(`${url}/rest/v1/user_sessions?token=eq.${encodeURIComponent(token)}`, {
      method: 'DELETE',
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    return null;
  }

  const profileRes = await fetch(
    `${url}/rest/v1/profiles?id=eq.${session.user_id}&select=id,role`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );
  if (!profileRes.ok) return null;

  const profiles = await profileRes.json();
  if (!profiles || profiles.length === 0) return null;

  return { id: profiles[0].id, role: profiles[0].role };
}

export async function updateSession(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token')?.value;
  const user = sessionToken ? await fetchSessionUser(sessionToken) : null;

  const protectedPaths = ['/tasks', '/kds', '/dashboard'];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next({ request });
  if (user) {
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-role', user.role);
  }
  return response;
}
