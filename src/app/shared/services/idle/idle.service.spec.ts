import { TestBed } from '@angular/core/testing';

import { IdleService } from './idle.service';

describe('IdleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IdleService = TestBed.get(IdleService);
    expect(service).toBeTruthy();
  });
});
