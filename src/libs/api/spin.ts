export async function spinUser(
  username: string,
  email: string,
  rouletteSlug: string,
  isExtraSpin: boolean
) {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  myHeaders.append('Authorization', `Token ${import.meta.env.PUBLIC_API_TOKEN}`)
  
  const raw = JSON.stringify({
    name: username,
    email: email,
    roulette: rouletteSlug,
    is_extra_spin: isExtraSpin,
  })


  const response = await fetch(
    `${import.meta.env.PUBLIC_API_BASE}/participant/spin/`,
    {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }
  )
  const data = await response.json()

  return data
}
