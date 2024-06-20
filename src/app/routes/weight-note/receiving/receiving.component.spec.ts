/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReceivingComponent } from './receiving.component';
import {SharedModule} from '../../../shared/shared.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BlockUIModule} from 'ng-block-ui';
import {NotifierModule} from 'angular-notifier';
import {I18nService} from '../../../shared/i18n/i18n.service';
import {I18nPipe} from '../../../shared/i18n/i18n.pipe';
import {NgSelectModule} from '@ng-select/ng-select';
import {RouterTestingModule} from '@angular/router/testing';
import {DriversService} from '../../drivers/services/drivers.service';
import {TrucksService} from '../../trucks/services/trucks.service';
import {CommodityService} from '../../commodity/services/commodity.service';
import {DatePipe} from '@angular/common';

describe('ReceivingComponent', () => {
  let component: ReceivingComponent;
  let fixture: ComponentFixture<ReceivingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        BlockUIModule.forRoot(),
        NotifierModule
      ],
      declarations: [
        ReceivingComponent
      ],
      providers: [
        DriversService,
        TrucksService,
        CommodityService,
        DatePipe,
        I18nService,
        I18nPipe,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
