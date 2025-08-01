export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-gray-800">
      <h1 className="text-5xl font-bold text-green-700 mb-6">
        🌱 GreenStamp
      </h1>
      <p className="max-w-lg text-center text-lg mb-8">
        Proof that your green actions matter — AI-verified, blockchain-backed, and publicly visible.
      </p>
      <a
        href="/submit"
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Submit Your Proof
      </a>
    </main>
  );
}
