import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionOrderCreateComponent } from './retention-order-create.component';

describe('RetentionOrderCreateComponent', () => {
  let component: RetentionOrderCreateComponent;
  let fixture: ComponentFixture<RetentionOrderCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetentionOrderCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetentionOrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
