"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface ProofMetadata {
  cid: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  proofHash: string;
  title?: string;
  category?: string;
  location?: string;
  tags?: string[];
  createdAt?: string;
}

export default function VerifyPage() {
  const [topicId, setTopicId] = useState("");
  const [proofMetadata, setProofMetadata] = useState<ProofMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if CID and hash are provided in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const cid = urlParams.get('cid');
    const hash = urlParams.get('hash');
    
    if (cid && hash) {
      // Show IPFS metadata
      setProofMetadata({
        cid,
        originalName: 'File from IPFS',
        size: 0,
        type: 'unknown',
        url: `https://ipfs.io/ipfs/${cid}`,
        proofHash: hash,
        title: urlParams.get('title') || undefined,
        category: urlParams.get('category') || undefined,
        location: urlParams.get('location') || undefined,
        tags: urlParams.get('tags')?.split(',') || undefined,
        createdAt: urlParams.get('createdAt') || undefined,
      });
    }
  }, []);

  const openHederaExplorer = (topicId: string) => {
    const url = `https://hashscan.io/testnet/topic/${topicId}`;
    window.open(url, '_blank');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Verify Proof</h1>
              <p className="mt-1 text-sm text-gray-500">
                Verify environmental action proofs on the Hedera blockchain
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Submit Proof
              </Link>
              <Link
                href="/proofs"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                View All Proofs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* IPFS Metadata Display */}
        {proofMetadata && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 IPFS Proof Metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">IPFS CID</p>
                <p className="text-gray-900 font-mono text-sm break-all">{proofMetadata.cid}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Proof Hash</p>
                <p className="text-gray-900 font-mono text-sm break-all">{proofMetadata.proofHash}</p>
              </div>
              {proofMetadata.title && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Title</p>
                  <p className="text-gray-900">{proofMetadata.title}</p>
                </div>
              )}
              {proofMetadata.category && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-gray-900">{proofMetadata.category}</p>
                </div>
              )}
              {proofMetadata.location && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900">{proofMetadata.location}</p>
                </div>
              )}
              {proofMetadata.tags && proofMetadata.tags.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Tags</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {proofMetadata.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {proofMetadata.createdAt && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <p className="text-gray-900">{formatDate(proofMetadata.createdAt)}</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex space-x-3">
              <a
                href={proofMetadata.url}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                🔗 View on IPFS
              </a>
              <a
                href={`https://gateway.pinata.cloud/ipfs/${proofMetadata.cid}`}
                target="_blank"
                rel="noreferrer"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm"
              >
                🔗 View on Pinata
              </a>
            </div>
          </div>
        )}

        {/* Manual Topic ID Verification */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔍 Verify on Hedera Blockchain</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="topicId" className="block text-sm font-medium text-gray-700 mb-2">
                Topic ID
              </label>
              <input
                type="text"
                id="topicId"
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                placeholder="Enter Hedera Topic ID (e.g., 0.0.1234567)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-700 bg-white"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => topicId && openHederaExplorer(topicId)}
                disabled={!topicId}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                🔗 View on HashScan
              </button>
              <button
                onClick={() => setTopicId("")}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-3">📋 How to Verify Your Proof</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                <div>
                  <p className="text-sm text-blue-700">
                    <strong>Get your Topic ID:</strong> After submitting a proof, you&apos;ll receive a Topic ID from the Hedera blockchain.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                <div>
                  <p className="text-sm text-blue-700">
                    <strong>Enter the Topic ID:</strong> Paste your Topic ID in the field above and click &quot;View on HashScan&quot;.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                <div>
                  <p className="text-sm text-blue-700">
                    <strong>Verify the data:</strong> On HashScan, check that the message contains your proof hash and IPFS CID.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">🔗 Useful Blockchain Links</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <a
                href="https://hashscan.io/testnet"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                • Hedera HashScan Testnet
              </a>
              <a
                href="https://portal.hedera.com/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                • Hedera Portal
              </a>
              <a
                href="https://docs.hedera.com/hedera/docs/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                • Hedera Documentation
              </a>
              <a
                href="/proofs"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                • View All Proofs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 