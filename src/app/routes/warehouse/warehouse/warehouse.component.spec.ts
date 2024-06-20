import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WarehouseComponent } from './warehouse.component';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../shared/shared.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {I18nPipe} from '../../../shared/i18n/i18n.pipe';
import {I18nService} from '../../../shared/i18n/i18n.service';
import {LayoutService} from '../../../shared/layout/services/layout.service';
import {SearchPipe} from '../search.pipe';
import {MaterialModule} from '../../../material.module';
import {SubTankCardComponent} from '../sub-tank-card/sub-tank-card.component';

describe('WarehouseComponent', () => {
  let component: WarehouseComponent;
  let fixture: ComponentFixture<WarehouseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,
        HttpClientTestingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        WarehouseComponent,
        SearchPipe,
        SubTankCardComponent
      ],
      providers: [
        I18nPipe,
        I18nService,
        LayoutService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
