import { STATUS_LABEL, type PortalJobStatus } from '../lib/portal-utils'
import { STATUS_LABEL, type JobStatus } from '../lib/portal-types'

const ICON: Record<PortalJobStatus, string> = {
  open: '◐',
  claimed: '◔',
  'in-progress': '◑',
  completed: '●',
  cancelled: '◎',
}

export function StatusPill({ status }: { status: PortalJobStatus }) {
  return (
    <span className={`status-pill status-${status}`}>
      <span aria-hidden>{ICON[status]}</span>
      {STATUS_LABEL[status]}
    </span>
  )
}
