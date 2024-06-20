import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SortMachineComponent } from './sort-machine.component';

describe('SortMachineComponent', () => {
  let component: SortMachineComponent;
  let fixture: ComponentFixture<SortMachineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SortMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
