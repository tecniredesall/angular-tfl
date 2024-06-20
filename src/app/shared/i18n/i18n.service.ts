import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, delay, map, take } from 'rxjs/operators';

import { HttpBackend, HttpClient } from '@angular/common/http';
import {
    ApplicationRef,
    EventEmitter,
    Injectable,
    NgZone,
    Output,
} from '@angular/core';
import { CONSTANTS } from '../utils/constants/constants';

@Injectable()
export class I18nService {
    public state;
    public data: {};
    // tslint:disable-next-line: variable-name
    private _http: HttpClient;
    @Output() langEmitter = new EventEmitter();
    public lang = new BehaviorSubject(null);
    langChanged = this.lang.asObservable();
    // tslint:disable-next-line: variable-name
    constructor(private ref: ApplicationRef, handler: HttpBackend) {
        this._http = new HttpClient(handler);
        this.state = new Subject();
        this.initLanguage();
    }
    /**
     * Set new lang in variable
     * @param locale language for get -us, es-
     */

    public fetchLanguage(language: string, company?: string): string {
        language = this.isValidLanguage(language)
            ? language
            : CONSTANTS.AVAILABLE_LANGUAGE.DEFAULT.en;

        this.get(`${CONSTANTS.LANGUAGE_PATH}${language}.json`)
            .pipe(take(1))
            .subscribe((data: any) => {
                this.data = data;
                this.lang.next(language);
                this.ref.tick();

                localStorage.setItem('lang', language);

                if (this.isValidCompanyLanguage(company)) {
                    this.setCompanyLanguage(company);
                } else {
                    localStorage.setItem('companyLanguage', language);
                }
            });

        return this.isValidCompanyLanguage(company) ? company : language;
    }

    private initLanguage(): void {
        const userLang =
            localStorage.getItem('companyLanguage') === null
                ? navigator.language.split('-')
                : localStorage.getItem('companyLanguage').split('_');

        const language = this.isValidLanguage(userLang[0])
            ? userLang[0]
            : CONSTANTS.AVAILABLE_LANGUAGE.DEFAULT.en;
        const company = this.isValidCompanyLanguage(
            `${userLang[0]}_${userLang[1]}`
        )
            ? `${userLang[0]}_${userLang[1]}`
            : null;

        this.fetchLanguage(language, company);
    }

    public isValidLanguage(language: string): boolean {
        return CONSTANTS.AVAILABLE_LANGUAGE.DEFAULT.hasOwnProperty(language);
    }

    private isValidCompanyLanguage(companyLanguage: string): boolean {
        return CONSTANTS.AVAILABLE_LANGUAGE.COMPANY.hasOwnProperty(
            companyLanguage
        );
    }

    private setCompanyLanguage(companyLanguage) {
        this.get(
            `${CONSTANTS.LANGUAGE_PATH}${CONSTANTS.AVAILABLE_LANGUAGE.COMPANY[companyLanguage]}.json`
        )
            .pipe(take(1))
            .subscribe((labels: any) => {
                for (const key in labels) {
                    this.data[key] = labels[key];
                }
                localStorage.setItem('companyLanguage', companyLanguage);
            });
    }
    /**
     * subscribe to change
     * @param sub subscription
     * @param err error
     */
    subscribe(sub: any, err: any): void {
        return this.state.subscribe(sub, err);
    }
    /**
     * translate
     * @param phrase phrase to translate
     */
    public getTranslation(phrase: string): string {
        return this.data && this.data[phrase] ? this.data[phrase] : phrase;
    }
    /**
     * get base uri
     */
    private getBaseUrl() {
        return (
            location.protocol +
            '//' +
            location.hostname +
            (location.port ? ':' + location.port : '') +
            '/'
        );
    }
    /**
     * get data from local
     * @param url url data
     */
    public get(url): Observable<any> {
        return this._http.get(this.getBaseUrl() + url).pipe(
            delay(500),
            map((data: any) => data.data || data),
            catchError(this.handleError)
        );
    }
    /**
     * handle error
     * @param error error
     */
    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        const errMsg = error.message
            ? error.message
            : error.status
            ? `${error.status} - ${error.statusText}`
            : 'Server error';
        // tslint:disable-next-line: deprecation
        return throwError(errMsg);
    }
}
