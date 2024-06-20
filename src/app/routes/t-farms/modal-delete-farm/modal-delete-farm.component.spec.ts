import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalDeleteFarmComponent } from './modal-delete-farm.component';

describe('ModalDeleteFarmComponent', () => {
  let component: ModalDeleteFarmComponent;
  let fixture: ComponentFixture<ModalDeleteFarmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeleteFarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteFarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
