import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeleteWeightNoteComponent } from './delete-weight-note.component';

describe('DeleteWeightNoteComponent', () => {
  let component: DeleteWeightNoteComponent;
  let fixture: ComponentFixture<DeleteWeightNoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteWeightNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteWeightNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
