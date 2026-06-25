import { query } from '@/lib/db';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/lib/email/index';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const orders = await query(
    `SELECT order_number AS "orderNumber", email, total, shipping_address AS "shippingAddress"
     FROM orders WHERE id = $1`,
    [id]
  );
  if (orders.length === 0) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const order = orders[0];
  const shippingAddress =
    typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;

  const items = await query(
    `SELECT oi.quantity, oi.price, COALESCE(p.name, 'Product') AS name
     FROM order_items oi
     LEFT JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`,
    [id]
  );

  const emailItems = items.map((item: any) => ({
    name: item.name,
    quantity: item.quantity,
    price: parseFloat(item.price),
  }));

  try {
    await sendOrderConfirmation({
      to: order.email,
      name: shippingAddress?.firstName || 'Customer',
      orderNumber: order.orderNumber,
      items: emailItems,
      total: parseFloat(order.total),
      orderId: id,
    });

    await query(
      `UPDATE orders SET confirmation_email_status = 'sent', confirmation_email_error = NULL WHERE id = $1`,
      [id]
    );

    return NextResponse.json({ message: 'Confirmation email sent', confirmationEmailStatus: 'sent' });
  } catch (emailError) {
    const message = emailError instanceof Error ? emailError.message : String(emailError);
    console.error(`Manual resend of confirmation email failed for ${order.orderNumber}:`, message);

    await query(
      `UPDATE orders SET confirmation_email_status = 'failed', confirmation_email_error = $2 WHERE id = $1`,
      [id, message]
    );

    return NextResponse.json(
      { error: 'Failed to send confirmation email', details: message, confirmationEmailStatus: 'failed' },
      { status: 502 }
    );
  }
}
