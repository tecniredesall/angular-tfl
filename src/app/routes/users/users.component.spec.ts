/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {I18nPipe} from '../../shared/i18n/i18n.pipe';
import {I18nService} from '../../shared/i18n/i18n.service';
import {CUDRequestComponent} from '../../shared/CUDRequest/CUDRequest.component';
import {BlockUIModule} from 'ng-block-ui';
import {ActionUserComponent} from './actions/action-user.component';
import {TextMaskModule} from 'angular2-text-mask';
import {UserService} from './services/user.service';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,
        HttpClientTestingModule,
        FormsModule,
        TextMaskModule,
        BlockUIModule.forRoot(),
        ReactiveFormsModule
      ],
      declarations: [
        UsersComponent,
        CUDRequestComponent,
        ActionUserComponent
      ],
      providers: [
        I18nPipe,
        I18nService,
        UserService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
