import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    console.log('🧪 Testing badge system...');
    
    // Test 1: Check if Badge table exists and can be queried
    const { data: badges, error: badgesError } = await supabase
      .from('Badge')
      .select('*')
      .limit(5);
    
    if (badgesError) {
      console.error('Badge table error:', badgesError);
      return NextResponse.json({
        message: "Badge system test failed",
        error: "Badge table not accessible",
        details: badgesError.message
      }, { status: 500 });
    }
    
    console.log('✅ Badge table accessible');
    
    // Test 2: Check if UserBadge table exists and can be queried
    const { data: userBadges, error: userBadgesError } = await supabase
      .from('UserBadge')
      .select('*')
      .limit(5);
    
    if (userBadgesError) {
      console.error('UserBadge table error:', userBadgesError);
      return NextResponse.json({
        message: "Badge system test failed",
        error: "UserBadge table not accessible",
        details: userBadgesError.message
      }, { status: 500 });
    }
    
    console.log('✅ UserBadge table accessible');
    
    // Test 3: Check if we can create a test badge
    const testBadgeId = 'test-badge-' + Date.now();
    const { data: newBadge, error: createError } = await supabase
      .from('Badge')
      .insert([{
        id: testBadgeId,
        name: 'Test Badge',
        description: 'A test badge for system verification',
        icon: '🧪',
        color: 'bg-gray-500',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (createError) {
      console.error('Badge creation error:', createError);
      return NextResponse.json({
        message: "Badge system test failed",
        error: "Cannot create badges",
        details: createError.message
      }, { status: 500 });
    }
    
    console.log('✅ Badge creation successful');
    
    // Test 4: Clean up - delete the test badge
    const { error: deleteError } = await supabase
      .from('Badge')
      .delete()
      .eq('id', testBadgeId);
    
    if (deleteError) {
      console.warn('⚠️ Test cleanup failed:', deleteError.message);
    } else {
      console.log('✅ Test cleanup successful');
    }
    
    return NextResponse.json({
      message: "Badge system test successful",
      timestamp: new Date().toISOString(),
      tests: {
        badgeTableAccess: "✅ Working",
        userBadgeTableAccess: "✅ Working",
        badgeCreation: "✅ Working",
        cleanup: deleteError ? "⚠️ Failed" : "✅ Working"
      },
      existingData: {
        badges: badges?.length || 0,
        userBadges: userBadges?.length || 0
      }
    });
    
  } catch (error) {
    console.error('❌ Badge system test failed:', error);
    
    return NextResponse.json({
      message: "Badge system test failed",
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
} 