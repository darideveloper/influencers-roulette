export default function WinLoseControl({ shouldWin, onToggle }) {
  return (
    <div className="p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
      <label className="flex items-center justify-center gap-2 cursor-pointer">
        <input 
          type="checkbox" 
          checked={shouldWin}
          onChange={(e) => onToggle(e.target.checked)}
          className="checkbox checkbox-primary"
        />
        <span className="font-semibold text-white text-sm sm:text-base">Control: Win/Lose (Testing)</span>
      </label>
    </div>
  );
}

