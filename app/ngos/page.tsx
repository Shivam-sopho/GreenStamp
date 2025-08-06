"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

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

export default function NGOsPage() {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalNGOs: 0,
    totalProofs: 0,
    totalMembers: 0,
    totalImpact: 0,
  });

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      const response = await fetch('/api/ngos');
      const data = await response.json();
      
      if (response.ok) {
        setNgos(data.ngos || []);
        
        // Calculate stats
        const totalNGOs = data.ngos?.length || 0;
        const totalProofs = data.ngos?.reduce((sum: number, ngo: NGO) => sum + (ngo.totalProofs || 0), 0) || 0;
        const totalMembers = data.ngos?.reduce((sum: number, ngo: NGO) => sum + (ngo.totalMembers || 0), 0) || 0;
        const totalImpact = data.ngos?.reduce((sum: number, ngo: NGO) => sum + (ngo.totalImpact || 0), 0) || 0;

        setStats({
          totalNGOs,
          totalProofs,
          totalMembers,
          totalImpact,
        });
      }
    } catch (error) {
      console.error('Error fetching NGOs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading NGOs...</p>
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
              <h1 className="text-3xl font-bold text-green-700">All NGOs</h1>
              <p className="mt-1 text-sm text-gray-500">
                Browse and manage environmental organizations
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                🏠 Home
              </Link>
              <Link href="/submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                📤 Submit Proof
              </Link>
              <Link href="/dashboard" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                📊 NGO Dashboard
              </Link>
              <Link href="/verify" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                🔍 Verify Proof
              </Link>
              <Link href="/proofs" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                📋 View All Proofs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🏢</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total NGOs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalNGOs}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Proofs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProofs}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🌟</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Impact</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalImpact}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create NGO Button */}
        <div className="mb-8">
          <Link
            href="/ngos/create"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            🏢 Create New NGO
          </Link>
        </div>

        {/* NGOs List */}
        {ngos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ngos.map((ngo) => (
              <div key={ngo.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* NGO Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {ngo.logo ? (
                        <img className="h-12 w-12 rounded-full" src={ngo.logo} alt={ngo.name} />
                      ) : (
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold text-lg">{ngo.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{ngo.name}</h3>
                      {ngo.isVerified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✅ Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* NGO Details */}
                <div className="p-6">
                  {ngo.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{ngo.description}</p>
                  )}

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Proofs:</span>
                      <span className="text-sm font-medium text-gray-900">{ngo.totalProofs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Members:</span>
                      <span className="text-sm font-medium text-gray-900">{ngo.totalMembers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Impact Score:</span>
                      <span className="text-sm font-medium text-gray-900">{ngo.totalImpact}</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  {(ngo.email || ngo.website || ngo.phone) && (
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        {ngo.email && <p>📧 {ngo.email}</p>}
                        {ngo.phone && <p>📞 {ngo.phone}</p>}
                        {ngo.website && (
                          <a
                            href={ngo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            🌐 Website
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/ngos/${ngo.id}`}
                      className="flex-1 bg-blue-600 text-white text-center px-3 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/ngos/${ngo.id}/edit`}
                      className="flex-1 bg-green-600 text-white text-center px-3 py-2 rounded text-sm hover:bg-green-700"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No NGOs found</h3>
            <p className="text-gray-600 mb-6">
              No environmental organizations have been registered yet.
            </p>
            <Link
              href="/ngos/create"
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
            >
              Create Your First NGO
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 