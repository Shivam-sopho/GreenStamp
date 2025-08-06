import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('User')
      .select('*')
      .order('totalProofs', { ascending: false });

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Get all user badges
    const { data: userBadges, error: badgesError } = await supabase
      .from('UserBadge')
      .select(`
        id,
        userId,
        awardedAt,
        awardedBy,
        badge:Badge(
          id,
          name,
          description,
          icon,
          color
        )
      `);

    if (badgesError) {
      console.error('Error fetching badges:', badgesError);
      // Continue without badges if there's an error
    }

    // Get all proofs for users
    const { data: proofs, error: proofsError } = await supabase
      .from('Proof')
      .select('*');

    if (proofsError) {
      console.error('Error fetching proofs:', proofsError);
      // Continue without proofs if there's an error
    }

    // Combine the data
    const ecoActors = users?.map(user => {
      // Find badges for this user
      const userBadgesList = userBadges?.filter(ub => ub.userId === user.id) || [];
      
      // Find proofs for this user (assuming there's a userId field in Proof)
      const userProofs = proofs?.filter(p => p.userId === user.id) || [];

      return {
        id: user.id,
        name: user.name || 'Anonymous User',
        email: user.email,
        bio: user.bio,
        totalProofs: user.totalProofs || userProofs.length,
        totalImpact: user.totalImpact || 0,
        badges: userBadgesList.map(ub => ({
          id: ub.id,
          name: ub.badge?.name || 'Unknown Badge',
          description: ub.badge?.description || '',
          icon: ub.badge?.icon || '🏆',
          color: ub.badge?.color || 'bg-gray-500',
          awardedAt: ub.awardedAt,
          awardedBy: ub.awardedBy
        })),
        recentProofs: userProofs.slice(0, 3).map(proof => ({
          id: proof.id,
          title: proof.title,
          category: proof.category,
          createdAt: proof.createdAt
        }))
      };
    }) || [];

    return NextResponse.json({ ecoActors });

  } catch (error) {
    console.error('Error in eco-actors API:', error);
    return NextResponse.json({ error: 'Failed to fetch eco-actors' }, { status: 500 });
  }
} 