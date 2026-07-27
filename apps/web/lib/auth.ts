export async function signInWithOtp(email: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: anonKey },
      body: JSON.stringify({ email, create_user: true }),
    });
    const data = await res.json();
    return { error: data.error || null };
  } catch {
    return { error: { message: 'Network error' } };
  }
}

export async function signInWithGoogle() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const redirectTo = `${window.location.origin}/auth/callback`;
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`, {
      headers: { apikey: anonKey },
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
    return { error: data.error || null };
  } catch {
    return { error: { message: 'Network error' } };
  }
}

export async function signOut() {
  document.cookie = 'session_token=; path=/; max-age=0';
  window.location.href = '/auth/login';
}
