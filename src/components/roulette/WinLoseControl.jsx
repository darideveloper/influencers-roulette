export default function WinLoseControl({ shouldWin, onToggle }) {
  return (
    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
      <label className="flex items-center justify-center gap-2 cursor-pointer">
        <input 
          type="checkbox" 
          checked={shouldWin}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500"
        />
        <span className="font-semibold text-gray-700 text-sm sm:text-base">Win/Lose?</span>
      </label>
    </div>
  );
}

