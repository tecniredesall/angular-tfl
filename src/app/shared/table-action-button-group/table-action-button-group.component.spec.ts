import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TableActionButtonGroupComponent } from './table-action-button-group.component';

describe('TableActionButtonGroupComponent', () => {
  let component: TableActionButtonGroupComponent;
  let fixture: ComponentFixture<TableActionButtonGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableActionButtonGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableActionButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
