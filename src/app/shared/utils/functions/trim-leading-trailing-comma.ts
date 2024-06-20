export const trimLeadingTrailingComma = (text: string): string => {

  if (!text) {
    return text;
  }

  return text.replace(/(^,)|(,$)|(, $)/g, "");

};