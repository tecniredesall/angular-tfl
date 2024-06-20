export const convertMomentToDate = (date: any): Date => {
  return new Date(
    date.get('year'),
    date.get('month'),
    date.get('date'),
    date.get('hour'),
    date.get('minute'),
    date.get('second')
  );
};