import { prisma } from '@/lib/prisma';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Validate ID
    if (!id || isNaN(Number(id))) {
      return Response.json(
        { message: "Invalid member ID" },
        { status: 400 }
      );
    }

    // Check if member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: { id: Number(id) }
    });

    if (!existingMember) {
      return Response.json(
        { message: "Team member not found" },
        { status: 404 }
      );
    }

    // Delete member
    await prisma.teamMember.delete({
      where: { id: Number(id) }
    });

    return Response.json(
      { message: "Team member deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting team member:', error);
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}