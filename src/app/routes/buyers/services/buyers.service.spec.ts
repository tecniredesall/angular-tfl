import { TestBed } from '@angular/core/testing';

import { BuyersService } from './buyers.service';

describe('BuyersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuyersService = TestBed.inject(BuyersService);
    expect(service).toBeTruthy();
  });
});
