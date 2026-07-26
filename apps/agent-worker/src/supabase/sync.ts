import { createClient } from '@supabase/supabase-js';
import type { Order, OrderItem } from '@maestro/shared';

let supabase: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (supabase) return supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return supabase;
}

export interface SyncResult {
  orders: Order[];
  statusChanges: Array<{ orderId: string; from: string; to: string }>;
}

let previousStatuses: Record<string, string> = {};

export async function syncOrders(): Promise<SyncResult> {
  const client = getClient();
  if (!client) {
    return { orders: [], statusChanges: [] };
  }

  const { data: rows, error } = await client
    .from('orders')
    .select('*, order_items(*)')
    .in('status', ['pending', 'in_prep', 'ready'])
    .order('created_at', { ascending: true });

  if (error || !rows) {
    return { orders: [], statusChanges: [] };
  }

  const orders: Order[] = rows.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    restaurant_id: row.restaurant_id as string,
    table_id: row.table_id as string,
    customer_id: (row.customer_id as string) || '',
    status: row.status as Order['status'],
    type: row.type as Order['type'],
    notes: (row.notes as string) || '',
      items: ((row.order_items as Array<Record<string, unknown>>) || []).map(
        (item: Record<string, unknown>) => ({
          id: item.id as string,
          order_id: item.order_id as string,
          menu_item_id: item.menu_item_id as string,
          quantity: (item.quantity as number) || 1,
          modifiers: (item.modifiers as Record<string, unknown>) || {},
          station_id: item.station_id as string,
          status: item.status as OrderItem['status'],
          prep_started_at: (item.prep_started_at as string) || null,
          prep_completed_at: (item.prep_completed_at as string) || null,
        })
      ) as Order['items'],
    created_at: row.created_at as string,
    updated_at: (row.updated_at as string) || '',
  }));

  const statusChanges: SyncResult['statusChanges'] = [];
  const currentStatuses: Record<string, string> = {};

  for (const order of orders) {
    currentStatuses[order.id] = order.status;
    const prev = previousStatuses[order.id];
    if (prev && prev !== order.status) {
      statusChanges.push({ orderId: order.id, from: prev, to: order.status });
    }
  }

  previousStatuses = currentStatuses;

  return { orders, statusChanges };
}
