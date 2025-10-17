import { useMemo } from 'react';
import { useState, useEffect } from 'react';

// Generate wheel sections - this runs once and is memoized
const generateWheelSections = (wheelConfig) => {
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
      image: wheelConfig[i].image,
      imageX: contentX - 20,
      imageY: contentY - 20,
      imageRotation: contentRotation,
      imageCenterX: contentX,
      imageCenterY: contentY,
    });
  }

  return wheelSections;
};

export default function WheelSection({ status = 'ready_to_spin', wheelConfig, onSpinEnd = () => {}, award = null}) {

  const [rotation, setRotation] = useState(0)

  useEffect(() => {

    console.log({wheelConfig, award, status})

    if (status === 'spinning' || status === 'extra_spinning') {

      const baseRotation = 360 * 3
      let extraRotation = 0

      if (award) {
        // Get award index
        const awardIndex = wheelConfig.findIndex(section => section.isWin === true && section.image === award.image)

        // Calulate rotation based on award position
        extraRotation = - awardIndex * 45 - 45/2
      } else {
        
        // get random no award rotation
        const noAwardElements = wheelConfig.filter(section => section.isWin === false)
        const noAwardElement = noAwardElements[Math.floor(Math.random() * noAwardElements.length)]
        const noAwardIndex = noAwardElements.findIndex(section => section.id === noAwardElement.id)

        // Calulate rotation based on award position
        extraRotation = - noAwardIndex * 45 - 45/2
      }

      // Calculate final rotation
      const finalRotation = baseRotation + extraRotation
    
      // Set rotation
      console.log({finalRotation, extraRotation})
      setRotation(finalRotation)

      // Run onSpinEnd callback when animation ends
      setTimeout(() => {
        onSpinEnd()
      }, 3000)
    }
  }, [status])
  
  // Generate wheel sections once and memoize
  const wheelSections = useMemo(() => generateWheelSections(wheelConfig), [wheelConfig]);

  return (
    <div className="scale-75 -mt-12 xs:scale-100 xs:mt-0 wheel-container relative w-full max-w-[350px] aspect-square mx-auto">
      <div className="pointer absolute top-[-20px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[35px] border-t-pink-500 z-20 drop-shadow-lg"></div>
      <svg 
        className={`wheel w-full h-full transition-transform duration-[3000ms] ease-[cubic-bezier(0.17,0.67,0.12,0.99)]' : ''}`}
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
            href={section.image}
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
  );
}

