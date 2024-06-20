import { ComponentFixture, TestBed } from '@angular/core/testing';


import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatDialogRefStub} from '../../../shared/test-utils/test.utils';
import {WorkflowConfirmDialogComponent} from './workflow-confirm-dialog.component';
import {I18nService} from '../../../shared/i18n/i18n.service';
import {I18nPipe} from '../../../shared/i18n/i18n.pipe';
import {MaterialModule} from '../../../material.module';
import {SharedModule} from '../../../shared/shared.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';


describe('WorkflowConfirmDialogComponent', () => {
  let component: WorkflowConfirmDialogComponent;
  let fixture: ComponentFixture<WorkflowConfirmDialogComponent>;
  const data = { name: 'some'};
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowConfirmDialogComponent ],
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        SharedModule
      ],
      providers: [
        I18nService,
        I18nPipe,
        {
          provide: MatDialogRef,
          useClass: MatDialogRefStub
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: data
        }
      ]
    });
    fixture = TestBed.createComponent(WorkflowConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should send the value on close method', () => {
    const dialogRef = TestBed.get(MatDialogRef);

    const spy = spyOn(dialogRef, 'close').and.returnValue(true);
    component.submit();

    expect(spy).toHaveBeenCalledWith(true);
  });
});
