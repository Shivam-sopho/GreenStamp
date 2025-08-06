import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // Get user
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user badges
    const { data: userBadges, error: badgesError } = await supabase
      .from('UserBadge')
      .select(`
        id,
        awardedAt,
        awardedBy,
        badge:Badge(
          id,
          name,
          description,
          icon,
          color
        )
      `)
      .eq('userId', userId);

    if (badgesError) {
      console.error('Error fetching badges:', badgesError);
    }

    // Get user proofs
    const { data: proofs, error: proofsError } = await supabase
      .from('Proof')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .limit(5);

    if (proofsError) {
      console.error('Error fetching proofs:', proofsError);
    }

    // Transform the data to match the expected format
    const profile = {
      id: user.id,
      name: user.name || 'Anonymous User',
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      totalProofs: user.totalProofs || 0,
      totalImpact: user.totalImpact || 0,
      createdAt: user.createdAt,
      badges: userBadges?.map(userBadge => ({
        id: userBadge.id,
        name: userBadge.badge?.name || 'Unknown Badge',
        description: userBadge.badge?.description || '',
        icon: userBadge.badge?.icon || '🏆',
        color: userBadge.badge?.color || 'bg-gray-500',
        awardedAt: userBadge.awardedAt,
        awardedBy: userBadge.awardedBy
      })) || [],
      recentProofs: proofs?.map(proof => ({
        id: proof.id,
        title: proof.title,
        category: proof.category,
        createdAt: proof.createdAt,
        cid: proof.cid,
        blockchainStatus: proof.blockchainStatus
      })) || []
    };

    return NextResponse.json({ profile });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
} 