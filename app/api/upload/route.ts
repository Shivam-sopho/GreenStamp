import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import os from "os";
import { hederaService, ProofRecord } from "@/lib/hedera";
import { prisma } from "@/lib/db";

interface UploadResponse {
  success: boolean;
  cid: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  proofHash: string;
  topicId?: string;
  sequenceNumber?: number;
  blockchainStatus: 'success' | 'failed' | 'not_configured';
  proofId?: string; // Database ID
}

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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create temporary file
    const tempPath = path.join(os.tmpdir(), file.name);
    await writeFile(tempPath, buffer);

    let cid: string;
    let gatewayUrl: string;

    try {
      // Upload to IPFS using a public gateway (Pinata/Infura)
      const formDataIPFS = new FormData();
      formDataIPFS.append('file', new Blob([buffer], { type: file.type }), file.name);

      let response: Response;
      
      if (process.env.PINATA_JWT_TOKEN) {
        // Use Pinata
        response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PINATA_JWT_TOKEN}`,
          },
          body: formDataIPFS,
        });
      } else if (process.env.INFURA_PROJECT_ID && process.env.INFURA_API_KEY) {
        // Use Infura
        response = await fetch(`https://ipfs.infura.io:5001/api/v0/add`, {
          method: 'POST',
          body: formDataIPFS,
        });
      } else {
        throw new Error('No IPFS credentials configured');
      }

      if (!response.ok) {
        throw new Error(`IPFS upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      cid = result.IpfsHash || result.Hash;
      gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}` || `https://ipfs.io/ipfs/${cid}`;

    } catch (ipfsError) {
      console.error('IPFS upload failed, falling back to local storage:', ipfsError);
      
      // Fallback to local storage
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });
      
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadsDir, fileName);
      await writeFile(filePath, buffer);
      
      cid = `local-${fileName}`;
      gatewayUrl = `/uploads/${fileName}`;
    }

    // Generate proof hash and store on Hedera
    const timestamp = Date.now();
    const proofHash = hederaService.generateProofHash(cid, timestamp, file.name);
    const proofRecord: ProofRecord = {
      cid,
      originalName: file.name,
      size: file.size,
      type: file.type,
      timestamp,
      proofHash,
    };

    let blockchainResult: { topicId?: string; sequenceNumber?: number } = {};
    let blockchainStatus: 'success' | 'failed' | 'not_configured' = 'not_configured';

    try {
      if (process.env.HEDERA_ACCOUNT_ID && process.env.HEDERA_PRIVATE_KEY) {
        blockchainResult = await hederaService.storeProof(proofRecord);
        blockchainStatus = 'success';
      }
    } catch (blockchainError) {
      console.error('Hedera blockchain error:', blockchainError);
      blockchainStatus = 'failed';
    }

    // Store in database
    let proofId: string | undefined;
    try {
      // Convert tags to array for PostgreSQL
      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
      
      const dbProof = await prisma.proof.create({
        data: {
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
        },
      });
      proofId = dbProof.id;

      // Update user stats if userId provided
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            totalProofs: { increment: 1 },
            totalImpact: { increment: 1 }, // Basic impact scoring
          },
        });
      }

      // Update NGO stats if ngoId provided
      if (ngoId) {
        await prisma.ngo.update({
          where: { id: ngoId },
          data: {
            totalProofs: { increment: 1 },
            totalImpact: { increment: 1 },
          },
        });
      }

      // Update category stats if category provided
      if (category) {
        await prisma.category.upsert({
          where: { name: category },
          update: {
            totalProofs: { increment: 1 },
          },
          create: {
            name: category,
            totalProofs: 1,
          },
        });
      }

    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue without database storage if it fails
    }

    const uploadResponse: UploadResponse = {
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
    };

    return NextResponse.json(uploadResponse);

  } catch (err: unknown) {
    console.error('Upload error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
