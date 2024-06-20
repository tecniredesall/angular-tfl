import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WarehouseInputComponent } from './warehouse-input.component';

describe('WarehouseInputComponent', () => {
  let component: WarehouseInputComponent;
  let fixture: ComponentFixture<WarehouseInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ WarehouseInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
