import { Slot } from '@radix-ui/react-slot'
import { PropsWithoutRef, useId } from 'react'
import { cn } from '~/shared/lib/shadcn'
import { Input, InputProps, Label } from '~/shared/ui'

export interface FieldProps extends PropsWithoutRef<Omit<InputProps, 'id'>> {
  label: string
  required?: boolean
  asChild?: boolean
}

export const Field = ({
  className,
  error,
  label,
  required,
  asChild,
  ...props
}: FieldProps) => {
  const Component = asChild ? Slot : Input
  const id = useId()

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-end">
        <Label className="h-fit" htmlFor={id}>
          {label}
        </Label>
        {required && (
          <span className="text-md text-red-500 ml-1 leading-[14px]">*</span>
        )}
      </div>
      <Component id={id} error={error} {...props} />
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </div>
  )
}
