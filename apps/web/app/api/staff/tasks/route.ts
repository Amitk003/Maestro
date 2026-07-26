import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const { data: tasks, error } = await supabase
    .from('staff_tasks')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tasks });
}

export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
  }

  const updates: Record<string, unknown> = { status };
  if (status === 'completed') {
    updates.completed_at = new Date().toISOString();
  }

  const { data: task, error } = await supabase
    .from('staff_tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ task });
}
