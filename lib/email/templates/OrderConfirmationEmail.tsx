import { Html, Head, Body, Container, Section, Text, Heading, Hr, Link } from '@react-email/components';

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  trackingUrl: string;
}

export function OrderConfirmationEmail({ orderNumber, customerName, items, total, trackingUrl }: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Order Confirmed</Heading>
          <Text style={text}>
            Hi {customerName},
          </Text>
          <Text style={text}>
            Thank you for your order <strong>#{orderNumber}</strong>. Your statement pieces are being prepared for dispatch.
          </Text>
          <Section style={itemsSection}>
            {items.map((item, i) => (
              <div key={i} style={itemRow}>
                <Text style={itemName}>{item.name} × {item.quantity}</Text>
                <Text style={itemPrice}>PKR {(item.price * item.quantity).toLocaleString()}</Text>
              </div>
            ))}
          </Section>
          <Hr style={hr} />
          <Text style={totalRow}>
            <strong>Total</strong>
            <span>PKR {total.toLocaleString()}</span>
          </Text>
          <Link href={trackingUrl} style={button}>
            Track Your Order
          </Link>
          <Hr style={hr} />
          <Text style={footer}>
            © {new Date().getFullYear()} Menace. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const h1 = {
  fontSize: '32px',
  fontWeight: 'bold',
  letterSpacing: '-0.02em',
  marginBottom: '24px',
  color: '#1a1a1a',
};

const text = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#555',
  marginBottom: '16px',
};

const itemsSection = {
  marginBottom: '24px',
};

const itemRow = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '12px 0',
  borderBottom: '1px solid #eee',
};

const itemName = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#1a1a1a',
  margin: 0,
};

const itemPrice = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#1a1a1a',
  margin: 0,
};

const hr = {
  borderColor: '#eee',
  margin: '24px 0',
};

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  marginBottom: '24px',
};

const button = {
  display: 'block',
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  textAlign: 'center' as const,
  padding: '14px 24px',
  textDecoration: 'none',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  marginBottom: '24px',
};

const footer = {
  fontSize: '11px',
  color: '#999',
  textAlign: 'center' as const,
  marginTop: '32px',
};
