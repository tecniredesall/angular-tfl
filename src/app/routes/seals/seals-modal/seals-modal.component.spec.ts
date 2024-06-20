import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SealsModalComponent } from './seals-modal.component';
import {I18nPipe} from '../../../shared/i18n/i18n.pipe';
import {SealsComponent} from '../seals/seals.component';
import {SearchPipe} from 'src/app/routes/warehouse/search.pipe';
import {BlockUiComponent} from '../../../shared/block/block.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../material.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {I18nService} from '../../../shared/i18n/i18n.service';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {SharedModule} from '../../../shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

class RouterStub {
  navigate(params) {

  }
}

class DialogData {

}

class SanitizerStub {
  bypassSecurityTrustUrl(params: string) {
    return `secured-${params}`;
  }
  sanitize() {
    return 'safeString';
  }
}

describe('SealsModalComponent', () => {

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  let component: SealsModalComponent;
  let fixture: ComponentFixture<SealsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SealsComponent,
        SealsModalComponent,
        SearchPipe,
      ],
      imports: [
        FormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        SharedModule,
        MatDialogModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: Router,
          useClass: RouterStub
        },
        {
          provide: DomSanitizer,
          useClass: SanitizerStub
        },
        {
          provide: MAT_DIALOG_DATA,
          useClass: DialogData
        },
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        I18nPipe,
        I18nService
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {set: {
          entryComponents: [ BlockUiComponent, SealsModalComponent ]
        }})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SealsModalComponent);
    let store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    spyOn(localStorage, 'getItem')
      .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(mockLocalStorage.clear);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
