const { parseISO, format, isValid } = require('date-fns');

const formatDate = (date) => format(parseISO(date), 'yyyy-MM-dd');
const formatTime = (date) => format(parseISO(date), 'HH:mm');

const isValidDate = (dateString) => {
  const date = parseISO(dateString);
  return isValid(date);
};

module.exports = {
  formatDate,
  formatTime,
  isValidDate
};