import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LotDeleteDialogComponent } from './lot-delete-dialog.component';

describe('LotDeleteDialogComponent', () => {
  let component: LotDeleteDialogComponent;
  let fixture: ComponentFixture<LotDeleteDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LotDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
