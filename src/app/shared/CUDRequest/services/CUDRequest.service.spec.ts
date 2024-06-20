/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { CUDRequestService } from './CUDRequest.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('Service: CUDRequest', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [CUDRequestService]
    });
  });

  it('should ...', inject([CUDRequestService], (service: CUDRequestService) => {
    expect(service).toBeTruthy();
  }));
});
