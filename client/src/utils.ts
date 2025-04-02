export const vndFormat = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

export const usdtFormat = (value?: number) =>
  value
    ? new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        currency: 'USD',
        style: 'currency',
      }).format(value)
    : ''
