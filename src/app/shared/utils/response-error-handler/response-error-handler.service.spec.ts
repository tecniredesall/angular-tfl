import { TestBed } from '@angular/core/testing';

import { ResponseErrorHandlerService } from './response-error-handler.service';

describe('ResponseErrorHandlerService', () => {
  let service: ResponseErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponseErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
