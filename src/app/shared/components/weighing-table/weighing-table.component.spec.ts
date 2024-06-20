import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WeighingTableComponent } from './weighing-table.component';

describe('WeighingTableComponent', () => {
  let component: WeighingTableComponent;
  let fixture: ComponentFixture<WeighingTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WeighingTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeighingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
