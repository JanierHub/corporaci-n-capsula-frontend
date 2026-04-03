const SaiyanParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">

      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-ping"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${1 + Math.random()}s`,
          }}
        />
      ))}

    </div>
  )
}

export default SaiyanParticles