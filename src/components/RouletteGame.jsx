import { useState, useEffect } from 'react';
import WheelSection from './roulette/WheelSection';
import UserInputs from './roulette/UserInputs';
import SpinButton from './roulette/SpinButton';
import ErrorModal from './roulette/ErrorModal';
import ResultModal from './roulette/ResultModal';
import RateLimitModal from './roulette/RateLimitModal';
import { message } from '../data/message';

export default function RouletteGame({ user, wheelData }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [hasTransition, setHasTransition] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState(5);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showErrorModal || showResultModal || showRateLimitModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showErrorModal, showResultModal, showRateLimitModal]);

  const handleSpin = async () => {
    if (!username || !email) {
      setShowErrorModal(true);
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);
    setShowResultModal(false);

    try {
      // Call the API to get the spin result (win/lose only)
      const response = await fetch('/api/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
        }),
      });

      const data = await response.json();

      // Handle rate limit error (429)
      if (response.status === 429) {
        setRemainingMinutes(data.remainingMinutes || 5);
        setShowRateLimitModal(true);
        setIsSpinning(false);
        return;
      }

      if (!data.success) {
        console.error('Spin error:', data.error);
        setShowErrorModal(true);
        setIsSpinning(false);
        return;
      }

      // Get win/lose result from API
      const { isWin } = data.data;

      // Calculate rotation on frontend based on wheel data
      const sections = wheelData.length;
      const anglePerSection = 360 / sections;

      // Find target indices with desired outcome
      const targetIndices = [];
      for (let i = 0; i < wheelData.length; i++) {
        if (wheelData[i].isWin === isWin) {
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

      // Reset to 0 without transition
      setHasTransition(false);
      setRotation(0);
      
      // Use setTimeout to ensure the reset happens, then start spinning with transition
      setTimeout(() => {
        setHasTransition(true);
        setRotation(finalRotation);
      }, 50);

      setTimeout(() => {
        setResult(isWin ? 'win' : 'lose');
        setShowResultModal(true);
        setIsSpinning(false);
      }, 3050);
    } catch (error) {
      console.error('Error spinning wheel:', error);
      setShowErrorModal(true);
      setIsSpinning(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-2 sm:px-4 flex flex-col items-center" style={{ maxHeight: '100vh' }}>
      {/* Icons */}
      <img src="https://placehold.co/200x100?text=LOGO" alt="Logo" className="w-36 h-20 mb-4" />

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-center mb-1 text-white drop-shadow-2xl uppercase tracking-wide">
        {message.title}
      </h1>
      
      {/* Sub title */}
      <h2 className="text-base sm:text-xl font-bold text-center mb-3 text-white/90 drop-shadow-lg py-2">
        by {user?.toUpperCase()}
      </h2>
      
      {/* Input Fields */}
      <UserInputs 
        username={username}
        email={email}
        onUsernameChange={setUsername}
        onEmailChange={setEmail}
      />

      {/* Warning text */}
      <p className="text-center text-white/80 text-xs sm:text-sm mb-3 px-2">
        Ven tu rumbo rival, seras los podras recibir el mail de tu premio.
      </p>
      
      {/* Spin Button */}
      <div className="mb-6">
        <SpinButton onSpin={handleSpin} isSpinning={isSpinning} />
      </div>

      {/* Wheel */}
      <div className="mb-3 flex-shrink-0">
        <WheelSection rotation={rotation} hasTransition={hasTransition} wheelConfig={wheelData} />
      </div>

      {/* Error Modal */}
      <ErrorModal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)} 
      />

      {/* Rate Limit Modal */}
      <RateLimitModal 
        isOpen={showRateLimitModal} 
        onClose={() => setShowRateLimitModal(false)}
        remainingMinutes={remainingMinutes}
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
