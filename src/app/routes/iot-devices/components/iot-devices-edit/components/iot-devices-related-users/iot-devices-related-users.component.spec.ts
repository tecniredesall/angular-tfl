import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IotDevicesRelatedUsersComponent } from './iot-devices-related-users.component';

describe('IotDevicesRelatedUsersComponent', () => {
  let component: IotDevicesRelatedUsersComponent;
  let fixture: ComponentFixture<IotDevicesRelatedUsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IotDevicesRelatedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IotDevicesRelatedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
