import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nPipe } from 'src/app/shared/i18n/i18n.pipe';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { AlertService } from 'src/app/shared/utils/alerts/alert.service';
import { MatDialogMock } from '../filter/filter.component.spec';

import { DeleteWarehouseTransferComponent } from './delete-warehouse-transfer.component';

describe('DeleteWarehouseTransferComponent', () => {
  let component: DeleteWarehouseTransferComponent;
  let fixture: ComponentFixture<DeleteWarehouseTransferComponent>;

  beforeEach(waitForAsync(() => {
    const id =  "d81f3857-68d2-40d8-92a1-a7ef6e023001";
    TestBed.configureTestingModule({
        declarations: [DeleteWarehouseTransferComponent],
        imports: [
            SharedModule,
            HttpClientTestingModule,
            RouterTestingModule,
            BrowserAnimationsModule,
        ],
        providers: [
            I18nService,
            I18nPipe,
            AlertService,
            {
                provide: MatDialogRef,
                useValue: {},
            },
            {
                provide: MatDialog,
                useClass: MatDialogMock,
            },
            { provide: MAT_DIALOG_DATA, useValue: id },
        ],
    });
    fixture = TestBed.createComponent(DeleteWarehouseTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
}));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteWarehouseTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('should disabled save button when reasonDelete is null', () => {
    component.reasonDelete.setValue(null);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.delete-warehouse-transfer__buttons--accept')).nativeElement;
    expect(button.disabled).toBeTruthy();
  });

  fit('should active save button when reasonDelete is valid', () => {
    component.reasonDelete.setValue("Delete reason");
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.delete-warehouse-transfer__buttons--accept')).nativeElement;
    expect(button.disabled).toBeFalse();
  });
});
