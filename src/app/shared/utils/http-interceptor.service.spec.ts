/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { HttpInterceptorService } from './http-interceptor.service';
import {Router} from '@angular/router';
import {RouterStub} from '../test-utils/test.utils';
import {RouterTestingModule} from '@angular/router/testing';

describe('Service: HttpInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpInterceptorService,
        RouterTestingModule,
        {
          provide: Router,
          useClass: RouterStub
        }
      ]
    });
  });

  it('should ...', inject([HttpInterceptorService], (service: HttpInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
