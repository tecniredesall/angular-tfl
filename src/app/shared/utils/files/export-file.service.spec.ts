/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { ExportFilesService } from './export-file.service';

describe('Service: Excel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportFilesService]
    });
  });

  it('should ...', inject([ExportFilesService], (service: ExportFilesService) => {
    expect(service).toBeTruthy();
  }));
});
