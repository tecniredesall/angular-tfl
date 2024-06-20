import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchaseOrderRelatedNotesComponent } from './purchase-order-related-notes.component';

describe('PurchaseOrderRelatedNotesComponent', () => {
  let component: PurchaseOrderRelatedNotesComponent;
  let fixture: ComponentFixture<PurchaseOrderRelatedNotesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderRelatedNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderRelatedNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
