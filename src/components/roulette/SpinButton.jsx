export default function SpinButton({ onSpin, isSpinning }) {
  return (
    <div className="text-center">
      <button 
        onClick={onSpin}
        disabled={isSpinning}
        className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-black py-4 px-16 text-xl sm:text-2xl rounded-full hover:from-pink-600 hover:to-pink-700 transition transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-2xl uppercase tracking-wider"
      >
        {isSpinning ? 'GIRANDO...' : 'GIRAR'}
      </button>
    </div>
  );
}

