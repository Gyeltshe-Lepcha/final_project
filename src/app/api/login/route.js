import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// ✅ Seed admin if not exists
async function seedAdminUser() {
  const adminEmail = 'admin@example.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin User',
        password: hashedPassword,
        role: 'admin',
        contact: '0000000000', // make sure this matches your schema
      },
    });
    console.log('✅ Admin seeded: admin@example.com / admin123');
  }
}

export async function POST(req) {
  try {
    // Ensure admin account is seeded
    await seedAdminUser();

    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ✅ Success! Respond based on role
    return new Response(
      JSON.stringify({
        message:
          user.role === 'admin'
            ? `Welcome back, admin ${user.name}!`
            : `Welcome back, ${user.name}!`,
        role: user.role,
        name: user.name,
        email: user.email,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
