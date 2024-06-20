
export const parseRegex = (value: string) => {
    const firstCharacter = value.charAt(0);
    const lastCharacter = value.charAt(value.length - 1);

    let firstSlice =
        firstCharacter === '/' || firstCharacter === '\\' ? 1 : undefined;
    let lastSlice =
        lastCharacter === '/' || lastCharacter === '\\' ? -1 : undefined;

    const patternString = value.slice(firstSlice, lastSlice);

    return new RegExp(patternString);
}