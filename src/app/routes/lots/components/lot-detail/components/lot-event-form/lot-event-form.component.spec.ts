import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LotEventFormComponent } from './lot-event-form.component';

describe('LotEventFormComponent', () => {
  let component: LotEventFormComponent;
  let fixture: ComponentFixture<LotEventFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LotEventFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
