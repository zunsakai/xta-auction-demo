export const usdtFormat = (value?: number) =>
  value
    ? new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        currency: 'USD',
        style: 'currency',
      }).format(value)
    : ''
