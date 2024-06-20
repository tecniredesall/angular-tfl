
const characters = '0123456789';
const charactersString = 'ABCDEFGJHIJKLMNÑOPQRSTUVWXYZ0123456789';
const charactersletter = 'ABCDEFGJHIJKLMNÑOPQRSTUVWXYZ';



function generateNumber(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function generateOnlyLetter(length) {
    let result = '';
    const charactersLength = charactersletter.length;
    for (let i = 0; i < length; i++) {
        result += charactersletter.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


function generateString(length) {
    let result = '';
    const charactersLength = charactersString.length;
    for (let i = 0; i < length; i++) {
        result += charactersString.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {
    generateString
    ,getRandomInt
    ,generateNumber
    ,generateOnlyLetter
}
