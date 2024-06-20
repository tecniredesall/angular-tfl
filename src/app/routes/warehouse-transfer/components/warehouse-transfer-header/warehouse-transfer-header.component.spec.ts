/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WarehouseTransferHeaderComponent } from './warehouse-transfer-header.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BlockUIModule} from 'ng-block-ui';
import {SharedModule} from '../../../../shared/shared.module';
import {I18nPipe} from '../../../../shared/i18n/i18n.pipe';
import {I18nService} from '../../../../shared/i18n/i18n.service';
import {Router} from '@angular/router';
import {RouterStub} from '../../../../shared/test-utils/test.utils';
import {RouterTestingModule} from '@angular/router/testing';

describe('WarehouseTransferHeaderComponent', () => {
  let component: WarehouseTransferHeaderComponent;
  let fixture: ComponentFixture<WarehouseTransferHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        WarehouseTransferHeaderComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BlockUIModule.forRoot(),
        SharedModule
      ],
      providers: [
        I18nPipe,
        I18nService,
        {
          provide: Router,
          useClass: RouterStub
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseTransferHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
