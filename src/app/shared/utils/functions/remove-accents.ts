export const removeAccents = (text: string): string => {

  let accents = 'àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ';

  let replacements = 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY';

  let regExpAccents = new RegExp('[' + accents + ']', 'g');

  return text.replace(
    regExpAccents,
    function (match) {
      return replacements[accents.indexOf(match)];
    }
  );

};