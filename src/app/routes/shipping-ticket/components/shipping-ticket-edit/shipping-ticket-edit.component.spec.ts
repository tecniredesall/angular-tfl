import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShippingTicketEditComponent } from './shipping-ticket-edit.component';

describe('ShippingTicketEditComponent', () => {
  let component: ShippingTicketEditComponent;
  let fixture: ComponentFixture<ShippingTicketEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingTicketEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingTicketEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
