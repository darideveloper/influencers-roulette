import type { APIRoute } from 'astro';

// In-memory rate limiting storage (for demonstration purposes)
// In production, use Redis or database
const rateLimitStore: Record<string, { count: number; resetTime: number }> = {};

export const POST: APIRoute = async ({ request }) => {


  // Simullate backend api responses

  const responseOkWin = new Response(
    JSON.stringify({
      status: "ok",
      message: "can spin",
      data: {
        "shouldWin": true,
        "canSpin": true,
        "canExtraSpin": true,
      }
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const responseOkLose = new Response(
    JSON.stringify({
      status: "ok",
      message: "can spin",
      data: {
        "shouldWin": false,
        "canSpin": true,
        "canExtraSpin": true,
      }
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const responseNoSpin = new Response(
    JSON.stringify({
      status: "error",
      message: "can't spin",
      data: {
        "shouldWin": false,
        "canSpin": false,
        "canExtraSpin": false,
      }
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const responseExtra = new Response(
    JSON.stringify({
      status: "error",
      message: "can't spin",
      data: {
        "shouldWin": false,
        "canSpin": true,
        "canExtraSpin": false,
      }
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );


  try {
    const body = await request.json();
    const { username, email } = body;

    // Validate input
    if (!username || !email) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Username and email are required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Here we will need more strong validation for the email, allowed = [gmail, hotmail, yahoo, outlook, etc.]
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid email format',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Rate limiting logic
    // TODO: In production, check database for user's last spin time
    const userKey = `${email.toLowerCase()}:${username.toLowerCase()}`;
    const now = Date.now();
    const rateLimitWindow = 20 * 1000; // time window in milliseconds

    if (rateLimitStore[userKey]) {
      if (now < rateLimitStore[userKey].resetTime) {
        const remainingTime = Math.ceil((rateLimitStore[userKey].resetTime - now) / 1000 / 60);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'rate_limit',
            message: `Please wait ${remainingTime} minute(s) before trying again`,
            remainingMinutes: remainingTime,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(Math.ceil((rateLimitStore[userKey].resetTime - now) / 1000)),
            },
          }
        );
      } else {
        // Reset expired rate limit
        delete rateLimitStore[userKey];
      }
    }

    // Set rate limit for this user
    rateLimitStore[userKey] = {
      count: 1,
      resetTime: now + rateLimitWindow,
    };

    // here comes the logic to determine if the user should win or lose
    // currently it is random and it logged in the console
    const shouldWin = Math.random() > 0.5;
    console.log('Should win:', shouldWin);

    // TODO: In production, save the spin result to database with username and email
    console.log('Spin result:', { username, email, result: shouldWin ? 'win' : 'lose' });

    // Return only win/lose result - frontend will calculate rotation
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          isWin: shouldWin,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid request data',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

