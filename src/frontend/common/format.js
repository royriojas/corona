const { DateTime } = require('luxon');

export const formatAsNumber = (num, { locale = 'en-US', opts } = {}) => {
  const formatter = new Intl.NumberFormat(locale, opts);

  return formatter.format(num);
};

export const formatAsDate = (date, opts) => DateTime.fromFormat(date, 'yyyy-MM-dd').toLocaleString(opts);
