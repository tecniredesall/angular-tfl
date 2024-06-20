import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IotDevicesDataFormComponent } from './iot-devices-data-form.component';

describe('IotDevicesDataFormComponent', () => {
  let component: IotDevicesDataFormComponent;
  let fixture: ComponentFixture<IotDevicesDataFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IotDevicesDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IotDevicesDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
