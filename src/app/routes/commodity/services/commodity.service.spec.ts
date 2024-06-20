/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { CommodityService } from './commodity.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('Service: Commodity', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommodityService]
    });
  });

  it('should ...', inject([CommodityService], (service: CommodityService) => {
    expect(service).toBeTruthy();
  }));
});
