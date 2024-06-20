import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { FeatureFlagsGuard } from './feature-flags.guard';

describe('FeatureFlagsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeatureFlagsGuard]
    });
  });

  it('should ...', inject([FeatureFlagsGuard], (guard: FeatureFlagsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
