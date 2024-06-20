import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubTankCardComponent } from './sub-tank-card.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SharedModule} from '../../../shared/shared.module';
import {I18nService} from '../../../shared/i18n/i18n.service';
import {I18nPipe} from '../../../shared/i18n/i18n.pipe';
import {Router} from '@angular/router';
import {RouterStub} from '../../../shared/test-utils/test.utils';
import {MaterialModule} from '../../../material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('SubTankCardComponent', () => {
  let component: SubTankCardComponent;
  let fixture: ComponentFixture<SubTankCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ SubTankCardComponent ],
      providers: [
        I18nService,
        I18nPipe,
        {
          provide: Router,
          useClass: RouterStub
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTankCardComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
