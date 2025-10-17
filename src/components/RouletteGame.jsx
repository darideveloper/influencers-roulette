import { useState, useEffect } from 'react'
import WheelSection from './roulette/WheelSection'
import UserInputs from './roulette/UserInputs'
import SpinButton from './roulette/SpinButton'
import ErrorModal from './roulette/ErrorModal'
import ResultModal from './roulette/ResultModal'
import RateLimitModal from './roulette/RateLimitModal'
import Modal from './roulette/Modal'
import AdModal from './roulette/AdModal'

// Libs
import { validateUser } from '../libs/api/validation'
import { spinUser } from '../libs/api/spin'

export default function RouletteGame({ user, wheelData, rouletteData }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState(null)
  const [hasTransition, setHasTransition] = useState(true)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [showRateLimitModal, setShowRateLimitModal] = useState(false)
  const [remainingMinutes, setRemainingMinutes] = useState(5)
  const [spinButtonText, setSpinButtonText] = useState('VALIDAR')

  // Spin button state
  const [spinButtonDisable, setSpinButtonDisable] = useState(true)

  // Modal state
  const [modalTitle, setModalTitle] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [modalButtonText, setModalButtonText] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalShowAdButton, setModalShowAdButton] = useState(false)

  // Modals ads state
  const [adModalVisible, setAdModalVisible] = useState(false)

  // Spinning status
  const [isExtraSpinning, setIsExtraSpinning] = useState(false)

  // Main app status
  // validating, spinning, extra_spinning, ready_to_spin, ready_to_extra_spin
  const [appStatus, setAppStatus] = useState('validating')

  // google ads
  const adsCode = `<script
        async
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4509450751077172'
        crossorigin='anonymous'
      ></script>
      <ins
        class='adsbygoogle'
        style='display:block'
        data-ad-client='ca-pub-4509450751077172'
        data-ad-slot='6872606708'
        data-ad-format='auto'
        data-full-width-responsive='true'
      ></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`

  // Map backend messages
  const messages = {
    validate: {
      'Invalid data': 'Introduce un correo válido',
    },
  }

  // Modal functions
  function showModal(
    title = '',
    message = '',
    buttonText = '',
    showAdButton = false
  ) {
    setModalTitle(title)
    setModalMessage(message)
    setModalButtonText(buttonText)
    setModalVisible(true)
    setModalShowAdButton(showAdButton)
  }

  // Spin handlers
  async function handleValidateUser() {
    const response = await validateUser(username, email, rouletteData.slug)

    // Show validation error
    if (response.status != 'success') {
      showModal(
        '⚠️ Error',
        messages.validate[response.message] || response.message,
        'OK'
      )
      return
    }

    // Validate remaining spins
    console.log({ response: response.data, isExtraSpinning: isExtraSpinning })


    // No allow to regular spin if can't spin
    if (
      !isExtraSpinning &&
      !response.data.can_spin &&
      !response.data.can_spin_ads
    ) {
      showModal(
        '⚠️ Error',
        rouletteData.data.message_no_spins,
        'OK'
      )
      return
    }

    // Show ad modal if can spin ads
    if (!isExtraSpinning && response.data.can_spin_ads) {
      showModal(
        '🎉 Ganar más 🎉',
        'Ve un anuncio para ganar un giro extra',
        'Regresar',
        true
      )
    }

    // Show spin modal if can spin
    if (
      (!isExtraSpinning && response.data.can_spin) ||
      (isExtraSpinning && response.data.can_extra_spin)
    ) {
      showModal(
        '¿Listo para ganar?',
        'Gira la ruleta y podrás ganar un increible premio!',
        'CONTINUAR',
      )
      setAppStatus('ready_to_spin')
    }
  }

  async function handleSpinUser() {
    const response = await spinUser(username, email)
    if (response.statusCode === 400) {
      setShowErrorModal(true)
    } else {
      setResult(response.data.isWin ? 'win' : 'lose')
      setShowResultModal(true)
      // setIsSpinning(false)
    }
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showErrorModal || showResultModal || showRateLimitModal) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [showErrorModal, showResultModal, showRateLimitModal])

  // Enable spin button when there are username and email
  useEffect(() => {
    if (username && email) {
      setSpinButtonDisable(false)
    } else {
      setSpinButtonDisable(true)
    }
    setAppStatus('validating')
  }, [username, email])

  // Handle spin button text when status changes
  useEffect(() => {
    const statusText = {
      validating: 'VALIDAR',
      ready_to_spin: 'GIRAR',
      ready_to_extra_spin: 'GIRAR EXTRA',
      extra_spinning: 'GIRANDO...',
      spinning: 'GIRANDO...',
    }
    setSpinButtonText(statusText[appStatus])
  }, [appStatus])

  const handleSpin = async () => {
    // No spin if already spinning
    if (isSpinning) return

    // set spin button to spinning
    // setIsSpinning(true)
    setResult(null)
    setShowResultModal(false)

    // validate or spin based in button status
    if (appStatus === 'validating') {
      await handleValidateUser()
    } else {
      await handleSpinUser()
    }

    // if (!username || !email) {
    //   setShowErrorModal(true)
    //   return
    // }

    // try {
    //   // Call the API to get the spin result (win/lose only)
    //   const response = await fetch('/api/spin', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       username,
    //       email,
    //     }),
    //   })

    //   const data = await response.json()

    //   // Handle rate limit error (429)
    //   if (response.status === 429) {
    //     setRemainingMinutes(data.remainingMinutes || 5)
    //     setShowRateLimitModal(true)
    //     setIsSpinning(false)
    //     return
    //   }

    //   if (!data.success) {
    //     console.error('Spin error:', data.error)
    //     setShowErrorModal(true)
    //     setIsSpinning(false)
    //     return
    //   }

    //   // Get win/lose result from API
    //   const { isWin } = data.data

    //   // Calculate rotation on frontend based on wheel data
    //   const sections = wheelData.length
    //   const anglePerSection = 360 / sections

    //   // Find target indices with desired outcome
    //   const targetIndices = []
    //   for (let i = 0; i < wheelData.length; i++) {
    //     if (wheelData[i].isWin === isWin) {
    //       targetIndices.push(i)
    //     }
    //   }

    //   // Pick a random target index from the desired outcome
    //   const targetIndex =
    //     targetIndices[Math.floor(Math.random() * targetIndices.length)]

    //   // Calculate rotation needed
    //   const sectionCenterAngle =
    //     targetIndex * anglePerSection + anglePerSection / 2

    //   // Add randomness within the section
    //   const randomOffset = (Math.random() - 0.5) * anglePerSection * 0.6

    //   // Calculate final rotation
    //   const spins = 5 + Math.floor(Math.random() * 3)
    //   const baseRotation = spins * 360
    //   const finalRotation =
    //     baseRotation + (360 - sectionCenterAngle) + randomOffset

    //   // Reset to 0 without transition
    //   setHasTransition(false)
    //   setRotation(0)

    //   // Use setTimeout to ensure the reset happens, then start spinning with transition
    //   setTimeout(() => {
    //     setHasTransition(true)
    //     setRotation(finalRotation)
    //   }, 50)

    //   setTimeout(() => {
    //     setResult(isWin ? 'win' : 'lose')
    //     setShowResultModal(true)
    //     setIsSpinning(false)
    //   }, 3050)
    // } catch (error) {
    //   console.error('Error spinning wheel:', error)
    //   setShowErrorModal(true)
    //   setIsSpinning(false)
    // }
  }

  return (
    <div
      className='max-w-2xl mx-auto w-full px-2 sm:px-4 flex flex-col items-center'
      style={{ maxHeight: '100vh' }}
    >
      {/* Insert google ads as html */}
      <div dangerouslySetInnerHTML={{ __html: adsCode }} />

      {/* Icons */}
      <img
        src={rouletteData.logo}
        alt='Logo'
        className='h-20 w-auto mb-4'
      />

      {/* Title */}
      <h1 className='text-2xl sm:text-3xl md:text-4xl font-black text-center mb-1 text-white drop-shadow-2xl uppercase tracking-wide'>
        {rouletteData.name}
      </h1>

      {/* Sub title */}
      <h2 className='text-base sm:text-xl font-bold text-center mb-3 text-white/90 drop-shadow-lg py-2'>
        {rouletteData.subtitle || ''}
      </h2>

      {/* Input Fields */}
      <UserInputs
        username={username}
        email={email}
        onUsernameChange={setUsername}
        onEmailChange={setEmail}
      />

      {/* Warning text */}
      <p className='text-center text-white/80 text-xs sm:text-sm mb-3 px-2'>
        {rouletteData.bottom_text || ''}
      </p>

      {/* Spin Button */}
      <div className='mb-6'>
        <SpinButton
          onSpin={handleSpin}
          disable={spinButtonDisable}
          text={spinButtonText}
        />
      </div>

      {/* Wheel */}
      <div className='mb-3 flex-shrink-0'>
        <WheelSection
          rotation={rotation}
          hasTransition={hasTransition}
          wheelConfig={rouletteData.wheel_data}
        />
      </div>

      {/* Dinamic Modal */}
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalTitle}
        message={modalMessage}
        buttonText={modalButtonText}
        showAdButton={modalShowAdButton}
        onAdButtonClick={() => {
          setAdModalVisible(true)
          setModalVisible(false)
          console.log('onAdButtonClick')
        }}
      />

      {/* Ad model*/}
      <AdModal
        addHtmlCode={adsCode}
        onClose={() => {setAdModalVisible(false); setAppStatus('ready_to_extra_spin')}}
        isOpen={adModalVisible}
      />
    </div>
  )
}
