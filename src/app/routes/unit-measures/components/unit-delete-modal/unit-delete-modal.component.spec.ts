import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnitDeleteModalComponent } from './unit-delete-modal.component';

describe('UnitDeleteModalComponent', () => {
  let component: UnitDeleteModalComponent;
  let fixture: ComponentFixture<UnitDeleteModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
