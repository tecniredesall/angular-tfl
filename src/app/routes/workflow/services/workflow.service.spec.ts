import { TestBed } from '@angular/core/testing';

import { WorkflowService } from './workflow.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('WorkflowService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: WorkflowService = TestBed.get(WorkflowService);
    expect(service).toBeTruthy();
  });
});
