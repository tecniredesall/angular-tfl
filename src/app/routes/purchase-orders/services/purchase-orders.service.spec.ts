/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { PurchaseOrdersService } from './purchase-orders.service';

describe('Service: PurchaseOrders', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PurchaseOrdersService]
    });
  });

  it('should ...', inject([PurchaseOrdersService], (service: PurchaseOrdersService) => {
    expect(service).toBeTruthy();
  }));
});
