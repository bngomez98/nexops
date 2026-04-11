import { cn } from '@/lib/utils'
import type { PortalUser } from '../lib/portal-utils'

interface AvatarProps {
  user: Pick<PortalUser, 'initials' | 'avatarColor' | 'avatarUrl'>
  size?: number
  className?: string
}

export function Avatar({ user, size = 40, className }: AvatarProps) {
  return (
    <span
      className={cn('avatar bg-gradient-to-br overflow-hidden', user.avatarColor, className)}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.38),
      }}
      aria-hidden
    >
      {user.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        user.initials
      )}
    </span>
  )
}
