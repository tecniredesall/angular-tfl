import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IotDevicesDeleteModalComponent } from './iot-devices-delete-modal.component';

describe('IotDevicesDeleteModalComponent', () => {
  let component: IotDevicesDeleteModalComponent;
  let fixture: ComponentFixture<IotDevicesDeleteModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IotDevicesDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IotDevicesDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
