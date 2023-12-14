import { Event, Store } from 'effector'
import { useUnit } from 'effector-react'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

export const useAutoResizableField = (config: {
  field: { $value: Store<string>; changed: Event<string> }
  placeholder: string
}) => {
  const [focus, setFocus] = useState<boolean>(false)
  const { $value: value, changed } = useUnit(config.field)
  const ref = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    ref.current.style.height = 'auto'
    ref.current.style.height = `${ref.current.scrollHeight}px`
  }, [config.placeholder, focus, value])

  return {
    value: !focus && value === '' ? config.placeholder : value,
    ref,
    rows: 1,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) =>
      changed(event.target.value),
  }
}
