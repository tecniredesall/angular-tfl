import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReceivingNoteListProductionComponent } from './receiving-note-list-production.component';

describe('ReceivingNoteListProductionComponent', () => {
  let component: ReceivingNoteListProductionComponent;
  let fixture: ComponentFixture<ReceivingNoteListProductionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivingNoteListProductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingNoteListProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
