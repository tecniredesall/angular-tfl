/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { AuthenticationGuard} from './authentication.guard';
import {Router} from '@angular/router';
import {RouterStub} from '../test-utils/test.utils';

describe('Service:AuthenticationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationGuard,
        {
          provide: Router,
          useClass: RouterStub
        }
      ]
    });
  });

  it('should ...', inject([AuthenticationGuard], (service: AuthenticationGuard) => {
    expect(service).toBeTruthy();
  }));
});
