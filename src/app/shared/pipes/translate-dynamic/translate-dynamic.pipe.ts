import { Pipe, PipeTransform } from '@angular/core';
export interface GeneralLanguage {
  [index: string]: string;
}

@Pipe({
  name: 'translateDynamic'
})
export class TranslateDynamicPipe implements PipeTransform {

  transform(args: GeneralLanguage | any, lang: string = 'es'): string {
    try {
      let translate = args[lang];

      if (!translate) {
        const codeLang = lang.split('-')[0];
        translate = args[codeLang];
      }

      return translate ?? args.default ?? args;
    } catch (e) { }
    return '';
  }

}
