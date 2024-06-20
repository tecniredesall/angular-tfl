import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IotDevicesListComponent } from './iot-devices-list.component';

describe('IotDevicesListComponent', () => {
  let component: IotDevicesListComponent;
  let fixture: ComponentFixture<IotDevicesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IotDevicesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IotDevicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
