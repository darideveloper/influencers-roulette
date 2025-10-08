// Wheel configuration - true = win, false = lose
export interface WheelSection {
  isWin: boolean;
  color: string;
  image: string;
}

export const wheelConfig: WheelSection[] = [
  { isWin: true, color: '#4CAF50', image: 'https://emojicdn.elk.sh/%E2%9C%85?style=google' },
  { isWin: false, color: '#FF6B6B', image: 'https://emojicdn.elk.sh/%E2%9D%8C?style=google' },
  { isWin: true, color: '#4CAF50', image: 'https://emojicdn.elk.sh/%E2%9C%85?style=google' },
  { isWin: false, color: '#FF6B6B', image: 'https://emojicdn.elk.sh/%E2%9D%8C?style=google' },
  { isWin: true, color: '#4CAF50', image: 'https://emojicdn.elk.sh/%E2%9C%85?style=google' },
  { isWin: false, color: '#FF6B6B', image: 'https://emojicdn.elk.sh/%E2%9D%8C?style=google' },
  { isWin: true, color: '#4CAF50', image: 'https://emojicdn.elk.sh/%E2%9C%85?style=google' },
  { isWin: false, color: '#FF6B6B', image: 'https://emojicdn.elk.sh/%E2%9D%8C?style=google' }
];

// ⚙️ CONTROL VARIABLE - Set this to true for WIN or false for LOSE
export let shouldWin = true;

let isSpinning = false;

// Initialize wheel with SVG
export function initWheel(wheelElement: SVGElement): void {
  const sections = wheelConfig.length;
  const anglePerSection = 360 / sections;

  // Create pie slices
  for (let i = 0; i < sections; i++) {
    const startAngle = i * anglePerSection - 90;
    const endAngle = (i + 1) * anglePerSection - 90;

    // Calculate path for pie slice
    const startRad = startAngle * Math.PI / 180;
    const endRad = endAngle * Math.PI / 180;

    const x1 = 150 + 145 * Math.cos(startRad);
    const y1 = 150 + 145 * Math.sin(startRad);
    const x2 = 150 + 145 * Math.cos(endRad);
    const y2 = 150 + 145 * Math.sin(endRad);

    const largeArc = anglePerSection > 180 ? 1 : 0;

    const pathData = `M 150 150 L ${x1} ${y1} A 145 145 0 ${largeArc} 1 ${x2} ${y2} Z`;

    // Create path element
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', wheelConfig[i].color);
    path.setAttribute('stroke', '#333');
    path.setAttribute('stroke-width', '1');

    // Insert before center circle
    wheelElement.insertBefore(path, wheelElement.children[wheelElement.children.length - 2]);

    // Calculate middle angle for content positioning and rotation
    const midAngle = (startAngle + endAngle) / 2;
    const contentRadius = 100;
    const contentX = 150 + contentRadius * Math.cos(midAngle * Math.PI / 180);
    const contentY = 150 + contentRadius * Math.sin(midAngle * Math.PI / 180);

    // Content rotation - add 90 degrees to make content face outward
    const contentRotation = midAngle + 90;

    // Add image only (no text)
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', wheelConfig[i].image);
    image.setAttribute('x', String(contentX - 20));
    image.setAttribute('y', String(contentY - 20));
    image.setAttribute('width', '40');
    image.setAttribute('height', '40');
    image.setAttribute('transform', `rotate(${contentRotation}, ${contentX}, ${contentY})`);

    wheelElement.insertBefore(image, wheelElement.children[wheelElement.children.length - 2]);
  }
}

// Spin wheel
export function spinWheel(
  username: string,
  email: string,
  wheelElement: SVGElement,
  onResult: (isWin: boolean) => void
): void {
  if (!username || !email) {
    alert('⚠️ Please enter username and email');
    return;
  }

  if (isSpinning) return;

  isSpinning = true;

  const sections = wheelConfig.length;
  const anglePerSection = 360 / sections;

  // Find all indices with the desired outcome
  const targetIndices: number[] = [];
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

  // Reset wheel instantly without transition
  wheelElement.style.transition = 'none';
  wheelElement.style.transform = 'rotate(0deg)';

  // Force browser to apply the reset
  void (wheelElement as unknown as HTMLElement).offsetWidth;

  // Apply transition and start spinning after a brief moment
  requestAnimationFrame(() => {
    wheelElement.style.transition = 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)';

    requestAnimationFrame(() => {
      wheelElement.style.transform = `rotate(${finalRotation}deg)`;
    });
  });

  setTimeout(() => {
    // Calculate which section the pointer is pointing at
    const normalizedRotation = finalRotation % 360;
    const pointerAngle = (360 - normalizedRotation) % 360;
    const winningIndex = Math.floor(pointerAngle / anglePerSection) % sections;

    const prize = wheelConfig[winningIndex];

    console.log('Target Index:', targetIndex, 'Actual Index:', winningIndex, 'Should Win:', shouldWin, 'Is Win:', prize.isWin);

    onResult(prize.isWin);
    isSpinning = false;
  }, 3000);
}

export function setShouldWin(value: boolean): void {
  shouldWin = value;
}

