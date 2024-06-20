import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScaleDialogComponent } from './scale-dialog.component';

describe('ScaleDialogComponent', () => {
  let component: ScaleDialogComponent;
  let fixture: ComponentFixture<ScaleDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScaleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScaleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
