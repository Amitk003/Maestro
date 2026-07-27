import { NextResponse } from 'next/server';
import { createServiceClient } from '../../../lib/supabase/service';

export async function GET() {
  const supabase = createServiceClient();

  const { data: items, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('available', true)
    .order('category', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items });
}
