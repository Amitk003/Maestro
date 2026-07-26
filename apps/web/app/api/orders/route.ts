import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await request.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    table_id,
    type = 'dine_in',
    notes = '',
    items = [],
  } = body;

  if (!items.length) {
    return NextResponse.json({ error: 'Order must have at least one item' }, { status: 400 });
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      table_id: table_id || null,
      customer_id: user?.id || null,
      status: 'pending',
      type,
      notes,
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  const orderItems = items.map((item: { menu_item_id: string; quantity: number; station_id?: string; modifiers?: Record<string, unknown> }) => ({
    order_id: order.id,
    menu_item_id: item.menu_item_id,
    quantity: item.quantity || 1,
    station_id: item.station_id || null,
    modifiers: item.modifiers || {},
  }));

  const { data: createdItems, error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select();

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({ order, items: createdItems }, { status: 201 });
}
