export function getMonthList(
  locales,
  format = 'short', // "long" | "short"
) {
  const year = new Date().getFullYear(); // 2020
  const monthList = [...Array(12).keys()]; // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const formatter = new Intl.DateTimeFormat(locales, {
    month: format,
  });

  const getMonthName = (monthIndex) => formatter.format(new Date(year, monthIndex));

  return monthList.map(getMonthName);
}

export function fetch() {
  return 0;
}
