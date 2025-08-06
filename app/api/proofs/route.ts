import { NextRequest, NextResponse } from "next/server";
import { supabaseHelpers } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const ngoId = searchParams.get('ngoId');
    const userId = searchParams.get('userId');

    // Get proofs using Supabase client
    const { data: proofs, error } = await supabaseHelpers.getProofs({
      limit,
      offset,
      category: category || undefined,
      ngoId: ngoId || undefined,
      userId: userId || undefined,
    });

    if (error) {
      console.error('Error fetching proofs:', error);
      return NextResponse.json({ error: 'Failed to fetch proofs' }, { status: 500 });
    }

    // Get total count for pagination
    const total = await supabaseHelpers.countProofs({
      category: category || undefined,
      ngoId: ngoId || undefined,
      userId: userId || undefined,
    });

    return NextResponse.json({
      proofs: proofs || [],
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching proofs:', error);
    
    return NextResponse.json({ error: 'Failed to fetch proofs' }, { status: 500 });
  }
} 