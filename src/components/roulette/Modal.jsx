export default function ErrorModal({ isOpen, onClose, title, message, buttonText }) {
  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`} onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-2xl mb-4 text-center">{title}</h3>
        <p className="text-lg text-center py-4">{message}</p>
        <div className="modal-action justify-center">
          <button 
            onClick={onClose}
            className="btn btn-primary"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

