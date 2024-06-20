import { TestBed } from '@angular/core/testing';

import { WarehouseService } from './warehouse.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('WarehouseService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: WarehouseService = TestBed.get(WarehouseService);
    expect(service).toBeTruthy();
  });
});
