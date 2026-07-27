import { createClient } from '@supabase/supabase-js';

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function verifyPassword(email: string, password: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase.rpc('verify_password', {
    p_email: email,
    p_password: password,
  });
  if (error) return { user: null, error: error.message };
  if (!data || data.length === 0) return { user: null, error: 'Invalid email or password' };
  return { user: data[0] as { user_id: string; email: string; role: string; name: string; restaurant_id: string }, error: null };
}

export async function createSession(userId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase.rpc('create_session', { p_user_id: userId });
  if (error) return { token: null, error: error.message };
  return { token: data as string, error: null };
}

export async function deleteSession(token: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.rpc('delete_session', { p_token: token });
  return { error: error?.message ?? null };
}

export async function getSessionUser(token: string) {
  if (!token) return null;
  const supabase = createServiceClient();
  const { data: session, error } = await supabase
    .from('user_sessions')
    .select('user_id, expires_at')
    .eq('token', token)
    .maybeSingle();
  if (error || !session) return null;
  if (new Date(session.expires_at) < new Date()) {
    await supabase.from('user_sessions').delete().eq('token', token);
    return null;
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, name, restaurant_id')
    .eq('id', session.user_id)
    .maybeSingle();
  if (!profile) return null;
  return { id: profile.id, role: profile.role, name: profile.name, restaurant_id: profile.restaurant_id };
}
