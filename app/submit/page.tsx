"use client";
import { useState } from "react";

interface UploadResult {
  success: boolean
  cid: string
  originalName: string
  size: number
  type: string
  url: string
}

export default function SubmitProof() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload a file");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Submit Proof</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
      >
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4 w-full"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={uploading}
        >
          {uploading ? "Uploading to IPFS..." : "Upload Proof"}
        </button>
      </form>

      {uploadResult && (
        <div className="mt-4 p-4 bg-green-100 rounded-lg max-w-md w-full">
          <h3 className="text-green-800 font-semibold mb-2">✅ Uploaded to IPFS!</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p><strong>File:</strong> {uploadResult.originalName}</p>
            <p><strong>Size:</strong> {(uploadResult.size / 1024).toFixed(1)} KB</p>
            <p><strong>Type:</strong> {uploadResult.type}</p>
            <p><strong>IPFS CID:</strong> <code className="bg-gray-200 px-1 rounded text-xs">{uploadResult.cid}</code></p>
            <a
              href={uploadResult.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              View on IPFS Gateway
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
