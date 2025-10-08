import { useState, useRef, useMemo } from 'react';

const wheelConfig = [
  { isWin: true, color: '#4CAF50', image: 'https://emojicdn.elk.sh/%E2%9C%85?style=google' },
  { isWin: false, color: '#FF6B6B', image: 'https://emojicdn.elk.sh/%E2%9D%8C?style=google' },
  { isWin: true, color: '#4CAF50', image: 'https://emojicdn.elk.sh/%E2%9C%85?style=google' },
  { isWin: false, color: '#FF6B6B', image: 'https://emojicdn.elk.sh/%E2%9D%8C?style=google' },
  { isWin: true, color: '#4CAF50', image: 'https://emojicdn.elk.sh/%E2%9C%85?style=google' },
  { isWin: false, color: '#FF6B6B', image: 'https://emojicdn.elk.sh/%E2%9D%8C?style=google' },
  { isWin: true, color: '#4CAF50', image: 'https://emojicdn.elk.sh/%E2%9C%85?style=google' },
];

// Generate wheel sections - this runs once and is memoized
const generateWheelSections = () => {
  const sections = wheelConfig.length;
  const anglePerSection = 360 / sections;
  const wheelSections = [];

  for (let i = 0; i < sections; i++) {
    const startAngle = i * anglePerSection - 90;
    const endAngle = (i + 1) * anglePerSection - 90;

    const startRad = startAngle * Math.PI / 180;
    const endRad = endAngle * Math.PI / 180;

    const x1 = 150 + 145 * Math.cos(startRad);
    const y1 = 150 + 145 * Math.sin(startRad);
    const x2 = 150 + 145 * Math.cos(endRad);
    const y2 = 150 + 145 * Math.sin(endRad);

    const largeArc = anglePerSection > 180 ? 1 : 0;
    const pathData = `M 150 150 L ${x1} ${y1} A 145 145 0 ${largeArc} 1 ${x2} ${y2} Z`;

    // Calculate middle angle for content positioning
    const midAngle = (startAngle + endAngle) / 2;
    const contentRadius = 100;
    const contentX = 150 + contentRadius * Math.cos(midAngle * Math.PI / 180);
    const contentY = 150 + contentRadius * Math.sin(midAngle * Math.PI / 180);
    const contentRotation = midAngle + 90;

    wheelSections.push({
      id: i,
      pathData,
      color: wheelConfig[i].color,
      imageUrl: wheelConfig[i].image,
      imageX: contentX - 20,
      imageY: contentY - 20,
      imageRotation: contentRotation,
      imageCenterX: contentX,
      imageCenterY: contentY,
    });
  }

  return wheelSections;
};

