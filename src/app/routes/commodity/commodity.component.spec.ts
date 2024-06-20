/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommodityComponent } from './commodity.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {BlockUIModule} from 'ng-block-ui';
import {NotifierModule} from 'angular-notifier';
import {I18nPipe} from '../../shared/i18n/i18n.pipe';
import {I18nService} from '../../shared/i18n/i18n.service';
import {CommodityService} from './services/commodity.service';
import {MaterialModule} from '../../material.module';
import {ActionCommodityComponent} from './actions/action-commodity.component';
import {ActionTypesCommodityComponent} from './action-types/action-types-commodity.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {Router} from '@angular/router';
import {RouterStub} from '../../shared/test-utils/test.utils';

describe('CommodityComponent', () => {
  let component: CommodityComponent;
  let fixture: ComponentFixture<CommodityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        NgSelectModule,
        SharedModule,
        BlockUIModule.forRoot(),
        NotifierModule
      ],
      declarations: [
        CommodityComponent,
        ActionCommodityComponent,
        ActionTypesCommodityComponent
      ],
      providers: [
        I18nPipe,
        I18nService,
        CommodityService,
        {
          provide: Router,
          useClass: RouterStub
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
