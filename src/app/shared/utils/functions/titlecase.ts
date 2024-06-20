import { trimSpaces } from "./trim-spaces";

export function titleCaseWord(value: string): string {
    if (!value || value == '') return value; 
    const words: Array<string> = trimSpaces(value).split(' ');
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        words[i] = word[0].toUpperCase() + word.substr(1).toLowerCase();
    }
    return words.join(' ');
}