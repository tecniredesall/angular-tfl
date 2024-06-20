import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import {SealsService} from '../seals.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {SharedModule} from '../../../shared/shared.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Router} from '@angular/router';
import {RouterStub} from '../../../shared/test-utils/test.utils';
import {I18nService} from '../../../shared/i18n/i18n.service';
import {I18nPipe} from '../../../shared/i18n/i18n.pipe';
import {NotifierModule} from 'angular-notifier';

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
      declarations: [],
      imports: [
        SharedModule, HttpClientTestingModule,
        NotifierModule
      ],
      providers: [
        I18nService,
        I18nPipe,
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
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

  it('should delete seal', () => {
    let sealsService: SealsService;
    let mock: MockedSvc;
    sealsService = new SealsService(null);
    mock = new MockedSvc();
    mock.setObservable('1');
    spyOn(sealsService, 'deleteSeal').and.callFake(() => {
      return mock.getObservable();
    }) ;
    component.deleteSeal();
    expect(component).toBeTruthy();
  });
});
