import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActionsModalComponent } from './actions-modal.component';

describe('ActionsModalComponent', () => {
  let component: ActionsModalComponent;
  let fixture: ComponentFixture<ActionsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
