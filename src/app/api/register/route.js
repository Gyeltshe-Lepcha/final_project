import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, contact, email, password } = await req.json();

    if (!name || !contact || !email || !password) {
      return new Response(
        JSON.stringify({ error: 'All fields are required!' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return new Response(
        JSON.stringify({ error: 'Email already registered' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        contact,
        email,
        password: hashedPassword,
        role: 'user', // default role
      },
    });

    return new Response(
      JSON.stringify({ message: `User ${newUser.name} registered successfully!` }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Register error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
