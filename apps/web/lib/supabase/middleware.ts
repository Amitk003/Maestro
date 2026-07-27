import { NextResponse, type NextRequest } from 'next/server';

interface SessionUser {
  id: string;
  role: string;
}

async function fetchSessionUser(token: string): Promise<SessionUser | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const res = await fetch(`${url}/rest/v1/rpc/get_session_user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: key },
    body: JSON.stringify({ p_token: token }),
  });
  if (!res.ok) return null;

  const users = await res.json();
  if (!users || users.length === 0) return null;

  return { id: users[0].id, role: users[0].role };
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
