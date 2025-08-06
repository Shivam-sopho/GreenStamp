"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface NGOFormData {
  name: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
}

export default function EditNGOPage() {
  const router = useRouter();
  const params = useParams();
  const ngoId = params.id as string;
  
  const [formData, setFormData] = useState<NGOFormData>({
    name: "",
    description: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    logo: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ngoId) {
      fetchNGODetails();
    }
  }, [ngoId]);

  const fetchNGODetails = async () => {
    try {
      const response = await fetch(`/api/ngos/${ngoId}`);
      const data = await response.json();
      
      if (response.ok) {
        const ngo = data.ngo;
        setFormData({
          name: ngo.name || "",
          description: ngo.description || "",
          website: ngo.website || "",
          email: ngo.email || "",
          phone: ngo.phone || "",
          address: ngo.address || "",
          logo: ngo.logo || "",
        });
      } else {
        setError(data.error || 'Failed to fetch NGO details');
      }
    } catch (error) {
      console.error('Error fetching NGO details:', error);
      setError('Failed to fetch NGO details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/ngos/${ngoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to the NGO details page
        router.push(`/ngos/${ngoId}`);
      } else {
        setError(data.error || 'Failed to update NGO');
      }
    } catch (err) {
      console.error('Error updating NGO:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
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

  if (error && !formData.name) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading NGO</h3>
          <p className="text-gray-600 mb-6">{error}</p>
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
              <h1 className="text-3xl font-bold text-green-700">Edit NGO</h1>
              <p className="mt-1 text-sm text-gray-500">
                Update organization information
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
              <Link href={`/ngos/${ngoId}`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                👁️ View NGO
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NGO Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your organization's name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-700 bg-white"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Describe your organization's mission and environmental focus"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-700 bg-white"
              />
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://your-organization.org"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-700 bg-white"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="contact@your-organization.org"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-700 bg-white"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-700 bg-white"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter your organization's address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-700 bg-white"
              />
            </div>

            {/* Logo URL */}
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-700 bg-white"
              />
              <p className="mt-1 text-sm text-gray-500">
                Optional: Provide a URL to your organization's logo
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Link
                href={`/ngos/${ngoId}`}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Tips for Updating Your NGO Profile</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• <strong>Keep it current:</strong> Update information as your organization evolves</p>
            <p>• <strong>Be accurate:</strong> Ensure all contact information is correct</p>
            <p>• <strong>Add details:</strong> Include new activities and achievements</p>
            <p>• <strong>Regular updates:</strong> Review and update quarterly</p>
          </div>
        </div>
      </div>
    </div>
  );
} 