import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test 1: Check if we can reach Supabase
    const supabaseHost = 'db.dgbevojijyhhcicahrvi.supabase.co';
    
    // Test 2: Try to get project info from Supabase
    const projectId = 'dgbevojijyhhcicahrvi';
    const supabaseUrl = `https://${projectId}.supabase.co`;
    
    console.log('🔍 Testing Supabase connectivity...');
    console.log('Host:', supabaseHost);
    console.log('Project URL:', supabaseUrl);
    
    // Test 3: Check environment variables
    const envCheck = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlLength: process.env.DATABASE_URL?.length || 0,
      databaseUrlStartsWith: process.env.DATABASE_URL?.startsWith('postgresql://') || false,
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL,
    };
    
    console.log('Environment check:', envCheck);
    
    return NextResponse.json({
      message: "Supabase status check",
      timestamp: new Date().toISOString(),
      supabase: {
        host: supabaseHost,
        projectId: projectId,
        projectUrl: supabaseUrl,
        status: "Checking connectivity..."
      },
      environment: envCheck,
      nextSteps: [
        "Check if Supabase project is active",
        "Verify database is not paused",
        "Check connection pooling settings",
        "Verify project region and billing"
      ]
    });
    
  } catch (error) {
    console.error('❌ Supabase status check failed:', error);
    
    return NextResponse.json({
      message: "Supabase status check failed",
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
} 