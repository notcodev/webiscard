import { useEffect, useState } from 'react'
import { useLatest } from './use-latest'

export const useTimer = (initialValue: number) => {
  const [targetTime] = useState(Date.now() + initialValue * 1000)
  const [currentTime, setCurrentTime] = useState(Date.now())

  const latestTargetTime = useLatest(targetTime)
  const latestCurrentTime = useLatest(currentTime)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    const updateTimer = () => {
      setCurrentTime(Date.now())

      if (latestCurrentTime.current < latestTargetTime.current) {
        timeoutId = setTimeout(updateTimer, 1000)
      }
    }

    updateTimer()

    return () => {
      clearTimeout(timeoutId)
    }
  }, [latestCurrentTime, latestTargetTime])

  return Math.max(0, Math.round((targetTime - currentTime) / 1000))
}
