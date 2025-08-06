import { NextRequest, NextResponse } from "next/server";
import { supabaseHelpers, supabase } from "@/lib/supabase";

// GET /api/ngos - List all NGOs
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const verified = searchParams.get('verified');

    const { data: ngos, error } = await supabaseHelpers.getNGOs({
      limit,
      offset,
      verified: verified !== null ? verified === 'true' : undefined,
    });

    if (error) {
      console.error('Error fetching NGOs:', error);
      return NextResponse.json({ error: 'Failed to fetch NGOs' }, { status: 500 });
    }

    // Get total count for pagination
    const { count: total } = await supabase
      .from('NGO')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      ngos: ngos || [],
      pagination: {
        total: total || 0,
        limit,
        offset,
        hasMore: offset + limit < (total || 0),
      },
    });
  } catch (error) {
    console.error('Error fetching NGOs:', error);
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

    const { data: ngo, error } = await supabase
      .from('NGO')
      .insert([{ name, description, email, website, phone, address }])
      .select()
      .single();

    if (error) {
      console.error('Error creating NGO:', error);
      return NextResponse.json({ error: 'Failed to create NGO' }, { status: 500 });
    }

    return NextResponse.json({ ngo }, { status: 201 });
  } catch (error) {
    console.error('Error creating NGO:', error);
    return NextResponse.json({ error: 'Failed to create NGO' }, { status: 500 });
  }
} 