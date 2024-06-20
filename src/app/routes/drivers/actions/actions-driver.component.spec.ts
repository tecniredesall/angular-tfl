/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActionDriversComponent } from './actions-driver.component';
import {SharedModule} from '../../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BlockUIModule} from 'ng-block-ui';
import {I18nPipe} from '../../../shared/i18n/i18n.pipe';
import {I18nService} from '../../../shared/i18n/i18n.service';
import {Router} from '@angular/router';
import {RouterStub} from '../../../shared/test-utils/test.utils';
import {DriversService} from '../services/drivers.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NotifierModule} from 'angular-notifier';
import {SearchPipe} from '../search.pipe';

describe('ActionDriversComponent', () => {
  let component: ActionDriversComponent;
  let fixture: ComponentFixture<ActionDriversComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        FormsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        NotifierModule,
        BlockUIModule.forRoot(),
      ],
      declarations: [
        ActionDriversComponent,
      ],
      providers: [
        I18nPipe,
        I18nService,
        DriversService,
        SearchPipe,
        {
          provide: Router,
          useClass: RouterStub
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
