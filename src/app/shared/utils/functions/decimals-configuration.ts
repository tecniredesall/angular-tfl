export const getGeneralDecimalPlaces = (): number => {
  let decimals: any = JSON.parse(localStorage.getItem('decimals'));
  return decimals?.hasOwnProperty('general') ? decimals.general : 1;
}