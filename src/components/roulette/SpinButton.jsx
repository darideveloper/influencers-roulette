export default function SpinButton({ onSpin, isSpinning }) {
  return (
    <div className="text-center mt-4 sm:mt-6">
      <button 
        onClick={onSpin}
        disabled={isSpinning}
        className="btn btn-primary btn-lg sm:btn-xl font-bold px-6 sm:px-8"
      >
        🎯 SPIN
      </button>
    </div>
  );
}

