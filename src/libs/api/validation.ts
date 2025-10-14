export async function validateUser(username: string, email: string) {

    // Simullate all api json responses 
    const responses = [
        // canSpin:
        {   
            status: "ok",
            message: "can spin",
            data: {
                "canSpin": true,
                "canExtraSpin": true,
            },
            statusCode: 200
        },
        // canExtraSpin:
        {
            status: "ok",
            message: "can extra",
            data: {
                "canSpin": false,
                "canExtraSpin": true,
            },
            statusCode: 200
        },
        // noSpin:
        {
            status: "ok",
            message: "can't spin",
            data: {
                "canSpin": false,
                "canExtraSpin": false,
            },
            statusCode: 200
        },
        // invalidRequest:
        // {
        //     status: "error",
        //     message: "missing username or email",
        //     data: {},
        //     statusCode: 400
        // }
    ]

    // get a random response
    const response = responses[Math.floor(Math.random() * responses.length)];
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response
}