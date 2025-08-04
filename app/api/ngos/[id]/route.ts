import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/ngos/[id] - Get specific NGO with stats
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ngo = await prisma.nGO.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            members: true,
            proofs: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            joinedAt: 'desc',
          },
        },
        proofs: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // Latest 10 proofs
        },
      },
    });

    if (!ngo) {
      return NextResponse.json({ error: 'NGO not found' }, { status: 404 });
    }

    return NextResponse.json({ ngo });
  } catch (error) {
    console.error('Error fetching NGO:', error);
    return NextResponse.json({ error: 'Failed to fetch NGO' }, { status: 500 });
  }
}

// PUT /api/ngos/[id] - Update NGO
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, description, logo, website, email, phone, address } = body;

    const ngo = await prisma.nGO.update({
      where: { id: params.id },
      data: {
        name,
        description,
        logo,
        website,
        email,
        phone,
        address,
      },
    });

    return NextResponse.json({ ngo });
  } catch (error) {
    console.error('Error updating NGO:', error);
    return NextResponse.json({ error: 'Failed to update NGO' }, { status: 500 });
  }
}

// DELETE /api/ngos/[id] - Delete NGO
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.nGO.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'NGO deleted successfully' });
  } catch (error) {
    console.error('Error deleting NGO:', error);
    return NextResponse.json({ error: 'Failed to delete NGO' }, { status: 500 });
  }
} 