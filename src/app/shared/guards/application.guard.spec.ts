import { TestBed, inject } from '@angular/core/testing';

import { ApplicationGuard } from './application.guard';
import {Router} from '@angular/router';
import {RouterStub} from '../test-utils/test.utils';

describe('ApplicationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApplicationGuard,
        {
          provide: Router,
          useClass: RouterStub
        }
      ]
    });
  });

  it('should ...', inject([ApplicationGuard], (guard: ApplicationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
