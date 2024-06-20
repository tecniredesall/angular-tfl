import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LotReprocessDialogComponent } from './lot-reprocess-dialog.component';

describe('LotReprocessDialogComponent', () => {
  let component: LotReprocessDialogComponent;
  let fixture: ComponentFixture<LotReprocessDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LotReprocessDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotReprocessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
