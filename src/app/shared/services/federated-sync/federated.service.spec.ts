/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { FederatedService } from './federated.service';

describe('Service: Federated', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FederatedService]
    });
  });

  it('should ...', inject([FederatedService], (service: FederatedService) => {
    expect(service).toBeTruthy();
  }));
});
