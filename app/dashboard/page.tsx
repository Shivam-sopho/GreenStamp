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
  _count: {
    members: number;
    proofs: number;
  };
}

interface Proof {
  id: string;
  title: string | null;
  category: string | null;
  originalName: string;
  url: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  } | null;
}

export default function Dashboard() {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [recentProofs, setRecentProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalNGOs: 0,
    totalProofs: 0,
    totalMembers: 0,
    totalImpact: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch NGOs
      const ngoResponse = await fetch('/api/ngos?limit=5');
      const ngoData = await ngoResponse.json();
      setNgos(ngoData.ngos || []);

      // Fetch recent proofs (you'll need to create this API endpoint)
      const proofsResponse = await fetch('/api/proofs?limit=10');
      const proofsData = await proofsResponse.json();
      setRecentProofs(proofsData.proofs || []);

      // Calculate stats
      const totalNGOs = ngoData.ngos?.length || 0;
      const totalProofs = ngoData.ngos?.reduce((sum: number, ngo: NGO) => sum + ngo.totalProofs, 0) || 0;
      const totalMembers = ngoData.ngos?.reduce((sum: number, ngo: NGO) => sum + ngo.totalMembers, 0) || 0;
      const totalImpact = ngoData.ngos?.reduce((sum: number, ngo: NGO) => sum + ngo.totalImpact, 0) || 0;

      setStats({
        totalNGOs,
        totalProofs,
        totalMembers,
        totalImpact,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
              <h1 className="text-3xl font-bold text-green-700">NGO Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Monitor environmental impact and manage NGO activities
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                🏠 Home
              </Link>
              <Link href="/submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                📤 Submit Proof
              </Link>
              <Link href="/verify" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                🔍 Verify Proof
              </Link>
              <Link href="/proofs" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                📋 View All Proofs
              </Link>
              <Link href="/ngos" className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">
                🏢 Manage NGOs
              </Link>
              <Link href="/sponsor" className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700">
                🏆 Sponsor Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 text-lg">🌱</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total NGOs</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalNGOs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📋</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Proofs</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProofs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <span className="text-purple-600 text-lg">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Members</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalMembers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">🌟</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Impact</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalImpact}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top NGOs */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Top NGOs</h2>
              <p className="text-sm text-gray-500">Organizations with the most environmental impact</p>
            </div>
            <div className="p-6">
              {ngos.length > 0 ? (
                <div className="space-y-4">
                  {ngos.map((ngo) => (
                    <div key={ngo.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {ngo.logo ? (
                            <img className="h-10 w-10 rounded-full" src={ngo.logo} alt={ngo.name} />
                          ) : (
                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-semibold">{ngo.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{ngo.name}</p>
                          <p className="text-sm text-gray-500">{ngo.totalProofs} proofs</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{ngo.totalImpact}</p>
                        <p className="text-xs text-gray-500">impact score</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No NGOs found</p>
              )}
              <div className="mt-4">
                <Link
                  href="/ngos"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View all NGOs →
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Proofs */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Proofs</h2>
              <p className="text-sm text-gray-500">Latest environmental action proofs</p>
            </div>
            <div className="p-6">
              {recentProofs.length > 0 ? (
                <div className="space-y-4">
                  {recentProofs.map((proof) => (
                    <div key={proof.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 text-sm">📸</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {proof.title || proof.originalName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {proof.user?.name || proof.user?.email || 'Anonymous'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{formatDate(proof.createdAt)}</p>
                        {proof.category && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {proof.category}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent proofs</p>
              )}
              <div className="mt-4">
                <Link
                  href="/proofs"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View all proofs →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/submit"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <span className="text-green-600">📤</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Submit Proof</p>
                  <p className="text-sm text-gray-500">Upload environmental action proof</p>
                </div>
              </Link>

              <Link
                href="/ngos/create"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <span className="text-blue-600">🏢</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Create NGO</p>
                  <p className="text-sm text-gray-500">Register a new organization</p>
                </div>
              </Link>

              <Link
                href="/verify"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <span className="text-purple-600">🔍</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Verify Proof</p>
                  <p className="text-sm text-gray-500">Check proof authenticity</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 