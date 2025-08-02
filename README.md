# 🌱 GreenStamp

Proof that your green actions matter — AI-verified, blockchain-backed, and publicly visible.

## System Overview

GreenStamp is a comprehensive platform that verifies and rewards eco-actions through AI validation, blockchain immutability, and transparent impact tracking.

## System Architecture

![GreenStamp System Architecture](public/images/system-architecture.png)

The system consists of multiple layers:
- **User Layer**: Mobile and Web applications for proof submission
- **Backend Layer**: Proof capture engine, AI validation, and API gateway
- **Blockchain Layer**: Hedera Hashgraph for immutable record keeping
- **Storage Layer**: IPFS for media storage and PostgreSQL for indexing
- **Verification Layer**: Public verification portal, NGO and Sponsor dashboards

## Workflow Diagram

![GreenStamp Workflow](public/images/workflow-diagram.png)

The GreenStamp workflow:
1. **Eco-Actor** captures proof (photo, GPS, timestamp)
2. **GreenStamp App** sends proof for AI validation
3. **AI Proof Validator** returns authenticity status
4. **Hedera Ledger** stores immutable proof hash
5. **NGO Dashboard** receives verified action and impact record
6. **Sponsor Dashboard** releases funding based on verified impact
7. **Eco-Actor** receives GreenStamp badge as reward

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

### File Upload & IPFS Integration
- Upload images and videos as proof of your green actions
- Files are uploaded to IPFS using authenticated services (Pinata/Infura)
- IPFS CID and gateway URL are displayed after successful upload
- Fallback to local storage if IPFS is unavailable

### Current Implementation
- **File Storage**: IPFS via Pinata/Infura with local fallback
- **File Types**: Images and videos (as specified in the file input)
- **Security**: Uses IPFS for content addressing and immutability
- **Authentication**: Supports Pinata JWT or Infura Project ID/API Key

## IPFS Setup

To enable authenticated IPFS uploads, create a `.env.local` file in your project root:

### Option 1: Pinata (Recommended - Free tier available)
1. Go to [https://pinata.cloud](https://pinata.cloud)
2. Sign up for a free account
3. Go to API Keys → Create New Key
4. Copy your JWT token
5. Add to `.env.local`:
   ```
   PINATA_JWT_TOKEN=your_jwt_token_here
   ```

### Option 2: Infura IPFS
1. Go to [https://infura.io](https://infura.io)
2. Sign up and create an IPFS project
3. Get your Project ID and API Key
4. Add to `.env.local`:
   ```
   INFURA_PROJECT_ID=your_project_id
   INFURA_API_KEY=your_api_key
   ```

### Option 3: No Setup (Fallback)
If no IPFS credentials are provided, the app will automatically fall back to local file storage.

## Vercel Deployment

To deploy to Vercel with IPFS functionality:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `PINATA_JWT_TOKEN` or `INFURA_PROJECT_ID` + `INFURA_API_KEY`
4. Deploy

## Future Enhancements

- **AI Validation**: Implement AI-powered proof verification
- **Hedera Integration**: Connect to Hedera Hashgraph for immutable records
- **NGO Dashboard**: Create dashboard for impact tracking
- **Sponsor Dashboard**: Build funding release mechanisms
- **Mobile App**: Develop native mobile application
- **Badge System**: Implement GreenStamp badge rewards

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


