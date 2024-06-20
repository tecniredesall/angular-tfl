import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhoneCodeDropdownComponent } from './phone-code-dropdown.component';

describe('PhoneCodeDropdownComponent', () => {
  let component: PhoneCodeDropdownComponent;
  let fixture: ComponentFixture<PhoneCodeDropdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneCodeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneCodeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
