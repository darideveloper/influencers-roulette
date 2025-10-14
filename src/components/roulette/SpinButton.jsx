export default function SpinButton({ onSpin, disable, text }) {
  return (
    <div className="text-center">
      <button 
        onClick={onSpin}
        disabled={disable}
        className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-black py-2 px-12 text-xl sm:text-xl rounded-full hover:not([disabled]):from-pink-600 hover:not([disabled]):to-pink-700 transition transform hover:not([disabled]):scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-2xl uppercase tracking-wider hover:not([disabled]):!cursor-pointer mb-6"
      >
        {text}
      </button>
    </div>
  );
}

