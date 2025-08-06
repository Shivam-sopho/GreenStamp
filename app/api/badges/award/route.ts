import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { userId, badgeId } = await req.json();

    if (!userId || !badgeId) {
      return NextResponse.json({
        error: 'User ID and Badge ID are required'
      }, { status: 400 });
    }

    console.log('Awarding badge:', { userId, badgeId });

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('id, name')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error('User not found:', userError);
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }

    // Check if badge exists
    const { data: badge, error: badgeError } = await supabase
      .from('Badge')
      .select('id, name')
      .eq('id', badgeId)
      .single();

    if (badgeError || !badge) {
      console.error('Badge not found:', badgeError);
      return NextResponse.json({
        error: 'Badge not found'
      }, { status: 404 });
    }

    // Check if user already has this badge
    const { data: existingBadge, error: existingError } = await supabase
      .from('UserBadge')
      .select('id')
      .eq('userId', userId)
      .eq('badgeId', badgeId)
      .single();

    if (existingBadge) {
      return NextResponse.json({
        error: 'User already has this badge'
      }, { status: 409 });
    }

    // Award the badge
    const userBadge = {
      id: crypto.randomUUID(),
      userId,
      badgeId,
      awardedAt: new Date().toISOString(),
      awardedBy: 'Sponsor Dashboard',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { data: newUserBadge, error: awardError } = await supabase
      .from('UserBadge')
      .insert([userBadge])
      .select()
      .single();

    if (awardError) {
      console.error('Error awarding badge:', awardError);
      return NextResponse.json({
        error: 'Failed to award badge',
        details: awardError.message
      }, { status: 500 });
    }

    console.log('Badge awarded successfully:', newUserBadge);

    return NextResponse.json({
      message: 'Badge awarded successfully',
      userBadge: newUserBadge,
      user: user.name,
      badge: badge.name
    });

  } catch (error) {
    console.error('Error in award badge API:', error);
    return NextResponse.json({
      error: 'Failed to award badge',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 