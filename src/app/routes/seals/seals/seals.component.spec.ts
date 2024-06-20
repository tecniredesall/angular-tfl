import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SealsComponent } from './seals.component';
import {I18nPipe} from '../../../shared/i18n/i18n.pipe';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../../../material.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Router} from '@angular/router';
import {I18nService} from '../../../shared/i18n/i18n.service';
import {BlockUiComponent} from '../../../shared/block/block.component';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {DomSanitizer} from '@angular/platform-browser';
import {of} from 'rxjs';
import {SharedModule} from '../../../shared/shared.module';
import {ModalResponse} from '../../../shared/test-utils/test.utils';

describe('SealsComponent', () => {

  let component: SealsComponent;
  let fixture: ComponentFixture<SealsComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of(ModalResponse), close: null });

  class RouterStub {
    navigate(params) {

    }
  }

  class SanitizerStub {
    bypassSecurityTrustUrl(params: string) {
      return `secured-${params}`;
    }

    sanitize(params: string) {
      return params;
    }
  }
  beforeEach((() => {
    const user = {
      // tslint:disable-next-line:max-line-length
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjExNWJlYzkxODI4NmRhN2MxNzU0ZjA4ZWZkYjVhZTZhZTJlMTkwYmZlYTg1ZTQ4YjMwZDIzMGIwMWE4ZGU0ZWRiNWZmYWVlNzIyZWFmMGQ1In0.eyJhdWQiOiIxIiwianRpIjoiMTE1YmVjOTE4Mjg2ZGE3YzE3NTRmMDhlZmRiNWFlNmFlMmUxOTBiZmVhODVlNDhiMzBkMjMwYjAxYThkZTRlZGI1ZmZhZWU3MjJlYWYwZDUiLCJpYXQiOjE1OTQzMzY3NzksIm5iZiI6MTU5NDMzNjc3OSwiZXhwIjoxNTk1NjMyNzc5LCJzdWIiOiIxMDQiLCJzY29wZXMiOlsiKiJdfQ.d9mo-jP01hkQa15XH7_RsO8FejWb9mDf5PYEGlqlf-Zs6xOkBtGu8oMuCqRkbAsHLwm6RJykBUT0UraBrYsfv1ZzJ9MstnwteCLDgrRHWPVERoZcrzYYBycY4sFBiOfWSEgJDfyb5m-zibWpCZUbeI-uImvlrXBxQ-U_e9w5O79Ebx1uqWHwjfZIyrKlVsqc0WAzBRJYvuEYRsDH18vvmJ69qfvwKMxeHMqhglprrW7NO2sgYi6uu6uv-ezGWeISIv2voCj44GggUQrOfXuiKJB1o0JehhMOzUdtYjayS8k2O1GhYUJAISWEjZbZ0J6LVViE6iUHCtBWkRKUkLCTsi8ELZ-XFnq68pLmFXmcyxxZEjxQcmYuo8I8eyyKpbkUHxXJs9e6VhTV3ax6Vh4Snn24-sh2Wuj-30QUsf8vuJS_24AxhzLelwJyY8NHHMQPXfO0U-8ebVFLSJU7zzuIowc_ZiFYki7gpQyPj1AAlhGQT4LINmcBEkC0ZqohRIIzT3VgCHlYwtf0CxHD_0nXqhCBxlJTrcrotf-oWiULn5fPP6Y6n30t595iAABAL561bhcIPFxf9JtKUUmpB3jqgIVfbkHEZu9kgjFL_Tt5OvfwiNTtm1XCIrd5Ij4_ANDnCKpvw0mw23MZfyfDFljurSijXDk-u3JPiW2UHAWwlf8',
      tokenType: 'Bearer',
      userName: 'Luis Gomez',
      session: 104
    };
    localStorage.setItem('token-data', JSON.stringify(user));

    TestBed.configureTestingModule({
      declarations: [
        SealsComponent
      ],
      imports: [
        FormsModule,
        MaterialModule,
        SharedModule,
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
        I18nPipe,
        I18nService
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {set: {
        entryComponents: [ BlockUiComponent ]
        }})
    .compileComponents();
    fixture = TestBed.createComponent(SealsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  }));

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should clear the searchText variable on clearSearch', () => {
  //
  //   component.clearSearch();
  //
  //   expect(component.searchText).toEqual('');
  // });

  // it('on correct image should return the image sanitizated', () => {
  //   const seal = {image: 'someURI'};
  //
  //   const result = component.sourceImage(seal);
  //
  //   expect(result).toEqual(`secured-${seal.image}`);
  // });

  // it('on undefined image should return the default value', () => {
  //   const seal = {};
  //
  //   const result = component.sourceImage(seal);
  //
  //   expect(result).toEqual('./assets/img/svg/empty-image.svg');
  // });

  // it('should open a dialog on openModal method', () => {
  //   dialogRefSpyObj.componentInstance = { body: '' };
  //   dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  //
  //   component.openModal('title', null);
  //
  //   expect(dialogSpy).toHaveBeenCalled();
  // });

  // it('should call afterClosed method on openModal method', () => {
  //   dialogRefSpyObj.componentInstance = { body: '' };
  //   dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  //
  //   component.openModal('title', null);
  //
  //   expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  // });

  // it('should set the sealList on getSeals methods', () => {
  //   const sealsObject: ResponseModel = {
  //     status: true,
  //     message: 'test',
  //     data: [
  //       {certification_id: 1, name: 'test', image: 'image1'}
  //     ]
  //   };
  //   const service = TestBed.get(SealsService);
  //   spyOn(service, 'getSeals').and.callFake(() => {
  //     return of(sealsObject);
  //   });
  //
  //   component.getSeals();
  //
  //   expect(component.sealsList.length).toBeGreaterThan(0);
  // });

  // it('should log the error on getSeals methods error', () => {
  //   const error = new Error('Error!');
  //   const service = TestBed.get(SealsService);
  //   const blockService = TestBed.get(BlockService);
  //   const blockSpy = spyOn(blockService, 'stop');
  //   spyOn(service, 'getSeals').and.returnValue(throwError(error));
  //
  //   component.getSeals();
  //
  //   expect(blockSpy).toHaveBeenCalled();
  // });

  // it('should open a dialog on deleteSeal method', () => {
  //   const seal = {
  //     related_farms: 0
  //   };
  //   dialogRefSpyObj.componentInstance = { body: '' };
  //   dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  //
  //   component.deleteSeal(seal);
  //
  //   expect(dialogSpy).toHaveBeenCalled();
  //
  // });

  // it('on new Seal, should navigate to create route', () => {
  //
  // });
});
