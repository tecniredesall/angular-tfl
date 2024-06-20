import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LotCreateResultsFilterComponent } from './lot-create-results-filter.component';

describe('LotCreateResultsFilterComponent', () => {
  let component: LotCreateResultsFilterComponent;
  let fixture: ComponentFixture<LotCreateResultsFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LotCreateResultsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotCreateResultsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
