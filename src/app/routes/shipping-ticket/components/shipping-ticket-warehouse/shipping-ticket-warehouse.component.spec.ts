import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShippingTicketWarehouseComponent } from './shipping-ticket-warehouse.component';

describe('ShippingTicketWarehouseComponent', () => {
  let component: ShippingTicketWarehouseComponent;
  let fixture: ComponentFixture<ShippingTicketWarehouseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingTicketWarehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingTicketWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
