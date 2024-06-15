import { PropsWithChildren } from 'react'

interface BackgroundProps {
  backgroundValue: string | null
}

export const Background = ({
  children,
  backgroundValue,
}: PropsWithChildren<BackgroundProps>) => {
  const getStyleProp = () => {
    if (!backgroundValue) return { background: 'hsl(var(--muted-foreground))' }

    return { backgroundImage: backgroundValue }
  }

  return (
    <div
      className="flex justify-center items-center w-full min-h-screen bg-cover bg-center relative"
      style={getStyleProp()}
    >
      {children}
    </div>
  )
}
