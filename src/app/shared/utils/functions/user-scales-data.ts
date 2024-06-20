/**
 * Check if user has scales linked
 * @returns boolean value
 */
export const checkUserHasScalesLinked = (): boolean => {
  const scalesData: any = JSON.parse(localStorage.getItem('scales'));
  return !!scalesData?.hasLinked;
}

