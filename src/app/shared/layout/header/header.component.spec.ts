/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nPipe } from '../../i18n/i18n.pipe';
import { I18nService } from '../../i18n/i18n.service';
import { LayoutService } from '../services/layout.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { PurchaseOrdersService } from 'src/app/routes/purchase-orders/services/purchase-orders.service';

class MockedLanguageService {
    private behaviorSubject = new BehaviorSubject(null);

    getObservable(): Observable<any> {
        return this.behaviorSubject.asObservable();
    }

    setObservable(value: any): void {
        this.behaviorSubject.next(value);
    }
}
const mockedTokenData = {
    permissions: [],
};
let mockedData = {
    data: {
        config: [
            {
                description: 'Language',
                id: 21,
                instance_id: 1,
                name: 'language',
                parameter_id: 21,
                value: {
                    languages: [
                        {
                            name_country_iso: '',
                            code_country_alfa2: '',
                            file: '',
                            default_file: '',
                        },
                    ],
                },
            },
        ],
        email: 'test',
    },
};

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(waitForAsync(() => {
        localStorage.setItem('token-data', JSON.stringify(mockedTokenData));
        let component: HeaderComponent;
        let fixture: ComponentFixture<HeaderComponent>;

        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                SharedModule,
                HttpClientTestingModule,
                FormsModule,
                ReactiveFormsModule,
            ],
            declarations: [],
            providers: [I18nPipe, I18nService, LayoutService],
        });

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    beforeEach(() => {
        localStorage.setItem('token-data', JSON.stringify(mockedTokenData));
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set "en" language when t nav language is Portuguese', () => {
        spyOn(component, 'setLanguage').and.callThrough();

        component.setLanguage("pt");
        fixture.detectChanges();

        // assertions
        expect(component.setLanguage).toHaveBeenCalledTimes(1);
        expect(component.companyLanguage).toEqual('en');
    });

    it('should set "en-capucas" language when CompanyInfo Service returns CAPUCAS information & default nav language is English', () => {
        component.lang = 'en';
        mockedData.data.config[0].value.languages[0].file = 'en_capucas';
        mockedData.data.config[0].value.languages[0].default_file = 'en';

        let purchaseOrdersService: PurchaseOrdersService;
        purchaseOrdersService = new PurchaseOrdersService(null);

        let mock: MockedLanguageService;
        mock = new MockedLanguageService();
        mock.setObservable(mockedData);

        spyOn(component, 'getCompanyInfoData').and.callThrough();

        spyOn(purchaseOrdersService, 'getCompanyInfo').and.callFake(() => {
            return mock.getObservable();
        });

        component.getCompanyInfoData(purchaseOrdersService);

        fixture.detectChanges();

        // assertions
        expect(component.getCompanyInfoData).toHaveBeenCalledTimes(1);
        expect(purchaseOrdersService.getCompanyInfo).toHaveBeenCalledTimes(1);
        expect(component.companyLanguage).toEqual('en_capucas');
    });

    it('should set "es-ecocacao" language when CompanyInfo Service returns ECOCACAO information & default nav language is Spanish', () => {
        component.lang = 'es';
        mockedData.data.config[0].value.languages[0].file = 'es_ecocacao';
        mockedData.data.config[0].value.languages[0].default_file = 'es';

        let purchaseOrdersService: PurchaseOrdersService;
        purchaseOrdersService = new PurchaseOrdersService(null);

        let mock: MockedLanguageService;
        mock = new MockedLanguageService();
        mock.setObservable(mockedData);

        spyOn(component, 'getCompanyInfoData').and.callThrough();

        spyOn(purchaseOrdersService, 'getCompanyInfo').and.callFake(() => {
            return mock.getObservable();
        });

        component.getCompanyInfoData(purchaseOrdersService);

        fixture.detectChanges();

        // assertions
        expect(component.getCompanyInfoData).toHaveBeenCalledTimes(1);
        expect(purchaseOrdersService.getCompanyInfo).toHaveBeenCalledTimes(1);
        expect(component.companyLanguage).toEqual('es_ecocacao');
    });

    it('should set "es" language when CompanyInfo Service returns SOLCAFE information but file "es_capucas" not exists', () => {
        component.lang = 'es';
        mockedData.data.config[0].value.languages[0].file = 'es_capucas';
        mockedData.data.config[0].value.languages[0].default_file = 'es';

        let purchaseOrdersService: PurchaseOrdersService;
        purchaseOrdersService = new PurchaseOrdersService(null);

        let mock: MockedLanguageService;
        mock = new MockedLanguageService();
        mock.setObservable(mockedData);

        spyOn(component, 'getCompanyInfoData').and.callThrough();

        spyOn(purchaseOrdersService, 'getCompanyInfo').and.callFake(() => {
            return mock.getObservable();
        });

        component.getCompanyInfoData(purchaseOrdersService);

        fixture.detectChanges();

        // assertions
        expect(component.getCompanyInfoData).toHaveBeenCalledTimes(1);
        expect(purchaseOrdersService.getCompanyInfo).toHaveBeenCalledTimes(1);
        expect(component.companyLanguage).toEqual('es');
    });
});
