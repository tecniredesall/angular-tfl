/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { WarehouseTransferService } from './warehouse-transfer.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('Service: Weight', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WarehouseTransferService]
    });
  });

  it('should ...', inject([WarehouseTransferService], (service: WarehouseTransferService) => {
    expect(service).toBeTruthy();
  }));
});
