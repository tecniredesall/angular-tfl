export function toLowerNoDigitsNoSigns(value: string) {
    return value.toLowerCase().replace(/[^a-zA-Z]/g, '');
}
