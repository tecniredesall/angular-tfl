export const convertStringToNumber = (
    text: string,
    allowNull: boolean = false
): number => {
    if (allowNull && null == text) {
        return null;
    }
    if (!text) {
        return 0;
    }
    text = text.toString().replace(/[^0-9\-\.]/gm, '');
    return +text;
};
