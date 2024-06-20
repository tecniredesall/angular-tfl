export const trimSpaces = (text: string): string => {

  if (!text) {
    return text;
  }

  return text.replace(/^\s+|\s+$/gm, '');

};