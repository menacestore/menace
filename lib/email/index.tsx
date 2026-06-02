import { Resend } from 'resend';
import { OrderConfirmationEmail } from './templates/OrderConfirmationEmail';
import { OrderStatusEmail } from './templates/OrderStatusEmail';
import { NewOrderEmail } from './templates/NewOrderEmail';

if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
if (!process.env.EMAIL_FROM) throw new Error('EMAIL_FROM is not set');
if (!process.env.ADMIN_EMAIL) throw new Error('ADMIN_EMAIL is not set');
if (!process.env.APP_URL) throw new Error('APP_URL is not set');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = `Menace <${process.env.EMAIL_FROM}>`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const APP_URL = process.env.APP_URL;

interface SendOrderConfirmationParams {
  to: string;
  name: string;
  orderNumber: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  orderId: string;
}

export async function sendOrderConfirmation({ to, name, orderNumber, items, total, orderId }: SendOrderConfirmationParams) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Order Confirmed #${orderNumber}`,
    react: OrderConfirmationEmail({
      orderNumber,
      customerName: name,
      items,
      total,
      trackingUrl: `${APP_URL}/order/${orderId}`,
    }),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

interface SendOrderStatusParams {
  to: string;
  name: string;
  orderNumber: string;
  oldStatus: string;
  newStatus: string;
  orderId: string;
}

export async function sendOrderStatus({ to, name, orderNumber, oldStatus, newStatus, orderId }: SendOrderStatusParams) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Order #${orderNumber} Status Updated`,
    react: OrderStatusEmail({
      orderNumber,
      customerName: name,
      oldStatus,
      newStatus,
      trackingUrl: `${APP_URL}/order/${orderId}`,
    }),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

interface SendNewOrderParams {
  orderNumber: string;
  email: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  orderId: string;
}

export async function sendNewOrderNotification({ orderNumber, email, items, total, orderId }: SendNewOrderParams) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Order #${orderNumber}`,
    react: NewOrderEmail({
      orderNumber,
      email,
      items,
      total,
      adminUrl: `${APP_URL}/admin/orders/${orderId}`,
    }),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
