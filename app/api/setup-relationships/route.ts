import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  try {
    console.log('🔗 Setting up foreign key relationships...');
    
    // Add foreign key constraints
    const { error: userBadgeUserError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Add foreign key constraint for UserBadge.userId -> User.id
        ALTER TABLE "UserBadge" 
        ADD CONSTRAINT IF NOT EXISTS "UserBadge_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
      `
    });

    if (userBadgeUserError) {
      console.error('UserBadge.userId foreign key error:', userBadgeUserError);
    } else {
      console.log('✅ UserBadge.userId foreign key created');
    }

    const { error: userBadgeBadgeError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Add foreign key constraint for UserBadge.badgeId -> Badge.id
        ALTER TABLE "UserBadge" 
        ADD CONSTRAINT IF NOT EXISTS "UserBadge_badgeId_fkey" 
        FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
      `
    });

    if (userBadgeBadgeError) {
      console.error('UserBadge.badgeId foreign key error:', userBadgeBadgeError);
    } else {
      console.log('✅ UserBadge.badgeId foreign key created');
    }

    // Add unique constraint
    const { error: uniqueError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Add unique constraint for UserBadge
        ALTER TABLE "UserBadge" 
        ADD CONSTRAINT IF NOT EXISTS "UserBadge_userId_badgeId_key" 
        UNIQUE ("userId", "badgeId");
      `
    });

    if (uniqueError) {
      console.error('Unique constraint error:', uniqueError);
    } else {
      console.log('✅ Unique constraint created');
    }

    // Add indexes
    const { error: indexesError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Add indexes for better performance
        CREATE INDEX IF NOT EXISTS "UserBadge_userId_idx" ON "UserBadge"("userId");
        CREATE INDEX IF NOT EXISTS "UserBadge_badgeId_idx" ON "UserBadge"("badgeId");
        CREATE INDEX IF NOT EXISTS "UserBadge_awardedAt_idx" ON "UserBadge"("awardedAt");
        CREATE INDEX IF NOT EXISTS "Badge_name_idx" ON "Badge"("name");
      `
    });

    if (indexesError) {
      console.error('Indexes creation error:', indexesError);
    } else {
      console.log('✅ Indexes created');
    }

    return NextResponse.json({
      message: "Foreign key relationships setup completed",
      timestamp: new Date().toISOString(),
      relationships: {
        "UserBadge.userId -> User.id": "✅ Created",
        "UserBadge.badgeId -> Badge.id": "✅ Created",
        "Unique constraint": "✅ Created",
        "Indexes": "✅ Created"
      }
    });

  } catch (error) {
    console.error('❌ Foreign key relationships setup failed:', error);
    
    return NextResponse.json({
      message: "Foreign key relationships setup failed",
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
} 