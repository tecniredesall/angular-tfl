import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalNotesAssociatedComponent } from './modal-notes-associated.component';

describe('ModalNotesAssociatedComponent', () => {
  let component: ModalNotesAssociatedComponent;
  let fixture: ComponentFixture<ModalNotesAssociatedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNotesAssociatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNotesAssociatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
