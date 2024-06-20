import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IotDevicesComponent } from './iot-devices.component';

describe('IotDevicesComponent', () => {
  let component: IotDevicesComponent;
  let fixture: ComponentFixture<IotDevicesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IotDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IotDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
