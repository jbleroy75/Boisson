export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="relative inline-block">
          {/* Spinning bottle animation */}
          <svg
            className="animate-spin h-16 w-16 text-[var(--color-orange)]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 64 64"
          >
            <defs>
              <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="100%" stopColor="#FF1493" />
              </linearGradient>
            </defs>
            <path
              d="M28 6 L36 6 L36 14 L44 22 L44 52 C44 58 36 62 32 62 C28 62 20 58 20 52 L20 22 L28 14 L28 6 Z"
              fill="url(#loadingGradient)"
              opacity="0.3"
            />
            <path
              d="M28 6 L36 6 L36 14 L44 22 L44 52 C44 58 36 62 32 62 C28 62 20 58 20 52 L20 22 L28 14 L28 6 Z"
              stroke="url(#loadingGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="180"
              strokeDashoffset="60"
            />
          </svg>
        </div>
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Chargement...</p>
      </div>
    </div>
  );
}
