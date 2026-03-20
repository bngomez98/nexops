import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRoleLabel(role: string) {
  switch (role) {
    case 'homeowner': return 'Homeowner'
    case 'property_manager': return 'Property Manager'
    case 'contractor': return 'Contractor'
    default: return role
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-800'
    case 'in_progress': return 'bg-blue-100 text-blue-800'
    case 'completed': return 'bg-green-100 text-green-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-muted text-muted-foreground'
  }
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case 'low': return 'bg-slate-100 text-slate-600'
    case 'normal': return 'bg-blue-50 text-blue-700'
    case 'high': return 'bg-orange-100 text-orange-700'
    case 'urgent': return 'bg-red-100 text-red-700'
    default: return 'bg-muted text-muted-foreground'
  }
}
