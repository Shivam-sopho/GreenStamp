import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

// Use Supabase connection pooler instead of direct database
// Replace the port 5432 with 6543 for connection pooling
const poolerUrl = process.env.DATABASE_URL?.replace(':5432', ':6543') + 
  '?pgbouncer=true&connection_limit=1&pool_timeout=20&connect_timeout=60';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: poolerUrl,
    },
  },
  log: ['error', 'warn'],
});

export async function GET() {
  try {
    console.log('🔍 Testing Supabase connection pooler...');
    console.log('Pooler URL:', poolerUrl?.substring(0, 50) + '...');
    
    // Test basic connectivity through pooler
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Connection pooler successful:', result);
    
    return NextResponse.json({
      message: "Supabase connection pooler successful",
      timestamp: new Date().toISOString(),
      connection: "✅ Connected through Supabase pooler",
      method: "Connection pooling (port 6543)",
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        usingPooler: true
      }
    });
    
  } catch (error) {
    console.error('❌ Connection pooler failed:', error);
    
    return NextResponse.json({
      message: "Supabase connection pooler failed",
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        meta: (error as any)?.meta
      },
      method: "Connection pooling (port 6543)",
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        usingPooler: true
      }
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 