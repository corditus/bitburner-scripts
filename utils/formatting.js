/** @param {NS} ns */
export async function main(ns) {

}

export function toDecimal(amount,decimal){
  return parseFloat(amount.toFixed(decimal))
};

export function formatAUD(amount) {
  return amount.toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
  });
}

export function formatCurrencyShorthand(number) {
  const absNumber = Math.abs(number);
  let formattedNumber;
  let suffix = '';

  if (absNumber >= 1_000_000_000_000) {
    formattedNumber = (number / 1_000_000_000_000).toFixed(1);
    suffix = 'T';
  } else if (absNumber >= 1_000_000_000) { // Billions
    formattedNumber = (number / 1_000_000_000).toFixed(1);
    suffix = 'B';
  } else if (absNumber >= 1_000_000) { // Millions
    formattedNumber = (number / 1_000_000).toFixed(1);
    suffix = 'M';
  } else if (absNumber >= 1_000) { // Thousands
    formattedNumber = (number / 1_000).toFixed(1);
    suffix = 'K';
  } else { // Less than a thousand
    formattedNumber = number.toFixed(2); // Format as regular currency
  }

  // Remove trailing .0 if present for cleaner output
  if (formattedNumber.endsWith('.0')) {
    formattedNumber = formattedNumber.slice(0, -2);
  }

  return `$${formattedNumber}${suffix}`;
}
