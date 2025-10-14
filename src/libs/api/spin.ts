export async function spinUser(username: string, email: string) {
    const responses = [
        // lose
        {   
            status: "ok",
            message: "lose",
            data: {
                "isWin": false,
            },
            statusCode: 200
        },
        // win
        {
            status: "ok",
            message: "win",
            data: {
                "isWin": true,
            },
            statusCode: 200
        },
        // error
        // {
        //     status: "error",
        //     message: "error",
        //     data: {},
        //     statusCode: 400
        // },
    ]
    const response = responses[Math.floor(Math.random() * responses.length)];
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response
}