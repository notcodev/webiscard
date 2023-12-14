import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { Button } from './button'
import { Input, InputProps } from './input'

export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<InputProps, 'type'>
>(({ disabled, ...props }, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  return (
    <div className="relative">
      <Input
        type={isVisible ? 'text' : 'password'}
        disabled={disabled}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-fit p-[6px] absolute right-1 top-1"
        onClick={() => setIsVisible((prev) => !prev)}
      >
        {!isVisible ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
})
