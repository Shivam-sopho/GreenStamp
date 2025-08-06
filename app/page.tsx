import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-green-700 mb-6">
          🌱 GreenStamp
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          AI-verified, blockchain-backed eco-action proofs. 
          Submit your environmental actions and get them immutably stored on the Hedera blockchain.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-3xl mb-3">📤</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Submit Proof</h3>
            <p className="text-gray-600 text-sm">Upload your environmental action and get it verified on the blockchain</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Verify Proof</h3>
            <p className="text-gray-600 text-sm">Check the authenticity of any proof on the Hedera blockchain</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-3xl mb-3">🏢</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">NGO Dashboard</h3>
            <p className="text-gray-600 text-sm">Monitor environmental impact and manage organization activities</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sponsor Dashboard</h3>
            <p className="text-gray-600 text-sm">Award green badges to eco-actors and recognize their contributions</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/submit"
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Submit Your First Proof
          </Link>
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            View Dashboard
          </Link>
          <Link
            href="/sponsor"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Sponsor Dashboard
          </Link>
          <Link
            href="/profile"
            className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
          >
            View Profile
          </Link>
          <Link
            href="/verify"
            className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            Verify Proof
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How It Works</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>1. Upload your environmental action</p>
              <p>2. Get verified on Hedera blockchain</p>
              <p>3. Track your impact score</p>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Features</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• IPFS decentralized storage</p>
              <p>• Hedera blockchain verification</p>
              <p>• NGO dashboard & analytics</p>
              <p>• Green badge recognition system</p>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Technology</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Next.js 15 with TypeScript</p>
              <p>• PostgreSQL with Prisma ORM</p>
              <p>• Hedera Hashgraph integration</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
