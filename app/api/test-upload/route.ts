import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    console.log('🧪 Testing upload components...');
    
    // Test 1: Check if we can generate UUIDs
    const testUuid = crypto.randomUUID();
    console.log('✅ UUID generation:', testUuid);
    
    // Test 2: Check if we can insert a test proof
    const testProof = {
      id: crypto.randomUUID(),
      cid: 'test-cid-' + Date.now(),
      originalName: 'test-file.jpg',
      size: 1024,
      type: 'image/jpeg',
      url: 'https://example.com/test.jpg',
      proofHash: 'test-hash-' + Date.now(),
      topicId: null,
      sequenceNumber: null,
      blockchainStatus: 'not_configured',
      title: 'Test Proof',
      category: 'test-category',
      location: 'Test Location',
      tags: ['test', 'upload'],
      userId: null,
      ngoId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    console.log('🔍 Testing proof insert...');
    const { data: insertedProof, error: insertError } = await supabase
      .from('Proof')
      .insert([testProof])
      .select()
      .single();
    
    if (insertError) {
      throw new Error(`Proof insert test failed: ${insertError.message}`);
    }
    
    console.log('✅ Proof insert successful:', insertedProof.id);
    
    // Test 3: Check if we can fetch the inserted proof
    const { data: fetchedProof, error: fetchError } = await supabase
      .from('Proof')
      .select('*')
      .eq('id', insertedProof.id)
      .single();
    
    if (fetchError) {
      throw new Error(`Proof fetch test failed: ${fetchError.message}`);
    }
    
    console.log('✅ Proof fetch successful');
    
    // Test 4: Clean up - delete the test proof
    const { error: deleteError } = await supabase
      .from('Proof')
      .delete()
      .eq('id', insertedProof.id);
    
    if (deleteError) {
      console.warn('⚠️ Test cleanup failed:', deleteError.message);
    } else {
      console.log('✅ Test cleanup successful');
    }
    
    return NextResponse.json({
      message: "Upload components test successful",
      timestamp: new Date().toISOString(),
      tests: {
        uuidGeneration: "✅ Working",
        proofInsert: "✅ Working",
        proofFetch: "✅ Working",
        cleanup: deleteError ? "⚠️ Failed" : "✅ Working"
      },
      testProof: {
        id: insertedProof.id,
        cid: insertedProof.cid,
        title: insertedProof.title
      }
    });
    
  } catch (error) {
    console.error('❌ Upload components test failed:', error);
    
    return NextResponse.json({
      message: "Upload components test failed",
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
} 