import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

// Test with alternative connection parameters
const connectionUrl = process.env.DATABASE_URL + 
  '?sslmode=require&connection_limit=1&pool_timeout=20&connect_timeout=60&keepalive=1';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: connectionUrl,
    },
  },
  log: ['error', 'warn'],
});

export async function GET() {
  try {
    console.log('🔍 Testing alternative database connection...');
    console.log('Connection URL:', connectionUrl.substring(0, 50) + '...');
    
    // Test basic connectivity
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Alternative connection successful:', result);
    
    return NextResponse.json({
      message: "Alternative database connection successful",
      timestamp: new Date().toISOString(),
      connection: "✅ Connected with alternative parameters",
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        connectionMethod: "Alternative with SSL and keepalive"
      }
    });
    
  } catch (error) {
    console.error('❌ Alternative connection failed:', error);
    
    return NextResponse.json({
      message: "Alternative database connection failed",
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        meta: (error as any)?.meta
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        connectionMethod: "Alternative with SSL and keepalive"
      }
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 