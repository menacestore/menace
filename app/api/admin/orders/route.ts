import { query } from '@/lib/db';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { sendOrderStatus } from '@/lib/email/index';
import { orderStatusSchema } from '@/lib/validators';

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = orderStatusSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid request data', details: validation.error.issues }, { status: 400 });
  }

  const { orderId, status } = validation.data;

  // Get current order status
  const currentOrder = await query(`SELECT status FROM orders WHERE id = $1`, [orderId]);
  if (currentOrder.length === 0) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const currentStatus = currentOrder[0].status;

  // If changing to confirmed, stock is already reserved on creation, no action needed
  // If changing to cancelled, restore stock
  if (status === 'cancelled' && currentStatus !== 'cancelled') {
    const items = await query(`SELECT product_id, size, color, quantity FROM order_items WHERE order_id = $1`, [orderId]);
    for (const item of items) {
      await query(
        `UPDATE product_variants SET stock = stock + $1 WHERE product_id = $2 AND size = $3 AND color = $4`,
        [item.quantity, item.product_id, item.size, item.color]
      );
    }
  }

  await query(`UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2`, [status, orderId]);

  // Send status change email (non-blocking)
  try {
    const order = await query(`SELECT order_number AS "orderNumber", email FROM orders WHERE id = $1`, [orderId]);
    if (order.length > 0) {
      await sendOrderStatus({
        to: order[0].email,
        name: order[0].email.split('@')[0],
        orderNumber: order[0].orderNumber,
        oldStatus: currentStatus,
        newStatus: status,
        orderId,
      });
    }
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
  }

  return NextResponse.json({ message: 'Order updated' });
}
