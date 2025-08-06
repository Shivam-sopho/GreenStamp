import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Get all badges from the database
    const { data: badges, error: badgesError } = await supabase
      .from('Badge')
      .select('*')
      .order('name');

    if (badgesError) {
      console.error('Error fetching badges:', badgesError);
      return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 });
    }

    // Transform badges to match the expected format
    const transformedBadges = badges?.map(badge => ({
      id: badge.id,
      name: badge.name,
      description: badge.description || '',
      icon: badge.icon || '🏆',
      color: badge.color || 'bg-gray-500',
      criteria: 'Awarded for environmental contributions'
    })) || [];

    return NextResponse.json({ badges: transformedBadges });

  } catch (error) {
    console.error('Error in badges list API:', error);
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 });
  }
} 