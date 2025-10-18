import { useEffect } from 'react'

export default function GoogleAd({ client, slot, format = 'auto', style }) {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <ins
      className='adsbygoogle'
      style={{ display: 'block', width: '100%', height: '100px' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive='true'
    />
  )
}
