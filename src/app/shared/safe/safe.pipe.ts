/**
 * Programer: Luis Gomez Guerrero
 * Creation Date: 2019/06/16
 * Description: safe pipe service
 * Updated:
 * Comments:
 * Version: 2019.06.26.1300
 * Owner: Grain Chain
 */
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  /**
   * tranfosrn an url in a safe url
   * @param url url to transform
   */
  transform(url): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
