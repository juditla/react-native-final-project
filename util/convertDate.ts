// convert ISO date string to format 'month day'
export const convertDate = (isoDate: string) => {
  const dateObject = new Date(isoDate);
  const monthName = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${monthName[dateObject.getMonth()]} ${dateObject.getDay()}`;
};
