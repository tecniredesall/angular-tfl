import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotResultsFoundComponent } from './not-results-found.component';

describe('NotResultsFoundComponent', () => {
  let component: NotResultsFoundComponent;
  let fixture: ComponentFixture<NotResultsFoundComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotResultsFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotResultsFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
