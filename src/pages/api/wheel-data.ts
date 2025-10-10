import type { APIRoute } from 'astro';

// Hardcoded wheel configuration data (same as spin.ts)
const wheelConfig = [
  { isWin: true, color: '#4CAF50', image: 'https://emojicdn.elk.sh/%E2%9C%85?style=google' },
  { isWin: false, color: '#FF6B6B', image: 'https://emojicdn.elk.sh/%E2%9D%8C?style=google' },
  { isWin: true, color: '#4CAF50', image: 'https://emojicdn.elk.sh/%E2%9C%85?style=google' },
  { isWin: false, color: '#FF6B6B', image: 'https://emojicdn.elk.sh/%E2%9D%8C?style=google' },
  { isWin: true, color: '#4CAF50', image: 'https://emojicdn.elk.sh/%E2%9C%85?style=google' },
  { isWin: false, color: '#FF6B6B', image: 'https://emojicdn.elk.sh/%E2%9D%8C?style=google' },
];

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      success: true,
      data: wheelConfig,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