export default function RouletteGame({ user }) {
  const [username, setUsername] = useState(user || '');
  const [email, setEmail] = useState('');
  const [shouldWin, setShouldWin] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [hasTransition, setHasTransition] = useState(true);
  const wheelRef = useRef(null);
  const svgRef = useRef(null);

  // Generate wheel sections once and memoize
  const wheelSections = useMemo(() => generateWheelSections(), []);

  const handleSpin = () => {
    if (!username || !email) {
      alert('⚠️ Please enter username and email');
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    const sections = wheelConfig.length;
    const anglePerSection = 360 / sections;

    // Find target indices with desired outcome
    const targetIndices = [];
    for (let i = 0; i < wheelConfig.length; i++) {
      if (wheelConfig[i].isWin === shouldWin) {
        targetIndices.push(i);
      }
    }

    // Pick a random target index from the desired outcome
    const targetIndex = targetIndices[Math.floor(Math.random() * targetIndices.length)];
    
    // Calculate rotation needed
    const sectionCenterAngle = targetIndex * anglePerSection + anglePerSection / 2;
    
    // Add randomness within the section
    const randomOffset = (Math.random() - 0.5) * anglePerSection * 0.6;
    
    // Calculate final rotation
    const spins = 5 + Math.floor(Math.random() * 3);
    const baseRotation = spins * 360;
    const finalRotation = baseRotation + (360 - sectionCenterAngle) + randomOffset;
    
    // Reset to 0 without transition (like the original version)
    setHasTransition(false);
    setRotation(0);
    
    // Use setTimeout to ensure the reset happens, then start spinning with transition
    setTimeout(() => {
      setHasTransition(true);
      setRotation(finalRotation);
    }, 50);

    setTimeout(() => {
      // Calculate which section the pointer is pointing at
      const normalizedRotation = finalRotation % 360;
      const pointerAngle = (360 - normalizedRotation) % 360;
      const winningIndex = Math.floor(pointerAngle / anglePerSection) % sections;
      const prize = wheelConfig[winningIndex];

      console.log('Should Win:', shouldWin, 'Target Index:', targetIndex, 'Actual Index:', winningIndex, 'Prize:', prize.isWin ? 'WIN' : 'LOSE');

      setResult(prize.isWin ? 'win' : 'lose');
      setIsSpinning(false);
    }, 3050);
  };

  return (
    <div className="max-w-xl mx-auto w-full">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-white drop-shadow-lg">
        🎰 RULETA DE PREMIOS 🎰
      </h1>
      
      {/* Sub title */}
      <h2 className="text-base sm:text-lg font-bold text-center mb-6 sm:mb-8 text-white drop-shadow-lg">
        {user}
      </h2>
      
      {/* Input Fields */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="👤 Username" 
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg mb-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm sm:text-base"
        />
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="📧 Email" 
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm sm:text-base"
        />
      </div>
      
      {/* Wheel */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="wheel-container relative w-full max-w-[300px] aspect-square mx-auto">
          <div className="pointer absolute top-[-15px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-500 z-20"></div>
          <svg 
            ref={svgRef}
            className={`wheel w-full h-full ${hasTransition ? 'transition-transform duration-[3000ms] ease-[cubic-bezier(0.17,0.67,0.12,0.99)]' : ''}`}
            viewBox="0 0 300 300"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <circle cx="150" cy="150" r="148" fill="none" stroke="#333" strokeWidth="4"/>
            
            {/* Wheel sections - preloaded */}
            {wheelSections.map((section) => (
              <path
                key={`path-${section.id}`}
                d={section.pathData}
                fill={section.color}
                stroke="#333"
                strokeWidth="1"
              />
            ))}
            
            {/* Section images */}
            {wheelSections.map((section) => (
              <image
                key={`image-${section.id}`}
                href={section.imageUrl}
                x={section.imageX}
                y={section.imageY}
                width="40"
                height="40"
                transform={`rotate(${section.imageRotation}, ${section.imageCenterX}, ${section.imageCenterY})`}
              />
            ))}
            
            {/* Center circle */}
            <circle cx="150" cy="150" r="25" fill="white" stroke="#333" strokeWidth="3"/>
            <text x="150" y="158" textAnchor="middle" fontSize="20">⭐</text>
          </svg>
        </div>
        
        {/* Spin Button */}
        <div className="text-center mt-4 sm:mt-6">
          <button 
            onClick={handleSpin}
            disabled={isSpinning}
            className="bg-blue-600 text-white font-bold py-2 px-6 sm:py-3 sm:px-8 text-lg sm:text-xl rounded-lg hover:bg-blue-700 transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            🎯 SPIN
          </button>
        </div>
        
        {/* Control Variable (for testing) */}
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <label className="flex items-center justify-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={shouldWin}
              onChange={(e) => setShouldWin(e.target.checked)}
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-semibold text-gray-700 text-sm sm:text-base">Win/Lose?</span>
          </label>
        </div>
        
        {/* Result */}
        {result && (
          <div className={`text-center mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg ${result === 'win' ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className={`text-lg sm:text-2xl font-bold ${result === 'win' ? 'text-green-600' : 'text-red-600'}`}>
              {result === 'win' ? '🎉 Congratulations! You WON! 🎉' : '😢 Sorry! You LOST! Better luck next time!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

