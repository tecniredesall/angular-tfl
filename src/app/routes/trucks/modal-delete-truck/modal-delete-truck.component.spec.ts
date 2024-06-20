import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalDeleteTruckComponent } from './modal-delete-truck.component';

describe('ModalDeleteTruckComponent', () => {
  let component: ModalDeleteTruckComponent;
  let fixture: ComponentFixture<ModalDeleteTruckComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeleteTruckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteTruckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
