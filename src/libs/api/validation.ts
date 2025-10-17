export async function validateUser(
  name: string,
  email: string,
  roulette: string
) {
  // get data from api
  const myHeaders = new Headers()
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append('Authorization', `Token ${import.meta.env.PUBLIC_API_TOKEN}`)

  const response = await fetch(
    `${import.meta.env.PUBLIC_API_BASE}/participant/validate/`,
    {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ name, email, roulette }),
    }
  )
  const data = await response.json()
  console.log({ data })
  return data
}
