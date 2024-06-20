import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalDeleteCommodityTypeComponent } from './modal-delete-commodity-type.component';

describe('ModalDeleteCommodityTypeComponent', () => {
  let component: ModalDeleteCommodityTypeComponent;
  let fixture: ComponentFixture<ModalDeleteCommodityTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeleteCommodityTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteCommodityTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
