import { useState, useEffect } from 'react';
import WheelSection, { wheelConfig } from './roulette/WheelSection';
import UserInputs from './roulette/UserInputs';
import SpinButton from './roulette/SpinButton';
import WinLoseControl from './roulette/WinLoseControl';
import ErrorModal from './roulette/ErrorModal';
import ResultModal from './roulette/ResultModal';

export default function RouletteGame({ user }) {
  const [username, setUsername] = useState(user || '');
  const [email, setEmail] = useState('');
  const [shouldWin, setShouldWin] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [hasTransition, setHasTransition] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showErrorModal || showResultModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showErrorModal, showResultModal]);

  const handleSpin = () => {
    if (!username || !email) {
      setShowErrorModal(true);
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);
    setShowResultModal(false);

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
      setShowResultModal(true);
      setIsSpinning(false);
    }, 3050);
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-4">
      {/* Icons */}
      <div className="flex justify-center items-center gap-3 mb-4">
        <span className="text-5xl sm:text-6xl">🍀</span>
        <span className="text-5xl sm:text-6xl">🎁</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-center mb-2 text-white drop-shadow-2xl uppercase tracking-wide">
        RULETA DE LA SUERTE
      </h1>
      
      {/* Sub title */}
      <h2 className="text-lg sm:text-xl font-semibold text-center mb-8 text-white/90 drop-shadow-lg">
        BY {user?.toUpperCase() || 'LUCII LBA'}
      </h2>
      
      {/* Input Fields */}
      <UserInputs 
        username={username}
        email={email}
        onUsernameChange={setUsername}
        onEmailChange={setEmail}
      />

      {/* Warning text */}
      <p className="text-center text-white/80 text-sm mb-6 px-4">
        Ven tu rumbo rival, seras los podras recibir el mail de tu premio.
      </p>
      
      {/* Spin Button */}
      <div className="mb-6">
        <SpinButton onSpin={handleSpin} isSpinning={isSpinning} />
      </div>

      {/* Wheel */}
      <div className="mb-6">
        <WheelSection rotation={rotation} hasTransition={hasTransition} />
      </div>

      {/* Control Variable (for testing) - Optional, can be hidden in production */}
      <div className="mt-4">
        <WinLoseControl shouldWin={shouldWin} onToggle={setShouldWin} />
      </div>

      {/* Error Modal */}
      <ErrorModal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)} 
      />

      {/* Result Modal */}
      <ResultModal 
        isOpen={showResultModal} 
        result={result}
        onClose={() => setShowResultModal(false)} 
      />
    </div>
  );
}
