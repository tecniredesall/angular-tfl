import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CsvActionsDropdownComponent } from './csv-actions-dropdown.component';

describe('CsvActionsDropdownComponent', () => {
  let component: CsvActionsDropdownComponent;
  let fixture: ComponentFixture<CsvActionsDropdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvActionsDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvActionsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
