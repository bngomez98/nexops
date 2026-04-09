import { cn } from '@/lib/utils'
import type { PortalUser } from '../lib/mock-data'

interface AvatarProps {
  user: Pick<PortalUser, 'initials' | 'avatarColor'>
  size?: number
  className?: string
}

export function Avatar({ user, size = 40, className }: AvatarProps) {
  return (
    <span
      className={cn('avatar bg-gradient-to-br', user.avatarColor, className)}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.38),
      }}
      aria-hidden
    >
      {user.initials}
    </span>
  )
}
