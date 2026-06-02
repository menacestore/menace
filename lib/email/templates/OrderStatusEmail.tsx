import { Html, Head, Body, Container, Text, Heading, Hr, Link } from '@react-email/components';

interface OrderStatusEmailProps {
  orderNumber: string;
  customerName: string;
  oldStatus: string;
  newStatus: string;
  trackingUrl: string;
}

export function OrderStatusEmail({ orderNumber, customerName, oldStatus, newStatus, trackingUrl }: OrderStatusEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Order Update</Heading>
          <Text style={text}>
            Hi {customerName},
          </Text>
          <Text style={text}>
            Your order <strong>#{orderNumber}</strong> status has been updated from <strong>{oldStatus.toUpperCase()}</strong> to <strong>{newStatus.toUpperCase()}</strong>.
          </Text>
          {newStatus === 'shipped' && (
            <Text style={text}>
              You can track your shipment using the link below.
            </Text>
          )}
          {newStatus === 'delivered' && (
            <Text style={text}>
              We hope you enjoy your purchase!
            </Text>
          )}
          <Link href={trackingUrl} style={button}>
            View Order
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

const hr = {
  borderColor: '#eee',
  margin: '24px 0',
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
