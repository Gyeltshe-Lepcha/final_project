import { prisma } from '@/lib/prisma';

export async function PUT(request, context) {
  try {
    // 1) grab the id properly
    const { id } = context.params;
    if (!id || isNaN(+id)) {
      return Response.json({ message: 'Invalid member ID' }, { status: 400 });
    }

    // 2) detect content-type & parse body
    const contentType = request.headers.get('content-type') || '';
    let payload = {};
    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      payload = {
        name: formData.get('name'),
        role: formData.get('role'),
        email: formData.get('email'),
        status: formData.get('status'),
        profileImageFile: formData.get('profileImage'),
      };
    } else {
      return Response.json(
        { message: 'Unsupported Content-Type' },
        { status: 415 }
      );
    }

    const { name, role, email, status, profileImageFile } = payload;

    // 3) required fields check (only if they’re coming in)
    if (payload.name !== undefined && (!name || !role || !email)) {
      return Response.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 4) find existing member
    const existing = await prisma.teamMember.findUnique({
      where: { id: +id },
    });
    if (!existing) {
      return Response.json({ message: 'Member not found' }, { status: 404 });
    }

    // 5) email uniqueness
    if (email && email !== existing.email) {
      const clash = await prisma.teamMember.findUnique({ where: { email } });
      if (clash) {
        return Response.json(
          { message: 'Email already in use' },
          { status: 400 }
        );
      }
    }

    // 6) handle new profile pic
    let profileImage = existing.profileImage;
    if (profileImageFile && profileImageFile.name) {
      profileImage = await handleFileUpload(profileImageFile);
    }

    // 7) do the update
    const updated = await prisma.teamMember.update({
      where: { id: +id },
      data: {
        name: name ?? existing.name,
        role: role ?? existing.role,
        email: email ?? existing.email,
        status: status ?? existing.status,
        profileImage,
      },
    });

    return Response.json(updated, { status: 200 });
  } catch (err) {
    console.error('💥 update-member error:', err);
    return Response.json(
      { message: 'Internal Server Error', error: err.message },
      { status: 500 }
    );
  }
}

// just a dummy uploader — swap in your real logic
async function handleFileUpload(file) {
  return `https://example.com/uploads/${Date.now()}_${file.name}`;
}
