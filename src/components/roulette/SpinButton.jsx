export default function SpinButton({ onSpin, disable, text }) {
  return (
    <div className='text-center'>
      <button
        onClick={onSpin}
        disabled={disable}
        className='bg-gradient-to-r from-pink-500 to-pink-600 text-white font-black py-2 px-12 text-xl sm:text-xl rounded-full transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl uppercase tracking-wider mb-6 duration-300'
        style={{
          cursor: disable ? 'not-allowed' : 'pointer',
          opacity: disable ? 0.5 : 1,
          transform: disable ? 'none' : 'scale(1.1)',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {text}
      </button>
    </div>
  )
}
