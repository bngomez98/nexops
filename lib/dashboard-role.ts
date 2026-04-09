export function isHomeownerDashboardRole(role: string | undefined) {
  return role === 'client' || role === 'homeowner'
}
