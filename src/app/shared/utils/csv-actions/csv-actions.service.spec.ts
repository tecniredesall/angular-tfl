import { TestBed } from '@angular/core/testing';

import { CSVActionsService } from './csv-actions.service';

describe('CSVActionsService', () => {
  let service: CSVActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CSVActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
