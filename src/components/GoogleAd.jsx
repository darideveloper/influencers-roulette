import { useEffect, useRef } from 'react'

export default function GoogleAd({ client, slot, format = 'auto', style }) {
  const adRef = useRef(null)
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    // Small delay to ensure layout is stable
    const timer = setTimeout(() => {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error('AdSense error:', err)
      }
    }, 300) // 300ms is usually enough

    return () => clearTimeout(timer)
  }, []) // Keep empty to prevent double-initialization

  return (
    <ins
      ref={adRef}
      className='adsbygoogle'
      style={{ 
        display: 'block', 
        width: '100%',
        minWidth: '250px', // Ensures minimum width
        height: '100px',
        ...style 
      }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive='true'
    />
  )
}
