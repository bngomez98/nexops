export function formatDateOnly(value: string) {
  const datePortion = value.split('T')[0]
  const [year, month, day] = datePortion.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString()
}

export function todayDateInputValue(baseDate = new Date()) {
  const year = baseDate.getFullYear()
  const month = String(baseDate.getMonth() + 1).padStart(2, '0')
  const day = String(baseDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
