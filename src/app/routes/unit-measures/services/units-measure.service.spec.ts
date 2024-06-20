/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { UnitMeasuresService } from './units-measure.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('Service: UnitsMeasure', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UnitMeasuresService]
    });
  });

  it('should ...', inject([UnitMeasuresService], (service: UnitMeasuresService) => {
    expect(service).toBeTruthy();
  }));
});
