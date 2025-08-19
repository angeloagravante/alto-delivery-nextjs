const phpFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
})

export function formatCurrency(amount: number): string {
  return phpFormatter.format(amount)
}


