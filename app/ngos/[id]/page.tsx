"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface NGO {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  totalProofs: number;
  totalMembers: number;
  totalImpact: number;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Proof {
  id: string;
  title: string | null;
  category: string | null;
  originalName: string;
  url: string;
  createdAt: string;
  cid: string;
  proofHash: string;
  blockchainStatus: string;
  topicId: string | null;
  sequenceNumber: number | null;
}

export default function NGODetailsPage() {
  const params = useParams();
  const ngoId = params.id as string;
  
  const [ngo, setNgo] = useState<NGO | null>(null);
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ngoId) {
      fetchNGODetails();
      fetchNGOProofs();
    }
  }, [ngoId]);

  const fetchNGODetails = async () => {
    try {
      const response = await fetch(`/api/ngos/${ngoId}`);
      const data = await response.json();
      
      if (response.ok) {
        setNgo(data.ngo);
      } else {
        setError(data.error || 'Failed to fetch NGO details');
      }
    } catch (error) {
      console.error('Error fetching NGO details:', error);
      setError('Failed to fetch NGO details');
    }
  };

  const fetchNGOProofs = async () => {
    try {
      const response = await fetch(`/api/proofs?ngoId=${ngoId}&limit=10`);
      const data = await response.json();
      
      if (response.ok) {
        setProofs(data.proofs || []);
      }
    } catch (error) {
      console.error('Error fetching NGO proofs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getBlockchainStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'not_configured':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getBlockchainStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return '✅ Stored on Hedera';
      case 'failed':
        return '❌ Blockchain Error';
      case 'not_configured':
        return '⚠️ Hedera not configured';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading NGO details...</p>
        </div>
      </div>
    );
  }

  if (error || !ngo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading NGO</h3>
          <p className="text-gray-600 mb-6">{error || 'NGO not found'}</p>
          <Link
            href="/ngos"
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
          >
            Back to NGOs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-green-700">{ngo.name}</h1>
              <p className="mt-1 text-sm text-gray-500">
                NGO Details and Environmental Impact
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                🏠 Home
              </Link>
              <Link href="/dashboard" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                📊 NGO Dashboard
              </Link>
              <Link href="/ngos" className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">
                🏢 All NGOs
              </Link>
              <Link href="/submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                📤 Submit Proof
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* NGO Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* NGO Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {ngo.logo ? (
                      <img className="h-20 w-20 rounded-full" src={ngo.logo} alt={ngo.name} />
                    ) : (
                      <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-2xl">{ngo.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold text-gray-900">{ngo.name}</h2>
                    {ngo.isVerified && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-2">
                        ✅ Verified Organization
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* NGO Details */}
              <div className="p-6">
                {ngo.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Mission & Description</h3>
                    <p className="text-gray-700 leading-relaxed">{ngo.description}</p>
                  </div>
                )}

                {/* Contact Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ngo.email && (
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">📧</span>
                        <span className="text-gray-700">{ngo.email}</span>
                      </div>
                    )}
                    {ngo.phone && (
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">📞</span>
                        <span className="text-gray-700">{ngo.phone}</span>
                      </div>
                    )}
                    {ngo.website && (
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">🌐</span>
                        <a
                          href={ngo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                    {ngo.address && (
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-2 mt-1">📍</span>
                        <span className="text-gray-700">{ngo.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Organization Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Organization Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-2 text-gray-700">{formatDate(ngo.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="ml-2 text-gray-700">{formatDate(ngo.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Link
                    href={`/ngos/${ngo.id}/edit`}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    ✏️ Edit NGO
                  </Link>
                  <Link
                    href="/ngos"
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    ← Back to NGOs
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Quick Info */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Proofs</span>
                  <span className="text-2xl font-bold text-blue-600">{ngo.totalProofs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Members</span>
                  <span className="text-2xl font-bold text-purple-600">{ngo.totalMembers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Impact Score</span>
                  <span className="text-2xl font-bold text-green-600">{ngo.totalImpact}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              {proofs.length > 0 ? (
                <div className="space-y-3">
                  {proofs.slice(0, 3).map((proof) => (
                    <div key={proof.id} className="border-l-4 border-green-500 pl-3">
                      <p className="text-sm font-medium text-gray-900">
                        {proof.title || proof.originalName}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(proof.createdAt)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Proofs */}
        {proofs.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Environmental Proofs</h2>
                <p className="text-sm text-gray-500">Latest environmental actions by this organization</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {proofs.map((proof) => (
                    <div key={proof.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="aspect-video bg-gray-200 rounded mb-3 flex items-center justify-center">
                        {proof.url.startsWith('http') ? (
                          <img
                            src={proof.url}
                            alt={proof.title || proof.originalName}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <span className="text-4xl">📸</span>
                        )}
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        {proof.title || proof.originalName}
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        {proof.category && (
                          <p><strong>Category:</strong> {proof.category}</p>
                        )}
                        <p><strong>Date:</strong> {formatDate(proof.createdAt)}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getBlockchainStatusColor(proof.blockchainStatus)}`}>
                          {getBlockchainStatusText(proof.blockchainStatus)}
                        </span>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <a
                          href={proof.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-600 text-white text-center px-3 py-2 rounded text-sm hover:bg-blue-700"
                        >
                          View File
                        </a>
                        {proof.blockchainStatus === 'success' && proof.topicId ? (
                          <a
                            href={`https://hashscan.io/testnet/topic/${proof.topicId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-green-600 text-white text-center px-3 py-2 rounded text-sm hover:bg-green-700"
                          >
                            Verify on Hedera
                          </a>
                        ) : (
                          <Link
                            href={`/verify?cid=${proof.cid}&hash=${proof.proofHash}`}
                            className="flex-1 bg-green-600 text-white text-center px-3 py-2 rounded text-sm hover:bg-green-700"
                          >
                            Verify
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link
                    href={`/proofs?ngoId=${ngo.id}`}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    View All Proofs by {ngo.name} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 