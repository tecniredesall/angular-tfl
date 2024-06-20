import { TestBed } from '@angular/core/testing';

import { RetentionOrdersService } from './retention-orders.service';

describe('RetentionOrdersService', () => {
  let service: RetentionOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetentionOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
