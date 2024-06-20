import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionOrdersComponent } from './retention-orders.component';

describe('RetentionOrdersComponent', () => {
  let component: RetentionOrdersComponent;
  let fixture: ComponentFixture<RetentionOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetentionOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetentionOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
