export async function getRouletteData(rouletteSlug: string) {
  const myHeaders = new Headers()
  myHeaders.append('Authorization', `Token ${import.meta.env.PUBLIC_API_TOKEN}`)

  const response = await fetch(
    `${import.meta.env.PUBLIC_API_BASE}/roulette/${rouletteSlug}/`,
    {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }
  )

  // Debug response if error
  if (!response.ok) {
    console.error('Error fetching roulette data:', response.statusText)
    return {
      status: 'error',
      message: 'Error fetching roulette data',
    }
  }


  const data = await response.json()

  // Format wheel data
  let colors = [
    data.data.color_spin_1,
    data.data.color_spin_2,
    data.data.color_spin_3,
    data.data.color_spin_4,
  ]
  colors = [...colors, ...colors]
  const wheelData = colors.map((color, index) => ({
    isWin: false,
    color,
    image: data.data.wrong_icon,
  }))

  // Set awards in random positions
  const usedWheelIndexes: number[] = []
  data.data.awards.map((award: any) => {
    let randomIndex: number
    while (true) {
      randomIndex = Math.floor(Math.random() * wheelData.length)
      if (usedWheelIndexes.includes(randomIndex)) {
        continue
      }
      break
    }
    usedWheelIndexes.push(randomIndex)
    wheelData[randomIndex].isWin = true
    wheelData[randomIndex].image = award.image
  })

  // Add wheel data to data
  data.data.wheel_data = wheelData

  return data
}
