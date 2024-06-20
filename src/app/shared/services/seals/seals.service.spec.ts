import { TestBed } from '@angular/core/testing';

import { SealsService } from './seals.service';

describe('SealsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SealsService = TestBed.get(SealsService);
    expect(service).toBeTruthy();
  });
});
