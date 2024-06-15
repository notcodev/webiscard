import { Loader2 } from 'lucide-react'

export const PageLoader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin" />
    </div>
  )
}
