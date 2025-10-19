import { useState, useEffect } from 'react'
import clsx from 'clsx'
import GoogleAd from '../GoogleAd'

export default function AdModal({
  isOpen,
  googleAdsConfig,
  className = '',
  onClose = () => {},
}) {
  const [countdown, setCountdown] = useState(10)

  // Reset countdown when modal opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(10)
    }
  }, [isOpen])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleClose = () => {
    if (countdown === 0) {
      onClose()
    }
  }

  return (
    <div
      className={clsx(
        'modal',
        isOpen && 'modal-open',
        'w-screen',
        'h-screen',
        className
      )}
      onClick={countdown === 0 ? onClose : undefined}
    >
      <div
        className={clsx(
          'modal-box',
          'w-11/12',
          'h-11/12',
          'max-w-full',
          'max-h-full',
          'relative'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          disabled={countdown > 0}
          className={clsx(
            'absolute',
            'top-4',
            'right-4',
            'btn',
            'btn-ghost',
            'btn-circle',
            'text-xl',
            'font-bold',
            countdown > 0 && 'opacity-50 cursor-not-allowed'
          )}
        >
          {countdown > 0 ? countdown : '✕'}
        </button>

        {isOpen && googleAdsConfig && (
          <div className="w-full h-full flex items-center justify-center p-4">
            <GoogleAd
              key={Date.now()}
              client={googleAdsConfig.client}
              slot={googleAdsConfig.slot}
              format={googleAdsConfig.format}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
