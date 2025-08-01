# 🌱 GreenStamp

Proof that your green actions matter — AI-verified, blockchain-backed, and publicly visible.

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

### File Upload
- Upload images and videos as proof of your green actions
- Files are stored locally in the `public/uploads` directory
- Unique filenames are generated to prevent conflicts
- File metadata is displayed after successful upload

### Current Implementation
- **File Storage**: Local file system storage in `public/uploads/`
- **File Types**: Images and videos (as specified in the file input)
- **Security**: Unique filename generation with timestamp and random ID
- **UI**: Clean, responsive interface with upload progress feedback

## File Upload Flow

1. Navigate to `/submit` page
2. Select an image or video file
3. Click "Upload Proof"
4. File is saved to `public/uploads/` with a unique name
5. Success message shows file details and a link to view the uploaded file

## Future Enhancements

The current implementation uses local file storage. For production, consider:

- **IPFS Integration**: Upload files to IPFS for decentralized storage
- **Blockchain Integration**: Store file hashes on blockchain for immutability
- **AI Verification**: Add AI-powered verification of green actions
- **User Authentication**: Add user accounts and proof management
- **Database**: Store metadata in a database for better organization

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
