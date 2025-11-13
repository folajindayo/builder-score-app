'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">⚠️</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-8">{error.message}</p>
        <button onClick={reset} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Try Again
        </button>
      </div>
    </div>
  );
}

