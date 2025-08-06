import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  try {
    console.log('🔧 Setting up badge tables...');
    
    // Create Badge table
    const { error: badgeTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Badge" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "icon" TEXT,
          "color" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
        );
      `
    });

    if (badgeTableError) {
      console.error('Badge table creation error:', badgeTableError);
      return NextResponse.json({
        message: "Failed to create Badge table",
        error: badgeTableError.message
      }, { status: 500 });
    }

    console.log('✅ Badge table created');

    // Create UserBadge table
    const { error: userBadgeTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "UserBadge" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "badgeId" TEXT NOT NULL,
          "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "awardedBy" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
        );
      `
    });

    if (userBadgeTableError) {
      console.error('UserBadge table creation error:', userBadgeTableError);
      return NextResponse.json({
        message: "Failed to create UserBadge table",
        error: userBadgeTableError.message
      }, { status: 500 });
    }

    console.log('✅ UserBadge table created');

    // Add constraints and indexes
    const { error: constraintsError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Add unique constraint for UserBadge
        ALTER TABLE "UserBadge" ADD CONSTRAINT IF NOT EXISTS "UserBadge_userId_badgeId_key" UNIQUE ("userId", "badgeId");
        
        -- Add foreign key constraints
        ALTER TABLE "UserBadge" ADD CONSTRAINT IF NOT EXISTS "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        ALTER TABLE "UserBadge" ADD CONSTRAINT IF NOT EXISTS "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        
        -- Add indexes
        CREATE INDEX IF NOT EXISTS "Badge_name_idx" ON "Badge"("name");
        CREATE INDEX IF NOT EXISTS "UserBadge_userId_idx" ON "UserBadge"("userId");
        CREATE INDEX IF NOT EXISTS "UserBadge_badgeId_idx" ON "UserBadge"("badgeId");
        CREATE INDEX IF NOT EXISTS "UserBadge_awardedAt_idx" ON "UserBadge"("awardedAt");
      `
    });

    if (constraintsError) {
      console.error('Constraints creation error:', constraintsError);
      return NextResponse.json({
        message: "Failed to create constraints and indexes",
        error: constraintsError.message
      }, { status: 500 });
    }

    console.log('✅ Constraints and indexes created');

    return NextResponse.json({
      message: "Badge tables setup successful",
      timestamp: new Date().toISOString(),
      tables: {
        Badge: "✅ Created",
        UserBadge: "✅ Created",
        constraints: "✅ Created",
        indexes: "✅ Created"
      }
    });

  } catch (error) {
    console.error('❌ Badge tables setup failed:', error);
    
    return NextResponse.json({
      message: "Badge tables setup failed",
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
} 