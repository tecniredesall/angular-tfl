import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IotAvailableDevicesComponent } from './iot-available-devices.component';

describe('IotAvailableDevicesComponent', () => {
  let component: IotAvailableDevicesComponent;
  let fixture: ComponentFixture<IotAvailableDevicesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IotAvailableDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IotAvailableDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
