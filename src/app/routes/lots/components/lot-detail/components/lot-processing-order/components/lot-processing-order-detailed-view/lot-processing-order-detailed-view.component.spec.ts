/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LotProcessingOrderDetailedViewComponent } from './lot-processing-order-detailed-view.component';

describe('LotProcessingOrderDetailedViewComponent', () => {
  let component: LotProcessingOrderDetailedViewComponent;
  let fixture: ComponentFixture<LotProcessingOrderDetailedViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LotProcessingOrderDetailedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotProcessingOrderDetailedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
