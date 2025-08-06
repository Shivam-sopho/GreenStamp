import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  try {
    console.log('🌱 Seeding sample eco-actors...');
    
    const sampleUsers = [
      {
        id: crypto.randomUUID(),
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        avatar: null,
        bio: "Passionate environmentalist focused on tree planting and community gardens",
        totalProofs: 15,
        totalImpact: 45,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        name: "Michael Chen",
        email: "michael.chen@example.com",
        avatar: null,
        bio: "Beach cleanup enthusiast and marine life protector",
        totalProofs: 8,
        totalImpact: 32,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        name: "Emma Rodriguez",
        email: "emma.rodriguez@example.com",
        avatar: null,
        bio: "Recycling champion and sustainable living advocate",
        totalProofs: 25,
        totalImpact: 78,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        name: "David Kim",
        email: "david.kim@example.com",
        avatar: null,
        bio: "Energy conservation expert and solar panel installer",
        totalProofs: 12,
        totalImpact: 56,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        name: "Lisa Thompson",
        email: "lisa.thompson@example.com",
        avatar: null,
        bio: "Water conservation specialist and community educator",
        totalProofs: 18,
        totalImpact: 67,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    const createdUsers = [];

    for (const user of sampleUsers) {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('User')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!existingUser) {
        const { data: newUser, error: userError } = await supabase
          .from('User')
          .insert([user])
          .select()
          .single();

        if (userError) {
          console.error(`Error creating user ${user.name}:`, userError);
        } else {
          createdUsers.push(newUser);
          console.log(`✅ Created user: ${user.name}`);
        }
      } else {
        console.log(`⚠️ User already exists: ${user.name}`);
      }
    }

    return NextResponse.json({
      message: "Sample eco-actors seeded successfully",
      timestamp: new Date().toISOString(),
      created: createdUsers.length,
      total: sampleUsers.length,
      users: createdUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        totalProofs: user.totalProofs,
        totalImpact: user.totalImpact
      }))
    });

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    
    return NextResponse.json({
      message: "Failed to seed sample eco-actors",
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
} 