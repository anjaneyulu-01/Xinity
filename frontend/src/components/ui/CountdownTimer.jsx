import { useEffect, useState } from 'react'
import { formatCountdown } from '../../lib/utils'
import { useTheme } from '../../context/ThemeContext'

export default function CountdownTimer({ targetDate, className = '' }) {
  const [time, setTime] = useState(formatCountdown(new Date(targetDate) - Date.now()))
  const { dark } = useTheme()

  useEffect(() => {
    const id = setInterval(() => {
      setTime(formatCountdown(new Date(targetDate) - Date.now()))
    }, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return (
    <div className={`flex gap-2 ${className}`}>
      {[['d', 'Days'], ['h', 'Hrs'], ['m', 'Min'], ['s', 'Sec']].map(([k, label]) => (
        <div key={k} className={`flex flex-col items-center rounded-xl px-3 py-2 min-w-[52px] ${
          dark 
            ? 'bg-white/5 border border-white/10' 
            : 'bg-gray-100 border border-gray-200'
        }`}>
          <span className={`text-2xl font-bold font-code tabular-nums leading-none ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>{time[k]}</span>
          <span className={`text-[9px] uppercase tracking-widest mt-0.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{label}</span>
        </div>
      ))}
    </div>
  )
}
