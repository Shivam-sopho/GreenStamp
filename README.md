# 🌱 GreenStamp

AI-verified, blockchain-backed eco-action proofs. Submit your environmental actions and get them immutably stored on the Hedera blockchain.

## 🚀 Features

### Core Functionality
- **📤 Proof Submission**: Upload environmental action proofs with metadata
- **🔗 IPFS Storage**: Decentralized file storage with fallback to local storage
- **⛓️ Blockchain Verification**: Immutable proof storage on Hedera Hashgraph
- **🔍 Proof Verification**: Verify any proof using HashScan explorer
- **🏢 NGO Dashboard**: Monitor environmental impact and manage organizations
- **📊 Analytics**: Track impact scores and organization statistics

### Technical Stack
- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes with Prisma ORM
- **Database**: PostgreSQL for proof indexing and metadata
- **Blockchain**: Hedera Hashgraph for immutable proof storage
- **Storage**: IPFS (Pinata/Infura) with local fallback
- **Deployment**: Vercel-ready with environment configuration

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Hedera testnet account (for blockchain features)

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd GreenStamp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### 3. Environment Variables
Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/greenstamp"

# Hedera Blockchain
HEDERA_ACCOUNT_ID="0.0.123456"
HEDERA_PRIVATE_KEY="302e020100300506032b657004220420..."

# IPFS Storage (Optional - choose one)
PINATA_JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
INFURA_PROJECT_ID="your_infura_project_id"
INFURA_API_KEY="your_infura_api_key"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 5. Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🏗️ System Architecture

### Database Schema
- **Proofs**: Store proof metadata, IPFS CIDs, and blockchain references
- **Users**: User profiles with impact tracking
- **NGOs**: Organization profiles with member management
- **Categories**: Proof categorization and impact scoring

### API Endpoints
- `POST /api/upload` - Submit new proof
- `GET /api/proofs` - List proofs with filtering
- `GET /api/ngos` - List NGOs
- `GET /api/ngos/[id]` - Get specific NGO details
- `POST /api/ngos` - Create new NGO

### Blockchain Integration
- **Topic Creation**: Automatic Hedera topic creation for proof storage
- **Message Submission**: Proof data stored as topic messages
- **Verification**: HashScan explorer integration for proof verification

## 📱 Pages & Features

### Main Pages
- **Home** (`/`) - Landing page with feature overview
- **Submit** (`/submit`) - Proof submission with metadata
- **Verify** (`/verify`) - Proof verification via HashScan
- **Dashboard** (`/dashboard`) - NGO dashboard with analytics

### Dashboard Features
- **Statistics Overview**: Total NGOs, proofs, members, and impact
- **Top NGOs**: Organizations with highest environmental impact
- **Recent Proofs**: Latest proof submissions
- **Quick Actions**: Direct links to key functions

## 🔧 Configuration 

### IPFS Setup
Choose one of the following IPFS providers:

#### Pinata (Recommended)
1. Sign up at [Pinata](https://pinata.cloud/)
2. Get your JWT token from the API keys section
3. Add to `.env.local`: `PINATA_JWT_TOKEN=your_token`

#### Infura
1. Create account at [Infura](https://infura.io/)
2. Create an IPFS project
3. Add to `.env.local`:
   ```
   INFURA_PROJECT_ID=your_project_id
   INFURA_API_KEY=your_api_key
   ```

### Hedera Blockchain Setup
1. Create a Hedera testnet account at [Hedera Portal](https://portal.hedera.com/)
2. Get your Account ID and Private Key
3. Add to `.env.local`:
   ```
   HEDERA_ACCOUNT_ID=0.0.123456
   HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...
   ```

## 🚀 Vercel Deployment

### Environment Variables
Set the following environment variables in your Vercel project:

1. **Database**: `DATABASE_URL` (PostgreSQL connection string)
2. **Hedera**: `HEDERA_ACCOUNT_ID` and `HEDERA_PRIVATE_KEY`
3. **IPFS**: `PINATA_JWT_TOKEN` or `INFURA_PROJECT_ID` + `INFURA_API_KEY`

### Database Setup
1. Create a PostgreSQL database (e.g., using Vercel Postgres)
2. Run migrations: `npx prisma migrate deploy`
3. Generate client: `npx prisma generate`

## 📊 Usage

### Submitting Proofs
1. Navigate to `/submit`
2. Upload image/video of environmental action
3. Add metadata (title, category, location, tags)
4. Submit to get IPFS CID and blockchain verification
5. Use provided Topic ID to verify on HashScan

### Verifying Proofs
1. Navigate to `/verify`
2. Enter Topic ID from proof submission
3. Click "Open in HashScan" to view on blockchain
4. Verify proof data and blockchain status

### NGO Dashboard
1. Navigate to `/dashboard`
2. View overall statistics and recent activity
3. Monitor organization impact and member activity
4. Access quick actions for common tasks

## 🔒 Security Features

- **Immutable Storage**: All proofs stored on Hedera blockchain
- **Decentralized Storage**: IPFS for file storage
- **Proof Verification**: Public blockchain verification
- **Data Integrity**: Cryptographic proof hashes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the [Hedera Documentation](https://docs.hedera.com/)
- Visit [HashScan Explorer](https://hashscan.io/) for blockchain verification
- Review [Prisma Documentation](https://www.prisma.io/docs/) for database queries

---

**GreenStamp** - Making environmental impact verifiable and immutable 🌱


