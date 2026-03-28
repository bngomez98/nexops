export function formatDateOnly(value: string) {
  const datePortion = value.split('T')[0]
  const [year, month, day] = datePortion.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString()
}

export function todayDateInputValue() {
  return new Date().toISOString().split('T')[0]
}
