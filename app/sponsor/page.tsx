"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface EcoActor {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  totalProofs: number;
  totalImpact: number;
  badges: Badge[];
  lastActivity: string;
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

interface BadgeTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: string;
}

export default function SponsorDashboard() {
  const [ecoActors, setEcoActors] = useState<EcoActor[]>([]);
  const [availableBadges, setAvailableBadges] = useState<BadgeTemplate[]>([]);
  const [selectedActor, setSelectedActor] = useState<EcoActor | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeTemplate | null>(null);

  useEffect(() => {
    fetchEcoActors();
    fetchAvailableBadges();
  }, []);

  const fetchEcoActors = async () => {
    try {
      const response = await fetch('/api/eco-actors');
      const data = await response.json();
      if (response.ok) {
        setEcoActors(data.ecoActors || []);
      }
    } catch (error) {
      console.error('Error fetching eco-actors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableBadges = async () => {
    try {
      const response = await fetch('/api/badges/list');
      const data = await response.json();
      if (response.ok) {
        setAvailableBadges(data.badges || []);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
      // Fallback to default badges if API fails
      setAvailableBadges([
        {
          id: "tree_planter",
          name: "Tree Planter",
          description: "Awarded for planting trees and contributing to reforestation",
          icon: "🌳",
          color: "bg-green-500",
          criteria: "5+ tree planting proofs"
        },
        {
          id: "beach_cleaner",
          name: "Beach Cleaner",
          description: "Awarded for cleaning beaches and protecting marine life",
          icon: "🏖️",
          color: "bg-blue-500",
          criteria: "3+ beach cleanup proofs"
        },
        {
          id: "recycling_champion",
          name: "Recycling Champion",
          description: "Awarded for promoting recycling and waste reduction",
          icon: "♻️",
          color: "bg-purple-500",
          criteria: "10+ recycling proofs"
        }
      ]);
    }
  };

  const awardBadge = async (actorId: string, badgeId: string) => {
    try {
      console.log('🎯 Awarding badge:', { actorId, badgeId });
      console.log('📋 Available badges:', availableBadges);
      console.log('👥 Selected actor:', selectedActor);
      
      const response = await fetch('/api/badges/award', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: actorId,
          badgeId: badgeId,
        }),
      });

      const result = await response.json();
      console.log('📤 Award response:', result);

      if (response.ok) {
        // Refresh eco-actors list
        fetchEcoActors();
        setShowBadgeModal(false);
        setSelectedBadge(null);
        setSelectedActor(null);
        alert('Badge awarded successfully!');
      } else {
        console.error('❌ Award failed:', result);
        alert(result.error || 'Failed to award badge');
      }
    } catch (error) {
      console.error('💥 Error awarding badge:', error);
      alert('Failed to award badge');
    }
  };

  const openBadgeModal = (actor: EcoActor, badge: BadgeTemplate) => {
    setSelectedActor(actor);
    setSelectedBadge(badge);
    setShowBadgeModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sponsor dashboard...</p>
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
              <h1 className="text-3xl font-bold text-green-700">Sponsor Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Recognize and reward eco-actors for their environmental contributions
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                Home
              </Link>
              <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                NGO Dashboard
              </Link>
              <Link href="/proofs" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                View Proofs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Eco-Actors</p>
                <p className="text-2xl font-bold text-gray-900">{ecoActors.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Proofs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ecoActors.reduce((sum, actor) => sum + actor.totalProofs, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Badges</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ecoActors.reduce((sum, actor) => sum + actor.badges.length, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Impact</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ecoActors.reduce((sum, actor) => sum + actor.totalImpact, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Eco-Actors List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Eco-Actors</h2>
            <p className="text-sm text-gray-600">Click on an eco-actor to view their profile and award badges</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eco-Actor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proofs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Impact Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Badges
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ecoActors.map((actor) => (
                  <tr key={actor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            {actor.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={actor.avatar} alt={actor.name} />
                            ) : (
                              <span className="text-lg font-medium text-green-600">
                                {actor.name?.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{actor.name}</div>
                          <div className="text-sm text-gray-500">{actor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {actor.totalProofs}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {actor.totalImpact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {actor.badges.slice(0, 3).map((badge) => (
                          <span
                            key={badge.id}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color} text-white`}
                            title={badge.description}
                          >
                            {badge.icon} {badge.name}
                          </span>
                        ))}
                        {actor.badges.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{actor.badges.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(actor.lastActivity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedActor(actor)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          setSelectedActor(actor);
                          setShowBadgeModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Award Badge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Badge Templates */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Available Badges</h2>
            <p className="text-sm text-gray-600">Click on a badge to award it to an eco-actor</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedBadge(badge);
                    setShowBadgeModal(true);
                  }}
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{badge.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{badge.name}</h3>
                      <p className="text-sm text-gray-600">{badge.criteria}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Badge Award Modal */}
      {showBadgeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              {selectedBadge ? (
                // Show specific badge award
                <>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <span className="text-2xl">{selectedBadge.icon}</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Award {selectedBadge.name} Badge
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {selectedBadge.description}
                  </p>
                  
                  {selectedActor ? (
                    <div className="mb-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700">
                        <strong>To:</strong> {selectedActor.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Current proofs: {selectedActor.totalProofs}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Eco-Actor
                      </label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) => {
                          const actor = ecoActors.find(a => a.id === e.target.value);
                          setSelectedActor(actor || null);
                        }}
                      >
                        <option value="">Choose an eco-actor...</option>
                        {ecoActors.map((actor) => (
                          <option key={actor.id} value={actor.id}>
                            {actor.name} ({actor.totalProofs} proofs)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowBadgeModal(false);
                        setSelectedBadge(null);
                        setSelectedActor(null);
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (selectedActor) {
                          awardBadge(selectedActor.id, selectedBadge.id);
                        }
                      }}
                      disabled={!selectedActor}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Award Badge
                    </button>
                  </div>
                </>
              ) : (
                // Show badge selector
                <>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select Badge to Award
                  </h3>
                  
                  {selectedActor && (
                    <div className="mb-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700">
                        <strong>To:</strong> {selectedActor.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Current proofs: {selectedActor.totalProofs}
                      </p>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose Badge
                    </label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded"
                      onChange={(e) => {
                        const badge = availableBadges.find(b => b.id === e.target.value);
                        setSelectedBadge(badge || null);
                      }}
                    >
                      <option value="">Select a badge...</option>
                      {availableBadges.map((badge) => (
                        <option key={badge.id} value={badge.id}>
                          {badge.icon} {badge.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowBadgeModal(false);
                        setSelectedBadge(null);
                        setSelectedActor(null);
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (selectedActor && selectedBadge) {
                          awardBadge(selectedActor.id, selectedBadge.id);
                        }
                      }}
                      disabled={!selectedActor || !selectedBadge}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Award Badge
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 