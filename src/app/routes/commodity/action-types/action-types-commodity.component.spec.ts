/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ActionCommodityComponent} from '../actions/action-commodity.component';
import {SharedModule} from '../../../shared/shared.module';
import {BlockUIModule} from 'ng-block-ui';
import {I18nPipe} from '../../../shared/i18n/i18n.pipe';
import {I18nService} from '../../../shared/i18n/i18n.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CommodityService} from '../services/commodity.service';
import {Router} from '@angular/router';
import {RouterStub} from '../../../shared/test-utils/test.utils';
import {NotifierModule} from 'angular-notifier';

describe('ActionCommodityComponent', () => {
  let component: ActionCommodityComponent;
  let fixture: ComponentFixture<ActionCommodityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NotifierModule,
        HttpClientTestingModule,
        BlockUIModule.forRoot(),
      ],
      declarations: [ ActionCommodityComponent ],
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
    fixture = TestBed.createComponent(ActionCommodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
