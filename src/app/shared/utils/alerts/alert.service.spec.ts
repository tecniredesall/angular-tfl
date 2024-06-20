/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { AlertService } from './alert.service';
import {Router} from '@angular/router';
import {RouterStub} from '../../test-utils/test.utils';
import {I18nPipe} from '../../i18n/i18n.pipe';
import {I18nService} from '../../i18n/i18n.service';
import {SharedModule} from '../../shared.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('Service: Alert', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientTestingModule
      ],
      providers: [
        I18nPipe,
        AlertService,
        I18nService,
        {
          provide: Router,
          useClass: RouterStub
        }
      ]
    });
  });

  it('should ...', inject([AlertService], (service: AlertService) => {
    expect(service).toBeTruthy();
  }));
});
