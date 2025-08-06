import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const badge = await req.json();

    // Validate required fields
    if (!badge.name || !badge.id) {
      return NextResponse.json({
        error: 'Badge name and id are required'
      }, { status: 400 });
    }

    // Set timestamps if not provided
    if (!badge.createdAt) {
      badge.createdAt = new Date().toISOString();
    }
    if (!badge.updatedAt) {
      badge.updatedAt = new Date().toISOString();
    }

    // Insert the badge
    const { data: newBadge, error: insertError } = await supabase
      .from('Badge')
      .insert([badge])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating badge:', insertError);
      return NextResponse.json({
        error: 'Failed to create badge',
        details: insertError.message
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Badge created successfully',
      badge: newBadge
    });

  } catch (error) {
    console.error('Error in badge creation:', error);
    return NextResponse.json({
      error: 'Failed to create badge',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 