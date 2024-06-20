import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {SharedModule} from './shared/shared.module';
import {NotifierModule} from 'angular-notifier';
import {I18nService} from './shared/i18n/i18n.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {I18nPipe} from './shared/i18n/i18n.pipe';
import {LayoutService} from './shared/layout/services/layout.service';

fdescribe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,
        NotifierModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        I18nService,
        I18nPipe,
        LayoutService
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
