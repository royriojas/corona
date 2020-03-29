export const formatAsNumber = (num, { locale = 'en-US', opts } = {}) => {
  const formatter = new Intl.NumberFormat(locale, opts);

  return formatter.format(num);
};
