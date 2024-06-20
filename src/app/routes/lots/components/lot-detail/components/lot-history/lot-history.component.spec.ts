import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LotHistoryComponent } from './lot-history.component';

describe('LotHistoryComponent', () => {
  let component: LotHistoryComponent;
  let fixture: ComponentFixture<LotHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LotHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
