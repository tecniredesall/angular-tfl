import { TestBed } from '@angular/core/testing';

import { TastingService } from './tasting.service';

describe('TastingService', () => {
  let service: TastingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TastingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
