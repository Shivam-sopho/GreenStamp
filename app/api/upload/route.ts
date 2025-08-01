import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'

interface UploadResponse {
  success: boolean
  cid: string
  originalName: string
  size: number
  type: string
  url: string
}

export async function POST(req: Request) {
  try {
    // Parse the incoming file
    const data = await req.formData()
    const file = data.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Convert browser File to Node buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Save temporarily
    const tempPath = path.join(os.tmpdir(), file.name)
    fs.writeFileSync(tempPath, buffer)

    try {
      const formData = new FormData()
      formData.append('file', new Blob([buffer], { type: file.type }), file.name)

      let response: Response
      let cid: string
      let gatewayUrl: string

      // Check which IPFS service to use
      if (process.env.PINATA_JWT_TOKEN) {
        // Use Pinata
        response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PINATA_JWT_TOKEN}`,
          },
          body: formData,
        })
        
        if (response.ok) {
          const result = await response.json()
          cid = result.IpfsHash
          gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`
        } else {
          throw new Error(`Pinata upload failed: ${response.statusText}`)
        }
      } else if (process.env.INFURA_PROJECT_ID && process.env.INFURA_API_KEY) {
        // Use Infura
        response = await fetch(`https://ipfs.infura.io:5001/api/v0/add`, {
          method: 'POST',
          body: formData,
        })
        
        if (response.ok) {
          const result = await response.json()
          cid = result.Hash
          gatewayUrl = `https://ipfs.io/ipfs/${cid}`
        } else {
          throw new Error(`Infura upload failed: ${response.statusText}`)
        }
      } else {
        // No IPFS credentials, fall back to local storage
        throw new Error('No IPFS credentials configured')
      }

      // Clean up temp file
      fs.unlinkSync(tempPath)

      const uploadResponse: UploadResponse = {
        success: true,
        cid: cid,
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: gatewayUrl
      }

      return NextResponse.json(uploadResponse)
    } catch (ipfsError) {
      // Fallback to local storage if IPFS fails
      console.warn('IPFS upload failed, falling back to local storage:', ipfsError)
      
      // Generate a unique filename for local storage
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 15)
      const fileExtension = path.extname(file.name)
      const fileName = `${timestamp}-${randomId}${fileExtension}`

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      // Save file to public/uploads directory
      const filePath = path.join(uploadsDir, fileName)
      fs.writeFileSync(filePath, buffer)

      // Clean up temp file
      fs.unlinkSync(tempPath)

      const uploadResponse: UploadResponse = {
        success: true,
        cid: `local-${fileName}`, // Local identifier
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: `/uploads/${fileName}`
      }

      return NextResponse.json(uploadResponse)
    }
  } catch (err: unknown) {
    console.error(err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
