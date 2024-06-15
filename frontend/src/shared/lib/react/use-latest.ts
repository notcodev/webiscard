import { useInsertionEffect, useRef } from 'react'

export const useLatest = <T>(initialValue: T) => {
  const ref = useRef(initialValue)

  useInsertionEffect(() => {
    ref.current = initialValue
  }, [initialValue])

  return ref
}
