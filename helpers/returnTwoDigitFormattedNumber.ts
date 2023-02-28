export default function returnTwoDigitFormattedNumber(
  numberToFormat?: number
): string {
  let returnNumber: number
  if (!numberToFormat) returnNumber = 0
  else returnNumber = numberToFormat

  return returnNumber.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
