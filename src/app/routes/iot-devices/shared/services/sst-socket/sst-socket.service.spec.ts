import { TestBed } from '@angular/core/testing';

import { SstSocketService } from './sst-socket.service';

describe('SstSocketService', () => {
  let service: SstSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SstSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
