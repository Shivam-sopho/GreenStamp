import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

// Official Supabase connection format
const supabaseUrl = process.env.DATABASE_URL + 
  '?sslmode=require&pgbouncer=true&connection_limit=1&pool_timeout=20&connect_timeout=60';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: supabaseUrl,
    },
  },
  log: ['error', 'warn'],
});

export async function GET() {
  try {
    console.log('🔍 Testing official Supabase connection...');
    console.log('Supabase URL:', supabaseUrl?.substring(0, 50) + '...');
    
    // Test basic connectivity
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Official Supabase connection successful:', result);
    
    return NextResponse.json({
      message: "Official Supabase connection successful",
      timestamp: new Date().toISOString(),
      connection: "✅ Connected with official Supabase format",
      method: "Official Supabase with SSL and pgbouncer",
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        usingOfficialFormat: true
      }
    });
    
  } catch (error) {
    console.error('❌ Official Supabase connection failed:', error);
    
    return NextResponse.json({
      message: "Official Supabase connection failed",
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        meta: (error as any)?.meta
      },
      method: "Official Supabase with SSL and pgbouncer",
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        usingOfficialFormat: true
      }
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 