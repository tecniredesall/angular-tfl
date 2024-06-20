import { TestBed } from '@angular/core/testing';

import { FeatureFlagsService } from './feature-flags.service';

describe('FeatureFlagsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeatureFlagsService = TestBed.get(FeatureFlagsService);
    expect(service).toBeTruthy();
  });
});
