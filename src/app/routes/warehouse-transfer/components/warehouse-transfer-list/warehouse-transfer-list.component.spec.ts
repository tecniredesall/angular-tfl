import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WarehouseTransferListComponent } from './warehouse-transfer-list.component';

describe('WarehouseTransferListComponent', () => {
  let component: WarehouseTransferListComponent;
  let fixture: ComponentFixture<WarehouseTransferListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseTransferListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
