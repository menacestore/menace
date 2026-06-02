import { query } from '@/lib/db';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const orders = await query(`
    SELECT id, order_number AS "orderNumber", email, status, subtotal, tax, shipping, total, payment_method AS "paymentMethod", shipping_address AS "shippingAddress", created_at AS "createdAt"
    FROM orders WHERE id = $1
  `, [id]);

  if (orders.length === 0) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const items = await query(`
    SELECT oi.id, oi.size, oi.color, oi.quantity, oi.price, p.name AS product_name
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = $1
  `, [id]);

  return NextResponse.json({
    data: {
      ...orders[0],
      shippingAddress: typeof orders[0].shippingAddress === 'string' ? JSON.parse(orders[0].shippingAddress) : orders[0].shippingAddress,
      items,
    },
  });
}
