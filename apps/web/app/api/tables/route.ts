import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const { data: tables, error } = await supabase
    .from('tables')
    .select('*')
    .order('position_x', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tables });
}

export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await request.json();
  const { id, status, assigned_waiter_id } = body;

  if (!id) {
    return NextResponse.json({ error: 'Table id is required' }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;
  if (assigned_waiter_id !== undefined) updates.assigned_waiter_id = assigned_waiter_id;

  const { data: table, error } = await supabase
    .from('tables')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ table });
}
