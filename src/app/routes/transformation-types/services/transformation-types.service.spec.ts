/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { TransformationTypesService } from './transformation-types.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('Service: TransformationTypes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransformationTypesService]
    });
  });

  it('should ...', inject([TransformationTypesService], (service: TransformationTypesService) => {
    expect(service).toBeTruthy();
  }));
});
