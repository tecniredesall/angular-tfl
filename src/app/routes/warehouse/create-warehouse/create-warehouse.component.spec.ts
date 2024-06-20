import { TypeTankModel } from './../models/type-tanks';
import { NotificationsModule } from './../../../shared/utils/notifications/notifications.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateWarehouseComponent } from './create-warehouse.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SharedModule} from '../../../shared/shared.module';
import {I18nPipe} from '../../../shared/i18n/i18n.pipe';
import {I18nService} from '../../../shared/i18n/i18n.service';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import {WarehouseModule} from '../warehouse.module';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from '../../../shared/test-utils/test.utils';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { DebugElement, SimpleChange, SimpleChanges } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { WarehouseService } from '../warehouse.service';
import { of, Observable } from 'rxjs';
import { responseWarehouseSuma } from 'src/app/shared/test-utils/mocks/warehouse/warehouse-suma';
import { IProdExternalWarehouseModel, ProdExternalWarehouseModel } from '../models/prod-external-warehouse.model';
import { typeTanksMock } from 'src/app/shared/test-utils/mocks/warehouse/types-tanks';


describe('CreateWarehouseComponent', () => {
  let component: CreateWarehouseComponent;
  let fixture: ComponentFixture<CreateWarehouseComponent>;
  let el: DebugElement;


  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        WarehouseModule,
        NotificationsModule,
        NotifierModule,
        NoopAnimationsModule

      ],
      declarations: [],
      providers: [
        I18nPipe,
        I18nService,
        NotifierService,
        {
          provide: Router,
          useClass: RouterStub
        },
        {
          provide: ActivatedRoute,
          useValue: ActivatedRouteStub
        }
      ]
    })
    .compileComponents()
    .then(() => {
        fixture = TestBed.createComponent(CreateWarehouseComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
    })
  }));

  beforeEach(() => {

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form group was created', () => {

    component.addTankControl()
    fixture.detectChanges()
    const elements = el.nativeElement.querySelector('#formTanks')
    const inputElement = elements.querySelectorAll('input[formcontrolname="name"]')
    expect(inputElement.length).toEqual(1)

  });


  it('Testing the initial reactive form values', () => {

    component.addTankControl()
    fixture.detectChanges()

    const formGroupValues = (component.tanks.at(0) as UntypedFormGroup)
    const formValues = {
        name: '',
        externalId: null,
        idTypeTank: null
    }
    expect(formGroupValues.value).toEqual(formValues)

  });


  fit('Testing disbled external id  after select types of tank ', () => {

    component.addTankControl()
    fixture.detectChanges()

    component.typesTanks = typeTanksMock.map(x=> new TypeTankModel(x))
    console.log(component.typesTanks);

    const formGroupValues = (component.tanks.at(0) as UntypedFormGroup)
    formGroupValues.patchValue({
        idTypeTank: CONSTANTS.TYPE_OF_TANKS.VIRTUAL
    })
    component.setTypeTank( component.typesTanks.find(x=> x.id == CONSTANTS.TYPE_OF_TANKS.VIRTUAL ) , 0)
    fixture.detectChanges()

    expect(formGroupValues.controls.externalId.disabled).toBe(true)

  });

});
export class WarehouseServiceMock  {

    public getExternals(): Observable<Array<IProdExternalWarehouseModel>> {
        let subtanks: IProdExternalWarehouseModel[] = responseWarehouseSuma.data.map(r => new ProdExternalWarehouseModel(r))
        return of(subtanks)
    }
  }
