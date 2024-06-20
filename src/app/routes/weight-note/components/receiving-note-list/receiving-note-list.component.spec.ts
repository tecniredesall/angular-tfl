import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReceivingNoteListComponent } from './receiving-note-list.component';

describe('ReceivingNoteListComponent', () => {
  let component: ReceivingNoteListComponent;
  let fixture: ComponentFixture<ReceivingNoteListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivingNoteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
