/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrucksComponent } from './trucks.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BlockUIModule} from 'ng-block-ui';
import {I18nPipe} from '../../shared/i18n/i18n.pipe';
import {I18nService} from '../../shared/i18n/i18n.service';
import {Router} from '@angular/router';
import {RouterStub} from '../../shared/test-utils/test.utils';
import {SearchPipe} from './search.pipe';
import {MaterialModule} from '../../material.module';
import {ActionTrucksComponent} from './actions/action-trucks.component';
import {TrucksService} from './services/trucks.service';
import {NotifierModule} from 'angular-notifier';

describe('TrucksComponent', () => {
  let component: TrucksComponent;
  let fixture: ComponentFixture<TrucksComponent>;

  beforeEach(() => {
    const user = {
      // tslint:disable-next-line:max-line-length
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjExNWJlYzkxODI4NmRhN2MxNzU0ZjA4ZWZkYjVhZTZhZTJlMTkwYmZlYTg1ZTQ4YjMwZDIzMGIwMWE4ZGU0ZWRiNWZmYWVlNzIyZWFmMGQ1In0.eyJhdWQiOiIxIiwianRpIjoiMTE1YmVjOTE4Mjg2ZGE3YzE3NTRmMDhlZmRiNWFlNmFlMmUxOTBiZmVhODVlNDhiMzBkMjMwYjAxYThkZTRlZGI1ZmZhZWU3MjJlYWYwZDUiLCJpYXQiOjE1OTQzMzY3NzksIm5iZiI6MTU5NDMzNjc3OSwiZXhwIjoxNTk1NjMyNzc5LCJzdWIiOiIxMDQiLCJzY29wZXMiOlsiKiJdfQ.d9mo-jP01hkQa15XH7_RsO8FejWb9mDf5PYEGlqlf-Zs6xOkBtGu8oMuCqRkbAsHLwm6RJykBUT0UraBrYsfv1ZzJ9MstnwteCLDgrRHWPVERoZcrzYYBycY4sFBiOfWSEgJDfyb5m-zibWpCZUbeI-uImvlrXBxQ-U_e9w5O79Ebx1uqWHwjfZIyrKlVsqc0WAzBRJYvuEYRsDH18vvmJ69qfvwKMxeHMqhglprrW7NO2sgYi6uu6uv-ezGWeISIv2voCj44GggUQrOfXuiKJB1o0JehhMOzUdtYjayS8k2O1GhYUJAISWEjZbZ0J6LVViE6iUHCtBWkRKUkLCTsi8ELZ-XFnq68pLmFXmcyxxZEjxQcmYuo8I8eyyKpbkUHxXJs9e6VhTV3ax6Vh4Snn24-sh2Wuj-30QUsf8vuJS_24AxhzLelwJyY8NHHMQPXfO0U-8ebVFLSJU7zzuIowc_ZiFYki7gpQyPj1AAlhGQT4LINmcBEkC0ZqohRIIzT3VgCHlYwtf0CxHD_0nXqhCBxlJTrcrotf-oWiULn5fPP6Y6n30t595iAABAL561bhcIPFxf9JtKUUmpB3jqgIVfbkHEZu9kgjFL_Tt5OvfwiNTtm1XCIrd5Ij4_ANDnCKpvw0mw23MZfyfDFljurSijXDk-u3JPiW2UHAWwlf8',
      tokenType: 'Bearer',
      userName: 'Luis Gomez',
      session: 104
    };
    localStorage.setItem('token-data', JSON.stringify(user));

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
        FormsModule,
        MaterialModule,
        NotifierModule,
        ReactiveFormsModule,
        BlockUIModule.forRoot()
      ],
      declarations: [
        TrucksComponent,
        SearchPipe,
        ActionTrucksComponent
      ],
      providers: [
        I18nPipe,
        I18nService,
        TrucksService,
        {
          provide: Router,
          useClass: RouterStub
        }
      ]
    });
    fixture = TestBed.createComponent(TrucksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
