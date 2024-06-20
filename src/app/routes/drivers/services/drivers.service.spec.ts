/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { DriversService } from './drivers.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('Service: Drivers', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DriversService]
    });
  });

  it('should ...', inject([DriversService], (service: DriversService) => {
    expect(service).toBeTruthy();
  }));
});
