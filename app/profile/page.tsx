"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  totalProofs: number;
  totalImpact: number;
  createdAt: string;
  badges: Badge[];
  recentProofs: Proof[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  awardedAt: string;
  awardedBy: string;
}

interface Proof {
  id: string;
  title: string | null;
  category: string | null;
  createdAt: string;
  cid: string;
  blockchainStatus: string;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [availableUsers, setAvailableUsers] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  const fetchAvailableUsers = async () => {
    try {
      const response = await fetch('/api/eco-actors');
      const data = await response.json();
      if (response.ok && data.ecoActors) {
        setAvailableUsers(data.ecoActors.map((user: any) => ({
          id: user.id,
          name: user.name
        })));
        // Set the first user as default
        if (data.ecoActors.length > 0) {
          setUserId(data.ecoActors[0].id);
          fetchUserProfile(data.ecoActors[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const fetchUserProfile = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${id}/profile`);
      const data = await response.json();
      if (response.ok) {
        setProfile(data.profile);
      } else {
        console.error('Error fetching profile:', data.error);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (newUserId: string) => {
    setUserId(newUserId);
    fetchUserProfile(newUserId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getImpactLevel = (impact: number) => {
    if (impact >= 100) return { level: "Master", color: "text-purple-600", bg: "bg-purple-100" };
    if (impact >= 50) return { level: "Expert", color: "text-blue-600", bg: "bg-blue-100" };
    if (impact >= 20) return { level: "Advanced", color: "text-green-600", bg: "bg-green-100" };
    if (impact >= 10) return { level: "Intermediate", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { level: "Beginner", color: "text-gray-600", bg: "bg-gray-100" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">The user profile could not be loaded.</p>
          <Link href="/" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const impactLevel = getImpactLevel(profile.totalImpact);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-green-700">Eco-Actor Profile</h1>
              <p className="mt-1 text-sm text-gray-500">
                Your environmental impact and achievements
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* User Selector */}
              {availableUsers.length > 0 && (
                <select
                  value={userId || ''}
                  onChange={(e) => handleUserChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {availableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              )}
              <Link href="/" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                Home
              </Link>
              <Link href="/submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Submit Proof
              </Link>
              <Link href="/proofs" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                View All Proofs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                {profile.avatar ? (
                  <img className="h-24 w-24 rounded-full" src={profile.avatar} alt={profile.name} />
                ) : (
                  <span className="text-4xl font-bold text-green-600">
                    {profile.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
              {profile.bio && (
                <p className="text-gray-700 mt-2">{profile.bio}</p>
              )}
              <div className="mt-4 flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${impactLevel.bg} ${impactLevel.color}`}>
                  {impactLevel.level} Eco-Actor
                </span>
                <span className="text-sm text-gray-500">
                  Member since {formatDate(profile.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Proofs</p>
                <p className="text-2xl font-bold text-gray-900">{profile.totalProofs}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Impact Score</p>
                <p className="text-2xl font-bold text-gray-900">{profile.totalImpact}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Badges Earned</p>
                <p className="text-2xl font-bold text-gray-900">{profile.badges.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Level</p>
                <p className="text-2xl font-bold text-gray-900">{impactLevel.level}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Badges Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">🏆 Your Badges</h3>
              <p className="text-sm text-gray-600">Recognition for your environmental contributions</p>
            </div>
            <div className="p-6">
              {profile.badges.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🏆</div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Badges Yet</h4>
                  <p className="text-gray-600 mb-4">Start submitting proofs to earn your first badge!</p>
                  <Link href="/submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Submit Your First Proof
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.badges.map((badge) => (
                    <div key={badge.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">{badge.icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{badge.name}</h4>
                          <p className="text-sm text-gray-500">Awarded {formatDate(badge.awardedAt)}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{badge.description}</p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color} text-white`}>
                          {badge.icon} {badge.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Proofs Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">📤 Recent Proofs</h3>
              <p className="text-sm text-gray-600">Your latest environmental actions</p>
            </div>
            <div className="p-6">
              {profile.recentProofs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📤</div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Proofs Yet</h4>
                  <p className="text-gray-600 mb-4">Start your environmental journey today!</p>
                  <Link href="/submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Submit Your First Proof
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.recentProofs.map((proof) => (
                    <div key={proof.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {proof.title || 'Untitled Proof'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {proof.category && `Category: ${proof.category}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(proof.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            proof.blockchainStatus === 'success' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {proof.blockchainStatus === 'success' ? '✅ Verified' : '⏳ Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Continue Your Environmental Journey</h3>
          <p className="text-green-100 mb-6">
            Every action counts! Submit more proofs to increase your impact and earn more badges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit" className="bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-gray-100 font-semibold">
              Submit New Proof
            </Link>
            <Link href="/proofs" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-green-600 font-semibold">
              View All Proofs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 