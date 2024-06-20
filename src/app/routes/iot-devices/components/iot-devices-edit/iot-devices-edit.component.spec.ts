import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IotDevicesEditComponent } from './iot-devices-edit.component';

describe('IotDevicesEditComponent', () => {
  let component: IotDevicesEditComponent;
  let fixture: ComponentFixture<IotDevicesEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IotDevicesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IotDevicesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
