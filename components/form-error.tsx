import { AlertCircle } from 'lucide-react'

interface FormErrorProps {
  message?: string
  className?: string
}

export function FormError({ message, className = '' }: FormErrorProps) {
  if (!message) return null
  
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 ${className}`}>
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
