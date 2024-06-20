import { TestBed } from '@angular/core/testing';

import { LotEventsService } from './lot-events.service';

describe('LotEventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LotEventsService = TestBed.get(LotEventsService);
    expect(service).toBeTruthy();
  });
});
