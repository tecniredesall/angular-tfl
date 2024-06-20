import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SortMachineListenerComponent } from './sort-machine-listener.component';

describe('SortMachineListenerComponent', () => {
  let component: SortMachineListenerComponent;
  let fixture: ComponentFixture<SortMachineListenerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SortMachineListenerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortMachineListenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
