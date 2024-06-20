/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DriversComponent } from './drivers.component';
import {I18nPipe} from '../../shared/i18n/i18n.pipe';
import {FormsModule} from '@angular/forms';
import {ActionDriversComponent} from './actions/actions-driver.component';
import {DriversService} from './services/drivers.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Router} from '@angular/router';
import {I18nService} from '../../shared/i18n/i18n.service';
import {SharedModule} from '../../shared/shared.module';
import {SearchPipe} from './search.pipe';
import {MaterialModule} from '../../material.module';
import {NotifierModule} from 'angular-notifier';
import {BlockUIModule} from 'ng-block-ui';

class RouterStub {
  navigate: (params) => {

  };
}

describe('DriversComponent', () => {
  let component: DriversComponent;
  let fixture: ComponentFixture<DriversComponent>;
  let service: DriversService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DriversComponent,
        ActionDriversComponent,
        SearchPipe
      ],
      imports: [
        FormsModule,
        SharedModule,
        NotifierModule,
        BlockUIModule.forRoot(),
        MaterialModule,
        HttpClientTestingModule
      ],
      providers: [
        DriversService,
        SearchPipe,
        {
          provide: Router,
          useClass: RouterStub
        },
        I18nPipe,
        I18nService,

      ]
    });
    fixture = TestBed.createComponent(DriversComponent);
    component = fixture.componentInstance;
    service = new DriversService(null);
  }));
  it('should create', () => {
    // spyOn()
    expect(component).toBeTruthy();
  });
});
