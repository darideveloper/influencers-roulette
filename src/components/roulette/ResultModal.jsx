export default function ResultModal({ isOpen, result, onClose }) {
  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`} onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {result === 'win' ? (
          <>
            <h3 className="font-bold text-4xl mb-4 text-center text-green-600">
              🎉 Congratulations! 🎉
            </h3>
            <p className="text-2xl text-center py-4 font-semibold text-green-600">
              You WON!
            </p>
          </>
        ) : (
          <>
            <h3 className="font-bold text-4xl mb-4 text-center text-red-600">
              😢 Sorry!
            </h3>
            <p className="text-2xl text-center py-4 font-semibold text-red-600">
              You LOST! Better luck next time!
            </p>
          </>
        )}
        <div className="modal-action justify-center">
          <button 
            onClick={onClose}
            className="btn btn-primary btn-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

