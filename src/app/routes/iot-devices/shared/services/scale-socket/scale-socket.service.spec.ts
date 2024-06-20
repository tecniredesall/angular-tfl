import { TestBed } from '@angular/core/testing';

import { ScaleSocketService } from './scale-socket.service';

describe('ScaleSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScaleSocketService = TestBed.get(ScaleSocketService);
    expect(service).toBeTruthy();
  });
});
