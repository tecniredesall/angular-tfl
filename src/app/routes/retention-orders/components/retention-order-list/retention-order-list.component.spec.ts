import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { WarehouseModule } from 'src/app/routes/warehouse/warehouse.module';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListRetentionOrderMock } from 'src/app/shared/test-utils/mocks/retention-order/retention-order-list';
import { RouterStub, ActivatedRouteStub } from 'src/app/shared/test-utils/test.utils';
import { NotificationsModule } from 'src/app/shared/utils/notifications/notifications.module';
import { RetentionOrderModel } from '../../models/retention-orders-model';
import { RetentionOrderListComponent } from './retention-order-list.component';

xdescribe('RetentionOrderListComponent', () => {
  let component: RetentionOrderListComponent;
  let fixture: ComponentFixture<RetentionOrderListComponent>;
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
      declarations: [ RetentionOrderListComponent ],
      providers: [
        I18nPipe,
        I18nService,
        NotifierService,
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
        fixture = TestBed.createComponent(RetentionOrderListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
    })
  }));

  beforeEach(() => {
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should Load list', () => {
    component.retentionOders = ListRetentionOrderMock.data.data.map(x => new RetentionOrderModel(x))
    fixture.detectChanges()
    const elements = el.nativeElement.querySelector('#list-retention-orders')
    const inputElement = elements.querySelectorAll('.panel-receiving-note-notes')
    expect(inputElement.length).toBeGreaterThan(1)
  });

  xit('Should Click to New Order', () => {
    const elements = el.nativeElement.querySelector('#retention-btn-new')
    expect(el).toBeTruthy()
  });

});
