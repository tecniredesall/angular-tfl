import { Pipe, PipeTransform } from '@angular/core';

import { I18nService } from './i18n.service';

@Pipe({
    name: 'i18n',
    pure: false,
})
export class I18nPipe implements PipeTransform {
    constructor(public i18nService: I18nService) {}
    /**
     * tranform text
     * @param phrase phrase to translate
     * @param args args
     */
    transform(phrase: any, arg?: any): any {
        return arg
            ? this.i18nService.getTranslation(phrase).replace('[value]', arg)
            : this.i18nService.getTranslation(phrase);
    }
}
