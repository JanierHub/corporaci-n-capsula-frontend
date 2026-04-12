const particles = [
  { left: "8%", top: "16%", size: "w-2 h-2", delay: "0s", duration: "2.2s" },
  { left: "18%", top: "72%", size: "w-3 h-3", delay: "0.6s", duration: "2.8s" },
  { left: "31%", top: "24%", size: "w-1.5 h-1.5", delay: "0.2s", duration: "1.8s" },
  { left: "46%", top: "64%", size: "w-2 h-2", delay: "1.1s", duration: "2.5s" },
  { left: "58%", top: "18%", size: "w-3 h-3", delay: "0.4s", duration: "2.1s" },
  { left: "71%", top: "78%", size: "w-2 h-2", delay: "1.5s", duration: "2.9s" },
  { left: "84%", top: "32%", size: "w-1.5 h-1.5", delay: "0.9s", duration: "1.9s" },
]

const SaiyanParticles = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {particles.map((particle, index) => (
        <span
          key={index}
          className={`absolute rounded-full bg-orange-300/70 shadow-[0_0_18px_rgba(251,146,60,0.85)] animate-pulse ${particle.size}`}
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  )
}

export default SaiyanParticles
