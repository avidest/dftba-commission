export function calcCommission(price, commission) {
  let {flat, percent} = commission
  
  percent = parseFloat(percent) / 100
  flat = parseFloat(flat) * 100
  price = parseFloat(price) * 100

  let amount = (price * percent) + flat

  return (amount / 100).toFixed(2)
}