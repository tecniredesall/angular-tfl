import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SortMachineDialogComponent } from './sort-machine-dialog.component';

describe('SortMachineDialogComponent', () => {
  let component: SortMachineDialogComponent;
  let fixture: ComponentFixture<SortMachineDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SortMachineDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortMachineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
