import { TestBed } from '@angular/core/testing';

import { CountryLookupsService } from './country-lookups.service';

describe('CountryLookupsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CountryLookupsService = TestBed.get(CountryLookupsService);
    expect(service).toBeTruthy();
  });
});
