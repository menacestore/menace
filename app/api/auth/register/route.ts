import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid registration data', details: validation.error.issues }, { status: 400 });
    }

    const { email, password, name } = validation.data;

    const existing = await query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await query(
      `INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, 'customer') RETURNING id, email, name, role`,
      [email, passwordHash, name]
    );

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: result[0].id,
        email: result[0].email,
        name: result[0].name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
