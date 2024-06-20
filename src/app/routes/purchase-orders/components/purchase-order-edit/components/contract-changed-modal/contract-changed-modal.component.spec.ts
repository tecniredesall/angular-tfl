import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContractChangedModalComponent } from './contract-changed-modal.component';

describe('ContractChangedModalComponent', () => {
  let component: ContractChangedModalComponent;
  let fixture: ComponentFixture<ContractChangedModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractChangedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractChangedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
