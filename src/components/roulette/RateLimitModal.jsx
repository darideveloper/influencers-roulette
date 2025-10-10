export default function RateLimitModal({ isOpen, onClose, remainingMinutes = 5 }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-5xl">⏰</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
          Rate Limit Reached
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 mb-6">
          You've already tried the roulette. Please try again after{' '}
          <span className="font-bold text-orange-600">{remainingMinutes} minute{remainingMinutes !== 1 ? 's' : ''}</span>.
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          OK, I'll Wait
        </button>
      </div>
    </div>
  );
}

