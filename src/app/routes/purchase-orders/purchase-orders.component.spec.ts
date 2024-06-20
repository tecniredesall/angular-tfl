import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';

import { PurchaseOrdersComponent } from './purchase-orders.component';
import { PurchaseOrdersService } from './services/purchase-orders.service';

export class MatDialogMock {
    open() {
        return {
            afterClosed: () => of({ action: true }),
        };
    }
}

class MockedCurrencyService {
    private behaviorSubject = new BehaviorSubject(null);

    getObservable(): Observable<any> {
        return this.behaviorSubject.asObservable();
    }

    setObservable(value: any): void {
        this.behaviorSubject.next(value);
    }
}

const mockedData = {
    data: {
        config: [
            {
                description: 'Moneda',
                id: 20,
                instance_id: 1,
                name: 'currency',
                parameter_id: 20,
                value: {
                    name: 'Peso Mexicano',
                    symbol: '$',
                    description: 'Peso Mexicano',
                    iso_code: 'MXN',
                },
            },
        ],
    },
};

describe('PurchaseOrdersComponent', () => {
    let component: PurchaseOrdersComponent;
    let fixture: ComponentFixture<PurchaseOrdersComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [
                SharedModule,
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [
                I18nService,
                I18nPipe,
                {
                    provide: MatDialogRef,
                    useValue: {},
                },
                {
                    provide: MatDialog,
                    useClass: MatDialogMock,
                },
            ],
        });
        fixture = TestBed.createComponent(PurchaseOrdersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PurchaseOrdersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get currency data from API', () => {
        let purchaseOrdersService: PurchaseOrdersService;
        purchaseOrdersService = new PurchaseOrdersService(null);

        let mock: MockedCurrencyService;
        mock = new MockedCurrencyService();
        mock.setObservable(mockedData);

        spyOn(component, 'getCompanyInfo').and.callThrough();

        spyOn(purchaseOrdersService, 'getCompanyInfo').and.callFake(() => {
            return mock.getObservable();
        });

        component.getCompanyInfo(purchaseOrdersService);

        fixture.detectChanges();

        // assertions
        expect(component.getCompanyInfo).toHaveBeenCalledTimes(1);
        expect(purchaseOrdersService.getCompanyInfo).toHaveBeenCalledTimes(1);
        expect(component.companyInfo.currency.isoCode).toEqual(
            mockedData.data.config[0].value.iso_code
        );
    });

    it('should get default currency data when API fails', () => {
        let purchaseOrdersService: PurchaseOrdersService;
        purchaseOrdersService = new PurchaseOrdersService(null);

        let mock: MockedCurrencyService;
        mock = new MockedCurrencyService();

        spyOn(component, 'getCompanyInfo').and.callThrough();

        spyOn(purchaseOrdersService, 'getCompanyInfo').and.callFake(() => {
            return throwError(new Error('Fake error'));
        });

        component.getCompanyInfo(purchaseOrdersService);

        fixture.detectChanges();

        // assertions
        expect(component.getCompanyInfo).toHaveBeenCalledTimes(1);
        expect(purchaseOrdersService.getCompanyInfo).toHaveBeenCalledTimes(1);
        expect(component.companyInfo.currency.isoCode).toEqual(
            CONSTANTS.DEFAULT_CURRENCY.isoCode
        );
    });
});
