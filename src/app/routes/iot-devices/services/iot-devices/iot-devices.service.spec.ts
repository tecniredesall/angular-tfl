import { TestBed } from '@angular/core/testing';

import { IotDevicesService } from './iot-devices.service';

describe('IotDevicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IotDevicesService = TestBed.get(IotDevicesService);
    expect(service).toBeTruthy();
  });
});
