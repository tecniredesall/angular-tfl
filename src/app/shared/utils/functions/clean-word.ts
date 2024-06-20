import { removeAccents } from "./remove-accents";
import { trimSpaces } from "./trim-spaces";

export const cleanWord = (text: string): string => {
    return removeAccents(trimSpaces(text)).toLowerCase()
  };
