import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditWeightNoteComponent } from './edit-weight-note.component';

describe('EditWeightNoteComponent', () => {
  let component: EditWeightNoteComponent;
  let fixture: ComponentFixture<EditWeightNoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWeightNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWeightNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
