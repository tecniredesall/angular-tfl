/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DetailMovementComponent } from './detail-movement.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { PermissionsService } from 'src/app/shared/services/permissions/permissions.service';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { WarehouseTransferService } from '../../services/warehouse-transfer.service';
import { By } from '@angular/platform-browser';

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

describe('DetailMovementComponent', () => {
  let component: DetailMovementComponent;
  let fixture: ComponentFixture<DetailMovementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
          SharedModule,
          HttpClientTestingModule,
          RouterTestingModule,
          BrowserAnimationsModule,
      ],
      providers: [
          I18nService,
          I18nPipe,
          AlertService,
          PermissionsService
      ],
    })
      fixture = TestBed.createComponent(DetailMovementComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get not found results component data when API fails', () => {
    let _warehouseTransferService: WarehouseTransferService;
    _warehouseTransferService = new WarehouseTransferService(null);

    let mock: MockedCurrencyService;
    mock = new MockedCurrencyService();

    spyOn(component, 'getWarehouseTransferDetail').and.callThrough();

    spyOn(_warehouseTransferService, 'getWarehouseTransferenceByID').and.callFake(() => {
        return throwError(new Error('Fake error'));
    });

    component.getWarehouseTransferDetail(_warehouseTransferService);

    fixture.detectChanges();

    // assertions
    expect(component.getWarehouseTransferDetail).toHaveBeenCalledTimes(1);
    expect(_warehouseTransferService.getWarehouseTransferenceByID).toHaveBeenCalledTimes(1);
    });
});
