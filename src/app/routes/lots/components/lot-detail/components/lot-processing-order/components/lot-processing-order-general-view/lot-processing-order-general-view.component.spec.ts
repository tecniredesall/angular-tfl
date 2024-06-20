import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LotProcessingOrderGeneralViewComponent } from './lot-processing-order-general-view.component';

describe('LotProcessingOrderGeneralViewComponent', () => {
  let component: LotProcessingOrderGeneralViewComponent;
  let fixture: ComponentFixture<LotProcessingOrderGeneralViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LotProcessingOrderGeneralViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotProcessingOrderGeneralViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
