import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseTransferInComponent } from './warehouse-transfer-in.component';

describe('WarehouseTransferInComponent', () => {
  let component: WarehouseTransferInComponent;
  let fixture: ComponentFixture<WarehouseTransferInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseTransferInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseTransferInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
