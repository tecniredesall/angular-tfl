/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { TrucksService } from './trucks.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('Service: Trucks', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TrucksService]
    });
  });

  it('should ...', inject([TrucksService], (service: TrucksService) => {
    expect(service).toBeTruthy();
  }));
});
