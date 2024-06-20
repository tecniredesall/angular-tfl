import { TestBed } from '@angular/core/testing';

import { TBlockService } from './block.service';

describe('TBlockService', () => {
  let service: TBlockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TBlockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
