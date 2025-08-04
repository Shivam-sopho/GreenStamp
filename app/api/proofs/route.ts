import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const ngoId = searchParams.get('ngoId');
    const userId = searchParams.get('userId');

    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (ngoId) {
      where.ngoId = ngoId;
    }
    if (userId) {
      where.userId = userId;
    }

    const proofs = await prisma.proof.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        ngo: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    const total = await prisma.proof.count({ where });

    return NextResponse.json({
      proofs,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching proofs:', error);
    
    // Return empty array instead of error if database is not available
    if (error instanceof Error && error.message.includes('Can\'t reach database server')) {
      console.warn('Database not available, returning empty proofs array');
      return NextResponse.json({
        proofs: [],
        pagination: {
          total: 0,
          limit: 10,
          offset: 0,
          hasMore: false,
        },
      });
    }
    
    return NextResponse.json({ error: 'Failed to fetch proofs' }, { status: 500 });
  }
} 