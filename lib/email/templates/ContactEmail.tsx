import { Html, Head, Body, Container, Text, Heading, Hr, Link } from '@react-email/components';

interface ContactEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactEmail({ name, email, subject, message }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Message</Heading>
          <Text style={text}>
            Someone has submitted a message through the contact form.
          </Text>
          <Hr style={hr} />
          <div style={fieldRow}>
            <Text style={fieldLabel}>Name</Text>
            <Text style={fieldValue}>{name}</Text>
          </div>
          <div style={fieldRow}>
            <Text style={fieldLabel}>Email</Text>
            <Text style={fieldValue}>{email}</Text>
          </div>
          <div style={fieldRow}>
            <Text style={fieldLabel}>Subject</Text>
            <Text style={fieldValue}>{subject}</Text>
          </div>
          <Hr style={hr} />
          <Text style={messageLabel}>Message</Text>
          <Text style={messageBody}>{message}</Text>
          <Hr style={hr} />
          <Link href={`mailto:${email}`} style={button}>
            Reply to {name}
          </Link>
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

const fieldRow = {
  marginBottom: '12px',
};

const fieldLabel = {
  fontSize: '11px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  color: '#999' as const,
  margin: '0 0 2px',
};

const fieldValue = {
  fontSize: '14px',
  color: '#1a1a1a',
  fontWeight: '600',
  margin: 0,
};

const messageLabel = {
  fontSize: '11px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  color: '#999' as const,
  margin: '0 0 8px',
};

const messageBody = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#555',
  margin: '0 0 24px',
  whiteSpace: 'pre-wrap' as const,
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
