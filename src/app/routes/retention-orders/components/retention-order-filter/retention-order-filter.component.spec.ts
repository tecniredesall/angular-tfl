import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterStub, ActivatedRouteStub } from 'src/app/shared/test-utils/test.utils';
import { NotificationsModule } from 'src/app/shared/utils/notifications/notifications.module';

import { RetentionOrderFilterComponent } from './retention-order-filter.component';

fdescribe('RetentionOrderFilterComponent', () => {
    let component: RetentionOrderFilterComponent;
    let fixture: ComponentFixture<RetentionOrderFilterComponent>;
    let el: DebugElement;

  beforeEach( waitForAsync (() => {
    TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
            SharedModule,
            FormsModule,
            ReactiveFormsModule,
            NotificationsModule,
            NotifierModule,
            NoopAnimationsModule
          ],
      declarations: [ RetentionOrderFilterComponent ],
      providers: [
        I18nPipe,
        I18nService,
        NotifierService,
        AlertService,
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
    .then(()=> {
        fixture = TestBed.createComponent(RetentionOrderFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })
  }));

  beforeEach(() => { });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
