import { TestBed } from '@angular/core/testing';

import { CustomDateAdapterService } from './custom-date-adapter.service';

describe('CustomDateAdapterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomDateAdapterService = TestBed.get(CustomDateAdapterService);
    expect(service).toBeTruthy();
  });
});
