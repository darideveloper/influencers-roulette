export async function getRouletteData(rouletteSlug: string) {
  console.log({ rouletteSlug })

  const myHeaders = new Headers()
  myHeaders.append('Authorization', `Token ${import.meta.env.VITE_API_TOKEN}`)

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE}/roulette/${rouletteSlug}/`,
    {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }
  )
  const data = await response.json()
  console.log({ response, data })
  return data
}
