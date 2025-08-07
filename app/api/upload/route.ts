import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { aiValidationService } from "@/lib/ai-validation";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const location = formData.get("location") as string;
    const tags = formData.get("tags") as string;
    const userId = formData.get("userId") as string;
    const ngoId = formData.get("ngoId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return NextResponse.json({ error: "Only image and video files are allowed" }, { status: 400 });
    }

    // Convert file to buffer for AI validation
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // AI Validation (only for images)
    let aiValidationResult = null;
    if (file.type.startsWith('image/')) {
      try {
        console.log('🔍 Starting AI validation...');
        aiValidationResult = await aiValidationService.analyzeImage(buffer);
        console.log('✅ AI validation completed:', {
          success: aiValidationResult.success,
          environmentalScore: aiValidationResult.environmentalScore,
          safetyScore: aiValidationResult.safetyScore,
          confidence: aiValidationResult.confidence
        });
      } catch (error) {
        console.error('❌ AI validation failed:', error);
        aiValidationResult = {
          success: false,
          confidence: 0,
          detectedObjects: [],
          environmentalScore: 0,
          safetyScore: 0,
          textContent: [],
          labels: [],
          error: 'AI validation failed'
        };
      }
    }

    // Upload to IPFS (using existing logic)
    let cid: string;
    let gatewayUrl: string;

    try {
      // Try Pinata first
      if (process.env.PINATA_JWT_TOKEN) {
        const pinataFormData = new FormData();
        pinataFormData.append('file', file);
        
        const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PINATA_JWT_TOKEN}`
          },
          body: pinataFormData
        });

        if (pinataResponse.ok) {
          const pinataData = await pinataResponse.json();
          cid = pinataData.IpfsHash;
          gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
          console.log('📤 Uploaded to Pinata IPFS');
        } else {
          throw new Error('Pinata upload failed');
        }
      } else {
        // Fallback to Infura
        const infuraFormData = new FormData();
        infuraFormData.append('file', file);
        
        const infuraResponse = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
          method: 'POST',
          body: infuraFormData
        });

        if (infuraResponse.ok) {
          const infuraData = await infuraResponse.json();
          cid = infuraData.Hash;
          gatewayUrl = `https://ipfs.io/ipfs/${cid}`;
          console.log('📤 Uploaded to Infura IPFS');
        } else {
          throw new Error('Infura upload failed');
        }
      }
    } catch (error) {
      console.error('IPFS upload error:', error);
      return NextResponse.json({ error: "Failed to upload to IPFS" }, { status: 500 });
    }

    // Generate proof hash
    const proofHash = `proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create enhanced proof record for blockchain
    const proofRecord = {
      cid,
      originalName: file.name,
      size: file.size,
      type: file.type,
      timestamp: Date.now(),
      proofHash,
      action: "PROOF_STORED"
    };

    // Blockchain integration (existing logic)
    let blockchainResult = { topicId: null, sequenceNumber: null };
    let blockchainStatus: 'success' | 'failed' | 'not_configured' = 'not_configured';

    if (process.env.HEDERA_ACCOUNT_ID && process.env.HEDERA_PRIVATE_KEY) {
      try {
        const { HederaService } = await import('@/lib/hedera');
        const hederaService = new HederaService();
        
        blockchainResult = await hederaService.storeProof(proofRecord);
        blockchainStatus = 'success';
        console.log('⛓️ Stored enhanced proof on Hedera blockchain:', {
          topicId: blockchainResult.topicId,
          sequenceNumber: blockchainResult.sequenceNumber,
          proofData: proofRecord
        });
      } catch (error) {
        console.error('Hedera error:', error);
        blockchainStatus = 'failed';
      }
    }

    // Store in database using Supabase client
    let proofId: string | undefined;
    try {
      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
      const proofUuid = crypto.randomUUID(); // Manual UUID generation
      
      // Prepare AI validation data
      const aiValidationData = aiValidationResult ? {
        aiValidationStatus: aiValidationResult.success ? 'completed' : 'failed',
        aiConfidenceScore: aiValidationResult.confidence,
        aiEnvironmentalScore: aiValidationResult.environmentalScore,
        aiSafetyScore: aiValidationResult.safetyScore,
        aiDetectedObjects: aiValidationResult.detectedObjects,
        aiDetectedLabels: aiValidationResult.labels,
        aiTextContent: aiValidationResult.textContent,
        aiSuggestedCategory: aiValidationResult.success ? 
          aiValidationService.getEnvironmentalCategory(aiValidationResult.labels, aiValidationResult.detectedObjects) : null,
        aiValidationDetails: aiValidationResult
      } : {
        aiValidationStatus: 'not_applicable',
        aiConfidenceScore: null,
        aiEnvironmentalScore: null,
        aiSafetyScore: null,
        aiDetectedObjects: [],
        aiDetectedLabels: [],
        aiTextContent: [],
        aiSuggestedCategory: null,
        aiValidationDetails: null
      };

      const { data: dbProof, error: proofError } = await supabase
        .from('Proof')
        .insert([{
          id: proofUuid,
          cid,
          originalName: file.name,
          size: file.size,
          type: file.type,
          url: gatewayUrl,
          proofHash,
          topicId: blockchainResult.topicId,
          sequenceNumber: blockchainResult.sequenceNumber,
          blockchainStatus,
          title: title || null,
          category: category || null,
          location: location || null,
          tags: tagsArray,
          userId: userId || null,
          ngoId: ngoId || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...aiValidationData
        }])
        .select()
        .single();

      if (proofError) {
        throw new Error(`Proof insert failed: ${proofError.message}`);
      }
      proofId = dbProof.id;

      // Update User stats
      if (userId) {
        const { data: currentUser } = await supabase
          .from('User')
          .select('totalProofs, totalImpact')
          .eq('id', userId)
          .single();

        if (currentUser) {
          const newTotalProofs = (currentUser.totalProofs || 0) + 1;
          const newTotalImpact = (currentUser.totalImpact || 0) + (aiValidationResult?.environmentalScore || 10);

          await supabase
            .from('User')
            .update({
              totalProofs: newTotalProofs,
              totalImpact: newTotalImpact,
              updatedAt: new Date().toISOString()
            })
            .eq('id', userId);
        }
      }

      // Update NGO stats
      if (ngoId) {
        const { data: currentNGO } = await supabase
          .from('NGO')
          .select('totalProofs, totalImpact')
          .eq('id', ngoId)
          .single();

        if (currentNGO) {
          const newTotalProofs = (currentNGO.totalProofs || 0) + 1;
          const newTotalImpact = (currentNGO.totalImpact || 0) + (aiValidationResult?.environmentalScore || 10);

          await supabase
            .from('NGO')
            .update({
              totalProofs: newTotalProofs,
              totalImpact: newTotalImpact,
              updatedAt: new Date().toISOString()
            })
            .eq('id', ngoId);
        }
      }

      // Update Category stats
      if (category) {
        const { data: currentCategory } = await supabase
          .from('Category')
          .select('totalProofs, totalImpact')
          .eq('name', category)
          .single();

        if (currentCategory) {
          const newTotalProofs = (currentCategory.totalProofs || 0) + 1;
          const newTotalImpact = (currentCategory.totalImpact || 0) + (aiValidationResult?.environmentalScore || 10);

          await supabase
            .from('Category')
            .update({
              totalProofs: newTotalProofs,
              totalImpact: newTotalImpact,
              updatedAt: new Date().toISOString()
            })
            .eq('name', category);
        } else {
          // Create new category if it doesn't exist
          const categoryUuid = crypto.randomUUID();
          await supabase
            .from('Category')
            .insert([{
              id: categoryUuid,
              name: category,
              description: `Environmental category: ${category}`,
              totalProofs: 1,
              totalImpact: aiValidationResult?.environmentalScore || 10,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }]);
        }
      }

    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: "Failed to store proof in database" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      cid,
      originalName: file.name,
      size: file.size,
      type: file.type,
      url: gatewayUrl,
      proofHash,
      topicId: blockchainResult.topicId,
      sequenceNumber: blockchainResult.sequenceNumber,
      blockchainStatus,
      proofId,
      // Enhanced blockchain data
      blockchainProof: blockchainStatus === 'success' ? proofRecord : null,
      aiValidation: aiValidationResult ? {
        status: aiValidationResult.success ? 'completed' : 'failed',
        environmentalScore: aiValidationResult.environmentalScore,
        safetyScore: aiValidationResult.safetyScore,
        confidence: aiValidationResult.confidence,
        suggestedCategory: aiValidationResult.success ? 
          aiValidationService.getEnvironmentalCategory(aiValidationResult.labels, aiValidationResult.detectedObjects) : null,
        detectedObjects: aiValidationResult.detectedObjects.slice(0, 5), // Top 5 objects
        detectedLabels: aiValidationResult.labels.slice(0, 5), // Top 5 labels
        isSafe: aiValidationService.isImageSafe(aiValidationResult.safetyScore),
        isEnvironmentallyRelevant: aiValidationService.isEnvironmentallyRelevant(aiValidationResult.environmentalScore)
      } : null
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
