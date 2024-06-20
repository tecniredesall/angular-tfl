import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ErrorWorkerComponent } from './error-worker.component';

describe('ErrorWorkerComponent', () => {
  let component: ErrorWorkerComponent;
  let fixture: ComponentFixture<ErrorWorkerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorWorkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
