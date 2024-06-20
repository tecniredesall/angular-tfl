/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { WeightService } from './weight.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('Service: Weight', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeightService]
    });
  });

  it('should ...', inject([WeightService], (service: WeightService) => {
    expect(service).toBeTruthy();
  }));
});
