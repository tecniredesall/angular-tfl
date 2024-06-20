import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotifierComponent } from './notifier.component';
import {MaterialModule} from '../../material.module';
import {I18nPipe} from '../i18n/i18n.pipe';
import {I18nService} from '../i18n/i18n.service';
import {SharedModule} from '../shared.module';
import {NotifyService} from './notify.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('NotifierComponent', () => {
  let component: NotifierComponent;
  let fixture: ComponentFixture<NotifierComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
        BrowserAnimationsModule,
        MaterialModule
      ],
      declarations: [ ],
      providers: [
        I18nPipe,
        I18nService,
        NotifyService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
