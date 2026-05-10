const currencySymbols = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$'
};

const getCurrencySymbol = (currency) => {
  return currencySymbols[currency] || currency;
};

module.exports = {
  currencySymbols,
  getCurrencySymbol
};
