"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface UploadResult {
  success: boolean
  cid: string
  originalName: string
  size: number
  type: string
  url: string
  proofHash: string
  topicId?: string
  sequenceNumber?: number
  blockchainStatus: 'success' | 'failed' | 'not_configured'
  proofId?: string
}

export default function SubmitProof() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories/list');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload a file");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("category", category === "custom" ? customCategory : category);
      formData.append("location", location);
      formData.append("tags", tags);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUploadResult(data);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
    setUploading(false);
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

  const openHederaExplorer = (topicId: string) => {
    const url = `https://hashscan.io/testnet/topic/${topicId}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-green-700">Submit Proof</h1>
              <p className="mt-1 text-sm text-gray-500">
                Upload your environmental action proof to IPFS and Hedera
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Dashboard
              </Link>
              <Link
                href="/proofs"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                View All Proofs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title/Description
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of your environmental action"
              className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loadingCategories}
            >
              <option value="">Select a category</option>
              {loadingCategories ? (
                <option value="" disabled>Loading categories...</option>
              ) : (
                <>
                  <option value="tree_planting">🌳 Tree Planting</option>
                  <option value="beach_cleanup">🏖️ Beach Cleanup</option>
                  <option value="recycling">♻️ Recycling</option>
                  <option value="energy_conservation">⚡ Energy Conservation</option>
                  <option value="water_conservation">💧 Water Conservation</option>
                  <option value="wildlife_protection">🦁 Wildlife Protection</option>
                  <option value="community_garden">🌱 Community Garden</option>
                  <option value="plastic_reduction">🚫 Plastic Reduction</option>
                  <option value="sustainable_transport">🚲 Sustainable Transport</option>
                  <option value="education">📚 Environmental Education</option>
                  {categories.length > 0 && (
                    <optgroup label="Existing Categories">
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </optgroup>
                  )}
                  <option value="custom">➕ Custom Category</option>
                </>
              )}
            </select>
            
            {category === "custom" && (
              <div className="mt-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category name"
                  className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country or GPS coordinates"
              className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="environment, community, sustainability"
              className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={uploading}
          >
            {uploading ? "Uploading to IPFS & Hedera..." : "Upload Proof"}
          </button>
        </form>

        {uploadResult && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-lg max-w-2xl w-full">
            <h3 className="text-green-800 font-semibold mb-4 text-xl">✅ Proof Successfully Stored!</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* File Information */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">File Information</h4>
                <div className="text-sm space-y-1 text-gray-700">
                  <p><strong>Name:</strong> {uploadResult.originalName}</p>
                  <p><strong>Size:</strong> {(uploadResult.size / 1024).toFixed(1)} KB</p>
                  <p><strong>Type:</strong> {uploadResult.type}</p>
                  <p><strong>IPFS CID:</strong> <code className="bg-gray-200 px-1 rounded text-xs break-all text-gray-800">{uploadResult.cid}</code></p>
                  {uploadResult.proofId && (
                    <p><strong>Database ID:</strong> <code className="bg-gray-200 px-1 rounded text-xs text-gray-800">{uploadResult.proofId}</code></p>
                  )}
                  <a
                    href={uploadResult.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline hover:text-blue-800 text-sm"
                  >
                    View File
                  </a>
                </div>
              </div>

              {/* Blockchain Information */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">Blockchain Information</h4>
                <div className="text-sm space-y-1 text-gray-700">
                  <p><strong>Proof Hash:</strong> <code className="bg-gray-200 px-1 rounded text-xs break-all text-gray-800">{uploadResult.proofHash}</code></p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-1 px-2 py-1 rounded text-xs ${getBlockchainStatusColor(uploadResult.blockchainStatus)}`}>
                      {getBlockchainStatusText(uploadResult.blockchainStatus)}
                    </span>
                  </p>
                  {uploadResult.topicId && (
                    <p><strong>Topic ID:</strong> <code className="bg-gray-200 px-1 rounded text-xs break-all text-gray-800">{uploadResult.topicId}</code></p>
                  )}
                  {uploadResult.sequenceNumber && (
                    <p><strong>Sequence:</strong> <code className="bg-gray-200 px-1 rounded text-xs text-gray-800">{uploadResult.sequenceNumber}</code></p>
                  )}
                </div>
              </div>
            </div>

            {/* Blockchain Status Message */}
            {uploadResult.blockchainStatus === 'not_configured' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Hedera blockchain integration is not configured. Your proof has been stored on IPFS only.
                </p>
              </div>
            )}

            {/* Verification Section */}
            {uploadResult.blockchainStatus === 'success' && uploadResult.topicId && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">🔍 How to Verify Your Proof</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                    <div><p className="text-sm text-blue-700"><strong>Copy your Topic ID:</strong> <code className="bg-blue-100 px-1 rounded text-xs text-blue-800">{uploadResult.topicId}</code></p></div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                    <div><p className="text-sm text-blue-700"><strong>Visit Hedera HashScan Explorer:</strong> Click the button below to view your proof on the blockchain</p></div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                    <div><p className="text-sm text-blue-700"><strong>Verify the data:</strong> Check that the message contains your proof hash and IPFS CID</p></div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button onClick={() => openHederaExplorer(uploadResult.topicId!)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium">🔗 View on HashScan Explorer</button>
                  <a href="/verify" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm font-medium text-center">📋 Go to Verify Page</a>
                </div>
                <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
                  <strong>Direct Link:</strong> <a href={`https://hashscan.io/testnet/topic/${uploadResult.topicId}`} target="_blank" rel="noreferrer" className="underline hover:text-blue-900">https://hashscan.io/testnet/topic/{uploadResult.topicId}</a>
                </div>
              </div>
            )}

            {/* Useful Links */}
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
              <h4 className="font-semibold text-gray-800 mb-2">🔗 Useful Blockchain Links</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <a href="https://hashscan.io/testnet" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 underline">• Hedera HashScan Testnet</a>
                <a href="https://portal.hedera.com/" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 underline">• Hedera Portal</a>
                <a href="https://docs.hedera.com/hedera/docs/" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 underline">• Hedera Documentation</a>
                <a href="/verify" className="text-blue-600 hover:text-blue-800 underline">• GreenStamp Verify Page</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
