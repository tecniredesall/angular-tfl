import { RetentionOrderModel } from './../../models/retention-orders-model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { WarehouseModule } from 'src/app/routes/warehouse/warehouse.module';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterStub, ActivatedRouteStub } from 'src/app/shared/test-utils/test.utils';
import { NotificationsModule } from 'src/app/shared/utils/notifications/notifications.module';
import { RetentionOrderViewComponent } from './retention-order-view.component';
import { Responser0rderDetail } from 'src/app/shared/test-utils/mocks/retention-order/retention-order-detail';
import { DecimalPipe } from '@angular/common';

fdescribe('RetentionOrderViewComponent', () => {
  let component: RetentionOrderViewComponent;
  let fixture: ComponentFixture<RetentionOrderViewComponent>;
  let el: DebugElement;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
            SharedModule,
            FormsModule,
            ReactiveFormsModule,
            WarehouseModule,
            NotificationsModule,
            NotifierModule,
            NoopAnimationsModule

          ],
      declarations: [ RetentionOrderViewComponent ],
      providers: [
        I18nPipe,
        I18nService,
        NotifierService,
        DecimalPipe,
        {
          provide: Router,
          useClass: RouterStub
        },
        {
          provide: ActivatedRoute,
          useValue: ActivatedRouteStub
        }
      ]
    })
    .compileComponents()
    .then(() => {
        fixture = TestBed.createComponent(RetentionOrderViewComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
    })
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load retention order', () => {
    const order = new RetentionOrderModel(Responser0rderDetail.data)
    component.currentRetentionOrder = order
    expect(component).toBeTruthy();
  });


  fit('validate folio', () => {
    const order = new RetentionOrderModel(Responser0rderDetail.data)
    component.currentRetentionOrder = order
    fixture.detectChanges()
    const folio = el.nativeElement.querySelector('#folio_label').innerHTML
    console.log(`folio >>>>>>>>>> ${folio}`)
    expect(folio).toEqual(`#${order.folio}`)
  });

  fit('check Download File', fakeAsync(() => {
    spyOn(component, 'onDownload');
    const order = new RetentionOrderModel(Responser0rderDetail.data)
    component.currentRetentionOrder = order
    fixture.detectChanges()
    const btnDownload = el.nativeElement.querySelector('#btn_download')
    btnDownload.click();
    tick();
    expect(component.onDownload).toHaveBeenCalled();
  }));

  fit('check Print File', fakeAsync(() => {
    spyOn(component, 'onPrint');
    const order = new RetentionOrderModel(Responser0rderDetail.data)
    component.currentRetentionOrder = order
    fixture.detectChanges()
    const btnDownload = el.nativeElement.querySelector('#btn_print')
    btnDownload.click();
    tick();
    expect(component.onPrint).toHaveBeenCalled();
  }));

});
