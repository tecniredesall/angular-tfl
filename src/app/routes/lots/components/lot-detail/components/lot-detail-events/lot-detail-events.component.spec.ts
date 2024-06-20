import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LotDetailEventsComponent } from './lot-detail-events.component';

describe('LotDetailEventsComponent', () => {
  let component: LotDetailEventsComponent;
  let fixture: ComponentFixture<LotDetailEventsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LotDetailEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotDetailEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
