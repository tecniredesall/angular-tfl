import { TestBed } from '@angular/core/testing';

import { ShippingTicketService } from './shipping-ticket.service';

describe('ShippingTicketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShippingTicketService = TestBed.get(ShippingTicketService);
    expect(service).toBeTruthy();
  });
});
