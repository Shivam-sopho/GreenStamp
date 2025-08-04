import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/ngos - List all NGOs
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const verified = searchParams.get('verified');

    const where: any = {};
    if (verified !== null) {
      where.isVerified = verified === 'true';
    }

    const ngos = await prisma.nGO.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: {
        totalProofs: 'desc',
      },
      include: {
        _count: {
          select: {
            members: true,
            proofs: true,
          },
        },
      },
    });

    const total = await prisma.nGO.count({ where });

    return NextResponse.json({
      ngos,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching NGOs:', error);
    
    // Return empty array instead of error if database is not available
    if (error instanceof Error && error.message.includes('Can\'t reach database server')) {
      console.warn('Database not available, returning empty NGOs array');
      return NextResponse.json({
        ngos: [],
        pagination: {
          total: 0,
          limit: 10,
          offset: 0,
          hasMore: false,
        },
      });
    }
    
    return NextResponse.json({ error: 'Failed to fetch NGOs' }, { status: 500 });
  }
}

// POST /api/ngos - Create a new NGO
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, email, website, phone, address } = body;

    if (!name) {
      return NextResponse.json({ error: 'NGO name is required' }, { status: 400 });
    }

    const ngo = await prisma.nGO.create({
      data: {
        name,
        description,
        email,
        website,
        phone,
        address,
      },
    });

    return NextResponse.json({ ngo }, { status: 201 });
  } catch (error) {
    console.error('Error creating NGO:', error);
    return NextResponse.json({ error: 'Failed to create NGO' }, { status: 500 });
  }
} 