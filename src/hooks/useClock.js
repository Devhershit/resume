import { useEffect, useMemo, useState } from 'react'

export function useClock() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return useMemo(
    () =>
      new Intl.DateTimeFormat('en-IN', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(time),
    [time],
  )
}
