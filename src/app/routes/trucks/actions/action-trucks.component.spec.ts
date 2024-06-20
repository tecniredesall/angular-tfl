/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActionTrucksComponent } from './action-trucks.component';
import {I18nPipe} from '../../../shared/i18n/i18n.pipe';
import {I18nService} from '../../../shared/i18n/i18n.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MaterialModule} from '../../../material.module';
import {BlockUIModule} from 'ng-block-ui';
import {SharedModule} from '../../../shared/shared.module';
import {TrucksService} from '../services/trucks.service';
import {Router} from '@angular/router';
import {RouterStub} from '../../../shared/test-utils/test.utils';
import {NotifierModule} from 'angular-notifier';

describe('ActionTrucksComponent', () => {
  let component: ActionTrucksComponent;
  let fixture: ComponentFixture<ActionTrucksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MaterialModule,
        NotifierModule,
        BlockUIModule.forRoot(),
        SharedModule
      ],
      declarations: [ ActionTrucksComponent ],
      providers: [
        I18nPipe,
        I18nService,
        TrucksService,
        {
          provide: Router,
          useClass: RouterStub,
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionTrucksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
