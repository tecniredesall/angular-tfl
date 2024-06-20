/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DetailNoteComponent } from './detail-note.component';
import {SharedModule} from '../../../shared/shared.module';
import {I18nPipe} from '../../../shared/i18n/i18n.pipe';
import {I18nService} from '../../../shared/i18n/i18n.service';
import {Router} from '@angular/router';
import {RouterStub} from '../../../shared/test-utils/test.utils';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DetailNoteComponent', () => {
  let component: DetailNoteComponent;
  let fixture: ComponentFixture<DetailNoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientTestingModule
      ],
      declarations: [ DetailNoteComponent ],
      providers: [
        I18nPipe,
        I18nService,
        {
          provide: Router,
          useClass: RouterStub
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
