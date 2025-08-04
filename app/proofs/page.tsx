"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Proof {
  id: string;
  title: string | null;
  category: string | null;
  location: string | null;
  tags: string[];
  originalName: string;
  url: string;
  createdAt: string;
  cid: string;
  proofHash: string;
  blockchainStatus: string;
  topicId: string | null;
  sequenceNumber: number | null;
  user: {
    name: string | null;
    email: string;
  } | null;
  ngo: {
    name: string | null;
    logo: string | null;
  } | null;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  totalProofs: number;
}

export default function ProofsPage() {
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false,
  });

  useEffect(() => {
    fetchProofs();
    fetchCategories();
  }, [selectedCategory, pagination.offset]);

  const fetchProofs = async () => {
    try {
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
      });
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/proofs?${params}`);
      const data = await response.json();

      if (response.ok) {
        setProofs(data.proofs || []);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          hasMore: data.pagination.hasMore,
        }));
      }
    } catch (error) {
      console.error('Error fetching proofs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
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

  const loadMore = () => {
    setPagination(prev => ({
      ...prev,
      offset: prev.offset + prev.limit,
    }));
  };

  const resetPagination = () => {
    setPagination(prev => ({
      ...prev,
      offset: 0,
    }));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    resetPagination();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading proofs...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">All Proofs</h1>
              <p className="mt-1 text-sm text-gray-500">
                Browse all environmental action proofs
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
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange("")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedCategory === ""
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.name)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedCategory === category.name
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Proofs Grid */}
        {proofs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proofs.map((proof) => (
              <div key={proof.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Proof Image/Preview */}
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  {proof.url.startsWith('http') ? (
                    <img
                      src={proof.url}
                      alt={proof.title || proof.originalName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="hidden w-full h-full items-center justify-center text-gray-500">
                    <span className="text-4xl">📸</span>
                  </div>
                </div>

                {/* Proof Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {proof.title || proof.originalName}
                    </h3>
                    {proof.category && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {proof.category}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>
                      <strong>Submitted by:</strong> {proof.user?.name || proof.user?.email || 'Anonymous'}
                    </p>
                    {proof.ngo && (
                      <p>
                        <strong>Organization:</strong> {proof.ngo.name}
                      </p>
                    )}
                    <p>
                      <strong>Date:</strong> {formatDate(proof.createdAt)}
                    </p>
                  </div>

                  {/* Blockchain Status */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getBlockchainStatusColor(proof.blockchainStatus)}`}>
                      {getBlockchainStatusText(proof.blockchainStatus)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <a
                      href={proof.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-blue-600 text-white text-center px-3 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      View File
                    </a>
                    {proof.blockchainStatus === 'success' && proof.topicId ? (
                      <a
                        href={`https://hashscan.io/testnet/topic/${proof.topicId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-green-600 text-white text-center px-3 py-2 rounded text-sm hover:bg-green-700"
                      >
                        Verify on Hedera
                      </a>
                    ) : (
                      <Link
                        href={`/verify?cid=${proof.cid}&hash=${proof.proofHash}&title=${encodeURIComponent(proof.title || '')}&category=${encodeURIComponent(proof.category || '')}&location=${encodeURIComponent(proof.location || '')}&tags=${encodeURIComponent(proof.tags?.join(',') || '')}&createdAt=${encodeURIComponent(proof.createdAt || '')}`}
                        className="flex-1 bg-green-600 text-white text-center px-3 py-2 rounded text-sm hover:bg-green-700"
                      >
                        Verify
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No proofs found</h3>
            <p className="text-gray-600 mb-6">
              {selectedCategory 
                ? `No proofs found for category "${selectedCategory}"`
                : "No proofs have been submitted yet."
              }
            </p>
            <Link
              href="/submit"
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
            >
              Submit Your First Proof
            </Link>
          </div>
        )}

        {/* Load More */}
        {pagination.hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700"
            >
              Load More Proofs
            </button>
          </div>
        )}

        {/* Pagination Info */}
        {proofs.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} proofs
          </div>
        )}
      </div>
    </div>
  );
} 