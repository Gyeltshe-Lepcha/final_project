import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { id: 'desc' }, // newest first
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        status: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return Response.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return Response.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}