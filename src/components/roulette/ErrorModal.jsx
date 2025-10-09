export default function ErrorModal({ isOpen, onClose }) {
  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`} onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-2xl mb-4 text-center">⚠️ Error</h3>
        <p className="text-lg text-center py-4">Please enter username and email to spin the wheel!</p>
        <div className="modal-action justify-end">
          <button 
            onClick={onClose}
            className="btn btn-primary"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

