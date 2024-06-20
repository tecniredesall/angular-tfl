import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalDeleteCommodityComponent } from './modal-delete-commodity.component';

describe('ModalDeleteCommodityComponent', () => {
  let component: ModalDeleteCommodityComponent;
  let fixture: ComponentFixture<ModalDeleteCommodityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeleteCommodityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteCommodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
