import { NextResponse } from 'next/server';
import { createServiceClient } from '../../../../lib/supabase/service';

export async function GET() {
  const supabase = createServiceClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, order_items(*, menu_item:menu_items(name, base_prep_minutes))')
    .in('status', ['pending', 'in_prep'])
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders });
}
