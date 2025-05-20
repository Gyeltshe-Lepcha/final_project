import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name');
    const role = formData.get('role');
    const email = formData.get('email');
    const status = formData.get('status') || 'active';
    const profileImageFile = formData.get('profileImage');

    // Validate required fields
    if (!name || !role || !email) {
      return Response.json(
        { message: "Missing required fields: name, role, email" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check for existing member with same email
    const existingMember = await prisma.teamMember.findUnique({
      where: { email }
    });

    if (existingMember) {
      return Response.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    // Handle file upload (implement your actual file upload logic)
    let profileImageUrl = null;
    if (profileImageFile && profileImageFile.name) {
      profileImageUrl = await handleFileUpload(profileImageFile);
    }

    // Create new member
    const newMember = await prisma.teamMember.create({
      data: {
        name,
        role,
        email,
        status,
        profileImage: profileImageUrl
      }
    });

    return Response.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return Response.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// Implement your actual file upload logic here
async function handleFileUpload(file) {
  // Example: Upload to cloud storage or save to filesystem
  // Return the URL or path to the stored image
  return `https://example.com/uploads/${Date.now()}_${file.name}`;
}