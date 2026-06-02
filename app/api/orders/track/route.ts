import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const orderNumber = searchParams.get('orderNumber');
  const email = searchParams.get('email');

  if (!orderNumber || !email) {
    return NextResponse.json({ error: 'Order number and email required' }, { status: 400 });
  }

  const orders = await query(`
    SELECT id, order_number AS "orderNumber", email, status, subtotal, tax, shipping, total, payment_method AS "paymentMethod", created_at AS "createdAt"
    FROM orders
    WHERE order_number = $1 AND email = $2
  `, [orderNumber, email]);

  if (orders.length === 0) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const order = orders[0];

  const items = await query(`
    SELECT oi.id, oi.size, oi.color, oi.quantity, oi.price, p.name AS product_name
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = $1
  `, [order.id]);

  return NextResponse.json({
    data: {
      ...order,
      items,
    },
  });
}
