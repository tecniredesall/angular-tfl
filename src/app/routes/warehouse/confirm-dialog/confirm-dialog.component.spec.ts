import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import {BehaviorSubject, Observable} from 'rxjs';
import {SharedModule} from '../../../shared/shared.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {I18nService} from '../../../shared/i18n/i18n.service';
import {I18nPipe} from '../../../shared/i18n/i18n.pipe';
import {RouterStub} from '../../../shared/test-utils/test.utils';
import {Router} from '@angular/router';

class MockedSvc {
  private behaviorSubject = new BehaviorSubject(null);

  getObservable(): Observable<any> {
    return this.behaviorSubject.asObservable();
  }

  setObservable(value: any): void {
    this.behaviorSubject.next(value);
  }
}

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientTestingModule
      ],
      declarations: [],
      providers: [
        I18nService,
        I18nPipe,
        {
          provide: Router,
          useClass: RouterStub
        },

      ]
    });
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

});
